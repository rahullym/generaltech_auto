/**
 * Loads the approved About Us, Products, Brands, Services, Applications and
 * Contact Us copy into the six pages the navigation already points at.
 *
 * Run with:  pnpm --filter cms seed:pages
 * Safe to re-run: each page is matched by slug and replaced. The home page is
 * never touched.
 *
 * The copy itself lives in `src/content/pages/*` — one module per page, so a
 * proofreader can read a module against the source document without reading
 * past any of the plumbing here.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { aboutPage } from '../content/pages/about'
import { applicationsPage } from '../content/pages/applications'
import { brandsPage } from '../content/pages/brands'
import { contactPage } from '../content/pages/contact'
import { productsPage } from '../content/pages/products'
import { servicesPage } from '../content/pages/services'
import type { SeededPage } from '../content/shared'
import type { Page } from '../payload-types'

const run = async () => {
  const payload = await getPayload({ config })

  // --- Media --------------------------------------------------------------
  // Pages name their photography by filename; Payload stores it by id.
  const uploads = await payload.find({ collection: 'media', limit: 500, depth: 0 })
  const byFilename = new Map<string, number>()

  for (const upload of uploads.docs) {
    if (upload.filename) byFilename.set(upload.filename, upload.id as number)
  }

  const missing = new Set<string>()

  const media = (filename: string): number | undefined => {
    const id = byFilename.get(filename)
    if (!id) missing.add(filename)
    return id
  }

  // --- The brand roster ----------------------------------------------------
  // The Brands page shows the marks the home page already carries, in the same
  // order, rather than a second roster that could drift out of step with it.
  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
    draft: true,
  })

  const wall = (home.docs[0]?.layout ?? []).find(
    (block): block is Extract<Page['layout'][number], { blockType: 'logoWall' }> =>
      block.blockType === 'logoWall',
  )

  const logos = (wall?.logos ?? []).map((logo) => ({
    image: typeof logo.image === 'object' ? (logo.image as { id: number }).id : (logo.image as number),
    name: logo.name,
  }))

  if (!logos.length) {
    payload.logger.warn(
      'No logo wall found on the home page — the Brands page will publish without the roster.',
    )
  }

  // --- The pages -----------------------------------------------------------
  const pages: SeededPage[] = [
    aboutPage(media),
    productsPage(media),
    brandsPage(media, logos as { image: number }[]),
    servicesPage(media),
    applicationsPage(media),
    contactPage(media),
  ]

  for (const page of pages) {
    const data = {
      title: page.title,
      slug: page.slug,
      _status: 'published' as const,
      // The blocks are authored by hand; Payload's generated union expects
      // every optional field on every member, so assert rather than restate.
      layout: page.layout as unknown as Page['layout'],
      meta: page.meta,
    }

    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      draft: true,
    })

    if (found.docs.length > 0) {
      await payload.update({ collection: 'pages', id: found.docs[0]!.id, data })
      payload.logger.info(`Updated /${page.slug} — ${page.title}`)
    } else {
      await payload.create({ collection: 'pages', data })
      payload.logger.info(`Created /${page.slug} — ${page.title}`)
    }
  }

  if (missing.size) {
    payload.logger.warn(
      `These images are referenced by the copy but are not in the media library, so those blocks published without them:\n  ${[...missing].join('\n  ')}`,
    )
  }

  payload.logger.info('Done')
}

await run()
process.exit(0)
