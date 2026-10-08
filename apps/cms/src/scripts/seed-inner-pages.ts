/**
 * Loads the service inner pages and the application examples into Payload.
 *
 * Run with:  pnpm --filter cms seed:inner
 * Safe to re-run: each page is matched by slug and replaced, so edits made in
 * the admin panel are overwritten — once the pages are being maintained there,
 * stop running this.
 *
 * The copy lives in `src/content/services/*.json` and
 * `src/content/applications/*.json`, in a compact authoring shape: paragraphs
 * as plain strings, images by filename. This expands each file into the blocks
 * the Pages collection stores, and writes each service's short menu label,
 * blurb, icon and column onto the header's Services dropdown.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { doc, paragraph, type TextRun } from '../content/lexical'
import type { Page } from '../payload-types'

const here = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.resolve(here, '../content')
/** Images a page names that were never uploaded are committed with the site. */
const publicMedia = path.resolve(here, '../../../web/public/cms')

type Action = { label: string; url: string; appearance?: string }
type Authored = Record<string, any>

/** The icons the feature grid draws; a card naming any other shows its number. */
const FEATURE_ICONS = new Set([
  'cpu',
  'dashboard',
  'screen',
  'network',
  'signal',
  'cabinet',
  'cog',
  'refresh',
  'shield',
  'gauge',
])

/** `**bold**` marks a run as strong; nothing else is interpreted. */
const runs = (value: string): (string | TextRun)[] =>
  value
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? { text: part.slice(2, -2), bold: true }
        : part,
    )

const richText = (paragraphs: string[]) => doc(...paragraphs.map((text) => paragraph(...runs(text))))

const action = ({ label, url, appearance = 'primary' }: Action) => ({
  link: { type: 'custom', label, url, appearance },
})

const readAll = async (folder: string): Promise<Authored[]> => {
  const dir = path.join(contentDir, folder)
  const files = (await readdir(dir)).filter((file) => file.endsWith('.json')).sort()

  return Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(dir, file), 'utf8'))))
}

