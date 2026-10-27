import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const SNAPSHOT = path.resolve(here, '../src/data/snapshot.json')
const SERVICES_DIR = path.resolve(here, '../../cms/src/content/services')

const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8'))

// Collect media uploads
const uploads = new Map()
const collect = (node) => {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) return node.forEach(collect)
  if (typeof node.filename === 'string' && typeof node.url === 'string') {
    if (!uploads.has(node.filename)) uploads.set(node.filename, node)
  }
  Object.values(node).forEach(collect)
}
collect(snapshot)

// Lexical helpers
const runs = (value) =>
  value
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? { text: part.slice(2, -2), bold: true }
        : part,
    )

const textNode = (run) => {
  const value = typeof run === 'string' ? { text: run } : run
  return {
    type: 'text',
    text: value.text,
    format: value.bold ? 1 : 0,
    style: '',
    detail: 0,
    mode: 'normal',
    version: 1,
  }
}

const paragraph = (...children) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: children.map((c) => (typeof c === 'string' || !c.type ? textNode(c) : c)),
})

const richText = (paragraphs) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).map((p) =>
      paragraph(...runs(p)),
    ),
  },
})

const expand = (block) => {
  switch (block.type) {
    case 'hero':
      return {
        blockType: 'hero',
        variant: block.variant ?? 'centered',
        eyebrow: block.eyebrow,
        heading: block.heading,
        subheading: block.subheading,
        image: uploads.get(block.image) || null,
        actions: (block.actions ?? []).map((action) => ({
          link: {
            type: 'custom',
            label: action.label,
            url: action.url,
            appearance: action.appearance ?? 'primary',
          },
        })),
      }

    case 'prose': {
      const images = block.images ?? (block.image ? [block.image] : [])
      const mediaList = images
        .map((img) => uploads.get(img))
        .filter(Boolean)
        .map((image) => ({ image }))

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
        media: mediaList,
        footprint: block.footprint,
        content: richText(block.body),
      }
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

    case 'features':
      return {
        blockType: 'featureGrid',
        heading: block.heading,
        intro: block.intro,
        display: block.display ?? 'grid',
        columns: block.columns ?? '3',
        features: block.items.map((item) => ({
          iconName: item.icon,
          title: item.title,
          description: item.description,
          link: { type: 'custom' },
        })),
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
        sectors: block.sectors.map((sector) => ({
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

    case 'faq':
      return {
        blockType: 'faq',
        eyebrow: block.eyebrow,
        heading: block.heading,
        intro: block.intro,
        items: block.items.map((item) => ({
          question: item.q,
          answer: richText(item.a),
        })),
      }

    case 'cta':
      return {
        blockType: 'cta',
        variant: block.variant ?? 'dark',
        eyebrow: block.eyebrow,
        heading: block.heading,
        body: block.body,
        actions: (block.actions ?? []).map((action) => ({
          link: {
            type: 'custom',
            label: action.label,
            url: action.url,
            appearance: action.appearance ?? 'primary',
          },
        })),
      }

    default:
      throw new Error(`Unknown block type "${block.type}"`)
  }
}

// Read all service JSON files
const files = (await readdir(SERVICES_DIR)).filter((f) => f.endsWith('.json')).sort()
const pages = snapshot.collections.pages ?? []

let maxId = Math.max(...pages.map((p) => (typeof p.id === 'number' ? p.id : 0)))
const now = new Date().toISOString()

for (const file of files) {
  const service = JSON.parse(await readFile(path.join(SERVICES_DIR, file), 'utf8'))
  const layout = service.layout.map(expand)

  // Check if page exists by slug or by alias or old slug
  let pageIndex = pages.findIndex((p) => p.slug === service.slug)
  if (pageIndex === -1 && service.aliases?.length) {
    pageIndex = pages.findIndex((p) => service.aliases.includes(p.slug))
  }

  const aliases = (service.aliases ?? []).map((p, idx) => ({
    id: `alias-${service.slug}-${idx}`,
    path: p,
  }))

  const pageDoc = {
    id: pageIndex !== -1 ? pages[pageIndex].id : ++maxId,
    title: service.title,
    slug: service.slug,
    kind: 'service',
    layout,
    service: {
      order: service.order,
      serviceType: service.serviceType,
      aliases,
    },
    application: null,
    meta: service.meta,
    updatedAt: now,
    createdAt: pageIndex !== -1 ? pages[pageIndex].createdAt ?? now : now,
    _status: 'published',
  }

  if (pageIndex !== -1) {
    pages[pageIndex] = pageDoc
    console.log(`Updated page /${service.slug} (id ${pageDoc.id})`)
  } else {
    pages.push(pageDoc)
    console.log(`Created page /${service.slug} (id ${pageDoc.id})`)
  }
}

await writeFile(SNAPSHOT, JSON.stringify(snapshot, null, 2) + '\n')
console.log(`\nSuccessfully updated ${SNAPSHOT}`);
