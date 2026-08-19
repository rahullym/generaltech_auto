import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'

import { lexicalToText } from '@/lib/lexical'
import { findGlobal, listPosts } from '@/lib/payload'
import type { SiteSettings } from '@/lib/types'

export const prerender = false

export const GET: APIRoute = async (context) => {
  const [posts, settings] = await Promise.all([
    listPosts({ limit: 50, depth: 0 }),
    findGlobal<SiteSettings>('site-settings', { depth: 0 }),
  ])

  return rss({
    title: settings.siteName,
    description: settings.tagline ?? 'Latest posts',
    site: context.site ?? new URL(context.url.origin),
    items: posts.docs.map((post) => ({
      title: post.title,
      link: `/blog/${post.slug}`,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt ?? lexicalToText(post.content).slice(0, 300),
    })),
    customData: '<language>en-us</language>',
  })
}
