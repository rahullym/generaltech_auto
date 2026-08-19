const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4331'
const PREVIEW_SECRET = process.env.PAYLOAD_PREVIEW_SECRET || ''

/** Maps a collection + slug to the route Astro serves it at. */
const pathFor = (collection: string, slug: string): string => {
  switch (collection) {
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    case 'posts':
      return `/blog/${slug}`
    case 'docs':
      return `/docs/${slug}`
    default:
      return `/${slug}`
  }
}

/**
 * Builds the Astro URL for draft preview. The secret lets the frontend
 * authorise a draft read without exposing unpublished content publicly.
 */
export const previewUrl = (collection: string, slug?: string | null): string => {
  if (!slug) return FRONTEND_URL

  const url = new URL('/api/preview', FRONTEND_URL)
  url.searchParams.set('secret', PREVIEW_SECRET)
  url.searchParams.set('collection', collection)
  url.searchParams.set('slug', slug)
  url.searchParams.set('path', pathFor(collection, slug))

  return url.toString()
}
