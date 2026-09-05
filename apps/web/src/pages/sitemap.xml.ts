/**
 * The sitemap.
 *
 * `@astrojs/sitemap` only sees routes it can enumerate at build time, which
 * under SSR is the handful of static ones — it was publishing four URLs and
 * none of the twenty-four real pages. This walks the actual content instead:
 * every published page, every service page, every post and every doc.
 *
 * Retired service paths are deliberately absent. They answer with a permanent
 * redirect, and a sitemap is a list of canonical URLs, not of everything that
 * resolves.
 */
import { publicOrigin } from '@/lib/origin'
import { find, getPage } from '@/lib/payload'
import { serviceSummaries } from '@/lib/service-pages'

import type { APIRoute } from 'astro'
import type { Doc, Page, Post } from '@/lib/types'

export const prerender = false

type Entry = { path: string; lastmod?: string; priority: string; changefreq: string }

/** Home first, then the pages a visitor is most likely to be looking for. */
const PRIORITY: Record<string, string> = {
  '': '1.0',
  services: '0.9',
  products: '0.8',
  brands: '0.8',
  applications: '0.8',
  about_us: '0.7',
  contact_us: '0.7',
}

const xmlEscape = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const GET: APIRoute = async ({ site, url }) => {
  const origin = publicOrigin(site, url)
  const entries: Entry[] = []

  // Pages held in the CMS. `home` is served at `/`, and the leftover seed stub
  // is not something a search engine should be pointed at.
  const pages = await find<Page>('pages', { limit: 200, depth: 0 })
  for (const page of pages.docs) {
    if (page._status === 'draft' || page.slug === 'about') continue
    const path = page.slug === 'home' ? '' : page.slug
    entries.push({
      path,
      lastmod: page.updatedAt,
      priority: PRIORITY[path] ?? '0.6',
      changefreq: path === '' ? 'weekly' : 'monthly',
    })
  }

  // The service pages ship with the build, so the CMS does not list them.
  for (const service of serviceSummaries) {
    if (await getPage(service.slug)) continue
    entries.push({ path: service.slug, priority: '0.9', changefreq: 'monthly' })
  }

  const posts = await find<Post>('posts', { limit: 500, depth: 0, sort: '-publishedAt' })
  for (const post of posts.docs) {
    entries.push({
      path: `blog/${post.slug}`,
      lastmod: post.updatedAt,
      priority: '0.5',
      changefreq: 'yearly',
    })
  }

  const docs = await find<Doc>('docs', { limit: 500, depth: 0 })
  for (const doc of docs.docs) {
    entries.push({
      path: `docs/${doc.slug}`,
      lastmod: doc.updatedAt,
      priority: '0.4',
      changefreq: 'yearly',
    })
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(({ path, lastmod, priority, changefreq }) =>
    [
      '  <url>',
      `    <loc>${xmlEscape(`${origin}/${path}`)}</loc>`,
      lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : '',
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n'),
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
