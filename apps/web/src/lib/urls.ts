import type { Doc, LinkValue } from './types'

/** Route prefix each collection is served under by Astro. */
const PREFIX: Record<string, string> = {
  pages: '',
  posts: '/blog',
  docs: '/docs',
}

/** Builds the frontend path for a collection document. */
export const pathFor = (collection: string, slug: string): string => {
  if (collection === 'pages') return slug === 'home' ? '/' : `/${slug}`
  return `${PREFIX[collection] ?? ''}/${slug}`
}

/**
 * Resolves a Payload link field to an href, whether it points at an internal
 * document (possibly returned as a bare id when depth is 0) or an external URL.
 */
export const resolveHref = (link?: LinkValue | null): string => {
  if (!link) return '#'

  if (link.type === 'custom' || (!link.reference && link.url)) {
    return link.url || '#'
  }

  const ref = link.reference
  if (!ref) return '#'

  const value = ref.value
  if (typeof value === 'string') {
    // depth=0 leaves the relationship unpopulated; nothing to link to.
    return '#'
  }

  return value?.slug ? pathFor(ref.relationTo, value.slug) : '#'
}

/** Whether a nav link should be highlighted for the current pathname. */
export const isActive = (href: string, pathname: string): boolean => {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')

export const formatDate = (value: string, locale = 'en-US'): string =>
  new Date(value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

/** Reading time in minutes, from a plain-text body. */
export const readingTime = (text: string): number =>
  Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 225))

export type DocNode = Doc & { children: DocNode[] }

/**
 * Turns the flat docs list into a tree. Payload returns `parent` as an id at
 * depth 0, which is exactly what we need to build nesting in one pass.
 */
export const buildDocsTree = (docs: Doc[]): DocNode[] => {
  const byId = new Map<string, DocNode>()
  const roots: DocNode[] = []

  for (const doc of docs) {
    byId.set(String(doc.id), { ...doc, children: [] })
  }

  for (const doc of docs) {
    const node = byId.get(String(doc.id))
    if (!node) continue

    const parentId =
      typeof doc.parent === 'string'
        ? doc.parent
        : doc.parent && typeof doc.parent === 'object'
          ? String(doc.parent.id)
          : null

    const parent = parentId ? byId.get(parentId) : undefined

    if (parent) parent.children.push(node)
    else roots.push(node)
  }

  const sortTree = (nodes: DocNode[]): DocNode[] => {
    nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    nodes.forEach((n) => sortTree(n.children))
    return nodes
  }

  return sortTree(roots)
}

/** Flattens the tree back into reading order, for prev/next links. */
export const flattenDocsTree = (nodes: DocNode[]): DocNode[] =>
  nodes.flatMap((node) => [node, ...flattenDocsTree(node.children)])
