import { PAYLOAD_API_KEY, PAYLOAD_URL } from 'astro:env/server'

import { findInSnapshot, generatedAt, globalFromSnapshot, hasCollection } from './snapshot'
import type { Doc, Global, Page, PaginatedDocs, Post, Category } from './types'

export type FindArgs = {
  /** Payload `where` query, serialised into the querystring. */
  where?: Record<string, unknown>
  sort?: string
  limit?: number
  page?: number
  depth?: number
  /** Return only these top-level fields. The snapshot ignores it and returns all. */
  select?: string[]
  /**
   * Include unpublished documents. Authenticates with PAYLOAD_API_KEY,
   * since Payload only returns drafts to a signed-in user.
   */
  draft?: boolean
}

class PayloadError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message)
    this.name = 'PayloadError'
  }
}

/** Flattens a nested `where` object into Payload's bracket querystring form. */
const serialiseWhere = (
  where: Record<string, unknown>,
  params: URLSearchParams,
  prefix = 'where',
): void => {
  for (const [key, value] of Object.entries(where)) {
    const path = `${prefix}[${key}]`

    if (Array.isArray(value)) {
      value.forEach((entry, i) => {
        if (entry && typeof entry === 'object') {
          serialiseWhere(entry as Record<string, unknown>, params, `${path}[${i}]`)
        } else {
          params.append(`${path}[${i}]`, String(entry))
        }
      })
    } else if (value && typeof value === 'object') {
      serialiseWhere(value as Record<string, unknown>, params, path)
    } else if (value !== undefined) {
      params.append(path, String(value))
    }
  }
}

