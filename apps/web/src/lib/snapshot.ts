/**
 * Reads content out of the committed CMS snapshot.
 *
 * `lib/payload.ts` uses this whenever the CMS cannot be reached — which is the
 * normal state of a deployed site until the CMS and its database are hosted.
 * The snapshot is written by `scripts/snapshot.mjs`; see the note there.
 *
 * Only the query surface the site actually uses is implemented: field equality
 * (including through arrays and relationships), sorting on one field, and
 * pagination. Anything else is a snapshot bug rather than a silent wrong answer.
 */
import data from '../data/snapshot.json'

import type { Global, PaginatedDocs } from './types'

type Doc = Record<string, unknown>

const snapshot = data as unknown as {
  generatedAt: string
  collections: Record<string, Doc[]>
  globals: Record<string, unknown>
}

export const generatedAt = snapshot.generatedAt

/**
 * Every value a dotted path can reach, following arrays and populated
 * relationships — `categories.slug` on a post with three categories is three
 * candidate values, and matching any one of them counts as a match.
 */
const valuesAt = (node: unknown, path: string[]): unknown[] => {
  if (node === null || node === undefined) return []
  if (!path.length) return [node]
  if (Array.isArray(node)) return node.flatMap((entry) => valuesAt(entry, path))

  const [head, ...rest] = path
  if (typeof node !== 'object') return []
  return valuesAt((node as Doc)[head], rest)
}

const compare = (candidates: unknown[], operator: string, operand: unknown): boolean => {
  const equal = (value: unknown) => String(value) === String(operand)

  switch (operator) {
    case 'equals':
      return candidates.some(equal)
    case 'not_equals':
      return !candidates.some(equal)
    case 'in':
      return candidates.some((value) =>
        String(operand)
          .split(',')
          .some((entry) => entry.trim() === String(value)),
      )
    case 'exists':
      return candidates.length > 0 === (operand === true || operand === 'true')
    default:
      throw new Error(`snapshot: unsupported query operator "${operator}"`)
  }
}

const matches = (doc: Doc, where: Record<string, unknown>): boolean =>
  Object.entries(where).every(([field, condition]) => {
    if (field === 'and') return (condition as Record<string, unknown>[]).every((c) => matches(doc, c))
    if (field === 'or') return (condition as Record<string, unknown>[]).some((c) => matches(doc, c))

    const candidates = valuesAt(doc, field.split('.'))
    return Object.entries(condition as Record<string, unknown>).every(([operator, operand]) =>
      compare(candidates, operator, operand),
    )
  })

const sorted = (docs: Doc[], sort?: string): Doc[] => {
  if (!sort) return docs
  const descending = sort.startsWith('-')
  const field = descending ? sort.slice(1) : sort

  return [...docs].sort((a, b) => {
    const left = valuesAt(a, field.split('.'))[0]
    const right = valuesAt(b, field.split('.'))[0]
    if (left === right) return 0
    if (left === undefined || left === null) return 1
    if (right === undefined || right === null) return -1
    const order = left < right ? -1 : 1
    return descending ? -order : order
  })
}

/** Answers `find()` from the snapshot, in Payload's paginated shape. */
export const findInSnapshot = <T>(
  collection: string,
  {
    where,
    sort,
    limit = 10,
    page = 1,
  }: { where?: Record<string, unknown>; sort?: string; limit?: number; page?: number } = {},
): PaginatedDocs<T> => {
  const all = snapshot.collections[collection] ?? []
  const filtered = sorted(where ? all.filter((doc) => matches(doc, where)) : all, sort)

  const totalDocs = filtered.length
  const perPage = limit > 0 ? limit : totalDocs || 1
  const totalPages = Math.max(Math.ceil(totalDocs / perPage), 1)
  const current = Math.min(Math.max(page, 1), totalPages)
  const docs = filtered.slice((current - 1) * perPage, current * perPage) as T[]

  return {
    docs,
    totalDocs,
    totalPages,
    page: current,
    limit: perPage,
    hasNextPage: current < totalPages,
    hasPrevPage: current > 1,
    nextPage: current < totalPages ? current + 1 : null,
    prevPage: current > 1 ? current - 1 : null,
  }
}

/** Answers `findGlobal()` from the snapshot. */
export const globalFromSnapshot = <T extends Global>(slug: string): T => {
  const global = snapshot.globals[slug]
  if (!global) throw new Error(`snapshot: no global "${slug}" — re-run pnpm --filter web snapshot`)
  return global as T
}

/** True when the collection is in the snapshot at all. */
export const hasCollection = (collection: string): boolean => collection in snapshot.collections
