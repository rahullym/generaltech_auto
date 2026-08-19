import { PAYLOAD_API_KEY, PAYLOAD_URL } from 'astro:env/server'

import type { Doc, Global, Page, PaginatedDocs, Post, Category } from './types'

export type FindArgs = {
  /** Payload `where` query, serialised into the querystring. */
  where?: Record<string, unknown>
  sort?: string
  limit?: number
  page?: number
  depth?: number
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

const buildQuery = ({ where, sort, limit, page, depth, draft }: FindArgs): string => {
  const params = new URLSearchParams()

  if (where) serialiseWhere(where, params)
  if (sort) params.set('sort', sort)
  if (limit !== undefined) params.set('limit', String(limit))
  if (page !== undefined) params.set('page', String(page))
  if (depth !== undefined) params.set('depth', String(depth))
  if (draft) params.set('draft', 'true')

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

const request = async <T>(path: string, draft = false): Promise<T> => {
  const url = `${PAYLOAD_URL}/api${path}`

  if (draft && !PAYLOAD_API_KEY) {
    throw new Error('PAYLOAD_API_KEY must be set to read draft content.')
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(draft ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` } : {}),
    },
    // Drafts change constantly and must never be shared between viewers.
    cache: draft ? 'no-store' : 'default',
  })

  if (!res.ok) {
    throw new PayloadError(`Payload responded ${res.status} for ${path}`, res.status, url)
  }

  return (await res.json()) as T
}

/** Fetch a page of documents from a collection. */
export const find = async <T>(collection: string, args: FindArgs = {}): Promise<PaginatedDocs<T>> =>
  request<PaginatedDocs<T>>(`/${collection}${buildQuery(args)}`, args.draft)

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

  return result.docs[0] ?? null
}

/** Fetch a global (header, footer, site settings). */
export const findGlobal = async <T extends Global>(
  slug: string,
  args: Pick<FindArgs, 'depth' | 'draft'> = {},
): Promise<T> => request<T>(`/globals/${slug}${buildQuery(args)}`, args.draft)

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
