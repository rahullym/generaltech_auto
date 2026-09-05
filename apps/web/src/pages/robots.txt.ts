import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = ({ site, url }) => {
  const origin = (site ?? new URL(url.origin)).origin

  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