const buildQuery = ({ where, sort, limit, page, depth, select, draft }: FindArgs): string => {
  const params = new URLSearchParams()

  if (where) serialiseWhere(where, params)
  if (sort) params.set('sort', sort)
  if (limit !== undefined) params.set('limit', String(limit))
  if (page !== undefined) params.set('page', String(page))
  if (depth !== undefined) params.set('depth', String(depth))
  for (const field of select ?? []) params.set(`select[${field}]`, 'true')
  if (draft) params.set('draft', 'true')

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

const TIMEOUT_MS = 8000

// Once one request has found the CMS unreachable — a timeout or a refused
// connection, not an HTTP error — the rest of the render would find the same,
// and a page is several requests deep: the page itself, then the header,
// footer and settings, then any block that lists other pages. Each waiting its
// full 8 seconds in turn is how a service page took 40 seconds to stream while
// the CMS was waking up. So for a short while after a failure, requests give
// up at once and the snapshot answers immediately. Drafts never take the
// shortcut: previews must fail loudly rather than quietly show stale content.
const BREAK_MS = 30_000
let brokenUntil = 0

const request = async <T>(path: string, draft = false): Promise<T> => {
  const url = `${PAYLOAD_URL}/api${path}`

  if (draft && !PAYLOAD_API_KEY) {
    throw new Error('PAYLOAD_API_KEY must be set to read draft content.')
  }

  if (!draft && Date.now() < brokenUntil) {
    throw new PayloadError(`Payload at ${PAYLOAD_URL} was unreachable moments ago; skipping ${path}`, 503, url)
  }

  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(draft ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` } : {}),
      },
      // Drafts change constantly and must never be shared between viewers.
      cache: draft ? 'no-store' : 'default',
      // A CMS that is waking up should not hold a visitor's page; past this the
      // request counts as unreachable and the snapshot answers instead.
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    if (!draft) brokenUntil = Date.now() + BREAK_MS
    throw error
  }

  if (!res.ok) {
    throw new PayloadError(`Payload responded ${res.status} for ${path}`, res.status, url)
  }

  return (await res.json()) as T
}

/**
 * True when the CMS could not be reached at all, or answered with a server
 * error — as opposed to answering "no such document", which is a real answer.
 *
 * The site then answers from the committed snapshot, so an outage of the CMS
 * shows visitors slightly old content rather than an error page.
 */
const unreachable = (error: unknown): boolean =>
  error instanceof PayloadError ? error.status >= 500 : true

let warned = false

const fallback = <T>(collection: string, error: unknown, read: () => T): T => {
  if (!warned) {
    warned = true
    console.warn(
      `[payload] ${PAYLOAD_URL} is unreachable — serving the snapshot taken ${generatedAt}. ` +
        'Run `pnpm --filter web snapshot` after content edits, or point PAYLOAD_URL at a live CMS.',
    )
  }
  if (collection && !hasCollection(collection)) throw error
  return read()
}

const mergePageSnapData = (liveDoc: Page, snapDoc: Page): void => {
  if (!liveDoc.layout || !snapDoc.layout) return

  // 1. Logo wall: preserve all logos from snapshot if live has fewer
  const snapWall = snapDoc.layout.find((b: any) => b.blockType === 'logoWall') as any
  const liveWallIndex = liveDoc.layout.findIndex((b: any) => b.blockType === 'logoWall')
  if (snapWall && liveWallIndex !== -1) {
    const liveWall = liveDoc.layout[liveWallIndex] as any
    if ((liveWall.logos?.length ?? 0) < (snapWall.logos?.length ?? 0)) {
      liveDoc.layout[liveWallIndex] = {
        ...liveWall,
        logos: snapWall.logos,
      }
    }
  }

  // 2. Industries block: preserve sector links from snapshot if live has null/missing hrefs
  const snapInd = snapDoc.layout.find((b: any) => b.blockType === 'industries') as any
  const liveIndIndex = liveDoc.layout.findIndex((b: any) => b.blockType === 'industries')
  if (snapInd && liveIndIndex !== -1) {
    const liveInd = liveDoc.layout[liveIndIndex] as any
    const liveHasHrefs = Array.isArray(liveInd.sectors) && liveInd.sectors.some((s: any) => Boolean(s.href))
    const snapHasHrefs = Array.isArray(snapInd.sectors) && snapInd.sectors.some((s: any) => Boolean(s.href))
    if (!liveHasHrefs && snapHasHrefs) {
      liveDoc.layout[liveIndIndex] = {
        ...liveInd,
        sectors: snapInd.sectors,
      }
    }
  }
}

/** Fetch a page of documents from a collection. */
export const find = async <T>(collection: string, args: FindArgs = {}): Promise<PaginatedDocs<T>> => {
  try {
    const result = await request<PaginatedDocs<T>>(`/${collection}${buildQuery(args)}`, args.draft)

    // For collections like 'pages' (e.g. sitemap or listing), if the live CMS is missing
    // newly added inner pages or has stale records, merge with snapshot so that
    // sitemap and listings reflect committed pages.
    if (!args.draft && collection === 'pages' && hasCollection('pages')) {
      try {
        const snap = findInSnapshot<T>('pages', args)
        const liveDocs = result.docs as any[]
        const liveSlugs = new Set(liveDocs.map((d: any) => d?.slug).filter(Boolean))

        // Pages present in snapshot but not yet in the live database
        const missingDocs = (snap.docs as any[]).filter((d: any) => d?.slug && !liveSlugs.has(d.slug))

        // For pages in both, prefer the one with the newer updatedAt
        const mergedDocs = liveDocs.map((liveDoc: any) => {
          if (!liveDoc?.slug) return liveDoc
          const snapDoc = (snap.docs as any[]).find((s: any) => s?.slug === liveDoc.slug)
          if (!snapDoc) return liveDoc

          const liveUpdated = liveDoc.updatedAt ? new Date(liveDoc.updatedAt).getTime() : 0
          const snapUpdated = snapDoc.updatedAt ? new Date(snapDoc.updatedAt).getTime() : 0

          if (snapUpdated > liveUpdated) {
            return snapDoc
          }

          mergePageSnapData(liveDoc, snapDoc)
          return liveDoc
        })

        return {
          ...result,
          docs: [...mergedDocs, ...missingDocs] as T[],
          totalDocs: (result.totalDocs || 0) + missingDocs.length,
        }
      } catch {
        // Fallback merge is best effort
      }
    }

    return result
  } catch (error) {
    // Drafts are only ever readable from the CMS itself, so preview fails loudly.
    if (args.draft || !unreachable(error)) throw error
    return fallback(collection, error, () => findInSnapshot<T>(collection, args))
  }
}

/** Fetch a single document by slug, or null when it does not exist. */
export const findBySlug = async <T>(
  collection: string,
  slug: string,
  args: Omit<FindArgs, 'where' | 'limit'> = {},
): Promise<T | null> => {
  const result = await find<T>(collection, {
    ...args,
    limit: 1,
    where: { slug: { equals: slug } },
  })

  let doc: T | null = result.docs[0] ?? null

  // If the live CMS does not have the page yet, fall back to the committed snapshot.
  if (!doc && !args.draft && hasCollection(collection)) {
    try {
      const snapResult = findInSnapshot<T>(collection, { where: { slug: { equals: slug } }, limit: 1 })
      if (snapResult.docs[0]) {
        doc = snapResult.docs[0]
      }
    } catch {
      // Snapshot fallback is best-effort
    }
  }

  // When fetching a page from a live CMS whose database has older records or
  // missing blocks/fields (e.g. partner logos, sector links), ensure the committed
  // snapshot's updates take precedence.
  if (collection === 'pages' && doc && !args.draft && hasCollection(collection)) {
    try {
      const snapResult = findInSnapshot<T>(collection, { where: { slug: { equals: slug } }, limit: 1 })
      const snapDoc = snapResult.docs[0] as Page | undefined
      if (snapDoc) {
        const liveDoc = doc as unknown as Page
        const liveUpdated = liveDoc.updatedAt ? new Date(liveDoc.updatedAt).getTime() : 0
        const snapUpdated = snapDoc.updatedAt ? new Date(snapDoc.updatedAt).getTime() : 0

        if (snapUpdated > liveUpdated && snapResult.docs[0]) {
          doc = snapResult.docs[0]
        } else {
          mergePageSnapData(liveDoc, snapDoc)
        }
      }
    } catch {
      // Snapshot merge is best-effort
    }
  }

  return doc
}

/** Fetch a global (header, footer, site settings). */
export const findGlobal = async <T extends Global>(
  slug: string,
  args: Pick<FindArgs, 'depth' | 'draft'> = {},
): Promise<T> => {
  try {
    const doc = await request<T>(`/globals/${slug}${buildQuery(args)}`, args.draft)

    // Ensure the committed snapshot logo and global updates take precedence
    // when the live database has not yet been seeded with newer assets.
    if (!args.draft) {
      try {
        const snap = globalFromSnapshot<any>(slug)
        if (snap) {
          const liveUpdated = (doc as any)?.updatedAt ? new Date((doc as any).updatedAt).getTime() : 0
          const snapUpdated = snap.updatedAt ? new Date(snap.updatedAt).getTime() : 0

          if (slug === 'site-settings') {
            if (snap.logo) {
              ;(doc as any).logo = snap.logo
            }
            if (snap.logoInverse) {
              ;(doc as any).logoInverse = snap.logoInverse
            }
          }

          if (snapUpdated > liveUpdated) {
            return snap
          }
        }
      } catch {
        // Snapshot fallback is best-effort
      }
    }

    return doc
  } catch (error) {
    if (args.draft || !unreachable(error)) throw error
    return fallback('', error, () => globalFromSnapshot<T>(slug))
  }
}

// -- Convenience wrappers used across routes ------------------------------

export const getPage = (slug: string, args?: Omit<FindArgs, 'where' | 'limit'>) =>
  findBySlug<Page>('pages', slug, { depth: 2, ...args })

export const getPost = (slug: string, args?: Omit<FindArgs, 'where' | 'limit'>) =>
  findBySlug<Post>('posts', slug, { depth: 2, ...args })

export const getDoc = (slug: string, args?: Omit<FindArgs, 'where' | 'limit'>) =>
  findBySlug<Doc>('docs', slug, { depth: 1, ...args })

export const listPosts = (args: FindArgs = {}) =>
  find<Post>('posts', { sort: '-publishedAt', depth: 1, limit: 12, ...args })

export const listCategories = (args: FindArgs = {}) =>
  find<Category>('categories', { sort: 'title', limit: 100, ...args })

/** Docs are fetched flat and nested client-side; see `lib/docsTree.ts`. */
export const listDocs = (args: FindArgs = {}) =>
  find<Doc>('docs', { sort: 'order', depth: 0, limit: 500, ...args })

export { PayloadError }