const run = async () => {
  const payload = await getPayload({ config })

  // --- Media --------------------------------------------------------------
  // Pages name their photography by filename; Payload stores it by id.
  const uploads = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
  const byFilename = new Map<string, number>()

  for (const upload of uploads.docs) {
    if (upload.filename) byFilename.set(upload.filename, upload.id as number)
  }

  const missing = new Set<string>()

  const media = async (filename?: string, alt?: string): Promise<number | undefined> => {
    if (!filename) return undefined

    const known = byFilename.get(filename)
    if (known) return known

    try {
      const created = await payload.create({
        collection: 'media',
        data: { alt: alt ?? filename.replace(/\.[^.]+$/, '') },
        filePath: path.join(publicMedia, filename),
      })
      byFilename.set(filename, created.id as number)
      payload.logger.info(`Uploaded ${filename}`)
      return created.id as number
    } catch {
      missing.add(filename)
      return undefined
    }
  }

  // --- Blocks -------------------------------------------------------------
  const expand = async (block: Authored): Promise<Record<string, unknown>> => {
    switch (block.type) {
      case 'hero':
        return {
          blockType: 'hero',
          variant: block.variant ?? 'centered',
          eyebrow: block.eyebrow,
          heading: block.heading,
          subheading: block.subheading,
          image: await media(block.image),
          actions: (block.actions ?? []).map(action),
        }

      case 'prose': {
        const images: string[] = block.images ?? (block.image ? [block.image] : [])
        const ids = await Promise.all(images.map((name) => media(name)))

        return {
          blockType: 'richText',
          layout: block.layout ?? 'editorial',
          width: block.width ?? 'prose',
          eyebrow: block.eyebrow,
          heading: block.heading,
          numbered: block.numbered ?? false,
          lede: block.lede ?? false,
          collapsible: block.collapsible ?? false,
          mediaPosition: block.mediaPosition ?? 'left',
          media: ids.filter(Boolean).map((image) => ({ image })),
          footprint: block.footprint,
          content: richText(block.body),
        }
      }

      case 'features':
        return {
          blockType: 'featureGrid',
          heading: block.heading,
          intro: block.intro,
          display: block.display ?? 'grid',
          columns: block.columns ?? '3',
          features: block.items.map((item: Authored) => ({
            iconName: FEATURE_ICONS.has(item.icon) ? item.icon : undefined,
            title: item.title,
            description: item.description,
            link: { type: 'custom' },
          })),
        }

      case 'process':
        return {
          blockType: 'processSteps',
          eyebrow: block.eyebrow,
          heading: block.heading,
          intro: block.intro,
          footnote: block.footnote,
          steps: block.steps,
        }

      case 'diagram':
        return {
          blockType: 'diagram',
          variant: block.variant ?? 'chain',
          eyebrow: block.eyebrow,
          heading: block.heading,
          intro: block.intro,
          footnote: block.footnote,
          nodes: block.nodes ?? [],
          groups: block.groups ?? [],
        }

      case 'schematic': {
        const { type: _type, eyebrow, heading, intro, title, key, footnote, ...drawing } = block
        return { blockType: 'schematic', eyebrow, heading, intro, title, key, footnote, drawing }
      }

      case 'why':
        return {
          blockType: 'whyUs',
          eyebrow: block.eyebrow,
          heading: block.heading,
          intro: block.intro,
          footnote: block.footnote,
          proofs: block.proofs ?? [],
          pillars: block.pillars,
        }

      case 'industries':
        return {
          blockType: 'industries',
          eyebrow: block.eyebrow,
          heading: block.heading,
          intro: block.intro,
          footnote: block.footnote,
          sectors: block.sectors.map((sector: Authored) => ({
            name: sector.name,
            iconName: sector.icon ?? 'factory',
            description: sector.description,
          })),
        }

      case 'coverage':
        return {
          blockType: 'coverage',
          eyebrow: block.eyebrow,
          heading: block.heading,
          tone: block.tone ?? 'dark',
          note: block.note,
          areas: block.areas,
          content: block.body ? richText(block.body) : undefined,
        }

      case 'logos':
        return {
          blockType: 'logoWall',
          eyebrow: block.eyebrow,
          heading: block.heading,
          intro: block.intro,
          layout: block.layout ?? 'grid',
          logos: (
            await Promise.all(
              block.logos.map(async (logo: Authored) => ({
                image: await media(logo.image, `${logo.name} logo`),
                name: logo.name,
                url: logo.url,
              })),
            )
          ).filter((logo) => logo.image),
        }

      case 'faq':
        return {
          blockType: 'faq',
          eyebrow: block.eyebrow,
          heading: block.heading,
          intro: block.intro,
          items: block.items.map((item: Authored) => ({ question: item.q, answer: richText(item.a) })),
        }

      case 'cta':
        return {
          blockType: 'cta',
          variant: block.variant ?? 'dark',
          eyebrow: block.eyebrow,
          heading: block.heading,
          body: block.body,
          actions: (block.actions ?? []).map(action),
        }

      default:
        throw new Error(`Unknown authored block type "${block.type}"`)
    }
  }

  const upsert = async (page: Authored, extra: Record<string, unknown>) => {
    const layout = []
    for (const block of page.layout) layout.push(await expand(block))

    const data = {
      title: page.title,
      slug: page.slug,
      _status: 'published' as const,
      // The blocks are authored by hand; Payload's generated union expects
      // every optional field on every member, so assert rather than restate.
      layout: layout as unknown as Page['layout'],
      meta: page.meta,
      ...extra,
    }

    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
      draft: true,
    })

    if (found.docs.length > 0) {
      await payload.update({ collection: 'pages', id: found.docs[0]!.id, data })
      payload.logger.info(`Updated /${page.slug}`)
    } else {
      await payload.create({ collection: 'pages', data })
      payload.logger.info(`Created /${page.slug}`)
    }
  }

  // --- The pages -----------------------------------------------------------
  const services = await readAll('services')
  const applications = await readAll('applications')

  for (const service of services) {
    await upsert(service, {
      kind: 'service',
      service: {
        order: service.order,
        serviceType: service.serviceType,
        aliases: (service.aliases ?? []).map((alias: string) => ({ path: alias })),
      },
    })
  }

  for (const application of applications) {
    await upsert(application, {
      kind: 'application',
      application: {
        order: application.order,
        cardTitle: application.cardTitle,
        cardBlurb: application.cardBlurb,
        cardImage: await media(application.cardImage),
        sectors: (application.sectors ?? []).map((name: string) => ({ name })),
      },
    })
  }

  // --- The Services menu ----------------------------------------------------
  // A service's page title is a paragraph in a menu tile, so the dropdown row
  // that points at it takes the short label, and the blurb, icon and column
  // wherever an editor has not already written one.
  const menus = new Map<string, Authored>(
    services.filter((service) => service.menu).map((service) => [`/${service.slug}`, service.menu]),
  )

  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  let touched = 0

  const navItems = (header.navItems ?? []).map((item) => ({
    ...item,
    children: (item.children ?? []).map((child) => {
      const menu = child.link?.type === 'custom' ? menus.get(child.link.url ?? '') : undefined
      if (!menu) return child

      touched += 1
      return {
        ...child,
        link: { ...child.link, label: menu.label },
        description: child.description || menu.blurb,
        iconName: child.iconName || menu.icon,
        groupName: child.groupName || menu.group,
      }
    }),
  }))

  await payload.updateGlobal({ slug: 'header', data: { navItems } })
  payload.logger.info(`Services menu: ${touched} of ${menus.size} rows labelled`)

  if (missing.size) {
    payload.logger.warn(
      `These images are named by the copy but are in neither the media library nor apps/web/public/cms, so those blocks published without them:\n  ${[...missing].join('\n  ')}`,
    )
  }

  payload.logger.info('Done')
}

await run()
process.exit(0)
