import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const SNAPSHOT = path.resolve(here, '../src/data/snapshot.json')
const INDUSTRIES_DIR = path.resolve(here, '../../cms/src/content/industries')

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

const heading = (text, tag = 'h3') => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: [textNode(text)],
})

const table = (headers, rows) => ({
  type: 'table',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: [
    {
      type: 'tablerow',
      children: headers.map((h) => ({
        type: 'tablecell',
        headerState: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ type: 'text', text: h, format: 1, style: '', detail: 0, mode: 'normal', version: 1 }],
          },
        ],
      })),
    },
    ...rows.map((row) => ({
      type: 'tablerow',
      children: row.map((cell) => ({
        type: 'tablecell',
        headerState: 0,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: runs(cell).map(textNode),
          },
        ],
      })),
    })),
  ],
})

const buildProseChildren = (block) => {
  const children = []

  if (block.intro) {
    children.push(paragraph(...runs(block.intro)))
  }

  if (block.table) {
    children.push(table(block.table.headers, block.table.rows))
  }

  for (const item of block.body ?? []) {
    if (typeof item === 'string') {
      if (item.startsWith('### ')) {
        children.push(heading(item.slice(4).trim(), 'h3'))
      } else if (item.startsWith('## ')) {
        children.push(heading(item.slice(3).trim(), 'h2'))
      } else if (item.startsWith('- ')) {
        const bullets = item.split('\n').filter((l) => l.trim().startsWith('- '))
        children.push({
          type: 'list',
          listType: 'bullet',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: bullets.map((b) => ({
            type: 'listitem',
            version: 1,
            direction: 'ltr',
            children: runs(b.replace(/^-\s*/, '').trim()).map(textNode),
          })),
        })
      } else {
        children.push(paragraph(...runs(item)))
      }
    }
  }

  return children
}

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
        collapsible: false, // keep copy fully readable
        mediaPosition: block.mediaPosition ?? 'left',
        media: mediaList,
        footprint: block.footprint,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: buildProseChildren(block),
          },
        },
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
        display: block.display ?? 'grid',
        footnote: block.footnote,
        sectors: block.sectors.map((sector) => ({
          name: sector.name,
          iconName: sector.iconName ?? sector.icon ?? 'factory',
          description: sector.description,
          href: sector.href,
          linkLabel: sector.linkLabel,
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
        content: block.body
          ? {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: (Array.isArray(block.body) ? block.body : [block.body]).map((p) =>
                  paragraph(...runs(p)),
                ),
              },
            }
          : undefined,
      }

    case 'faq':
      return {
        blockType: 'faq',
        eyebrow: block.eyebrow,
        heading: block.heading,
        intro: block.intro,
        items: block.items.map((item) => ({
          question: item.q,
          answer: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: (Array.isArray(item.a) ? item.a : [item.a]).map((p) =>
                paragraph(...runs(p)),
              ),
            },
          },
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

// 1. Read all industry JSON files and sync them to snapshot
const files = (await readdir(INDUSTRIES_DIR)).filter((f) => f.endsWith('.json')).sort()
const pages = snapshot.collections.pages ?? []

let maxId = Math.max(...pages.map((p) => (typeof p.id === 'number' ? p.id : 0)))
const now = new Date().toISOString()

const ogFallback = uploads.get('og-image.png') || {
  id: 'og-image-default',
  url: '/cms/og-image.png',
  alt: 'General Tech Automation UAE',
  width: 1200,
  height: 1200,
  mimeType: 'image/png',
  filename: 'og-image.png',
}

for (const file of files) {
  const industry = JSON.parse(await readFile(path.join(INDUSTRIES_DIR, file), 'utf8'))
  const layout = industry.layout.map(expand)

  let pageIndex = pages.findIndex((p) => p.slug === industry.slug)

  const pageDoc = {
    id: pageIndex !== -1 ? pages[pageIndex].id : ++maxId,
    title: industry.title,
    slug: industry.slug,
    kind: 'page',
    layout,
    service: null,
    application: null,
    meta: {
      ...industry.meta,
      image: industry.meta?.image ?? ogFallback,
    },
    updatedAt: now,
    createdAt: pageIndex !== -1 ? pages[pageIndex].createdAt ?? now : now,
    _status: 'published',
  }

  if (pageIndex !== -1) {
    pages[pageIndex] = pageDoc
    console.log(`Updated page /${industry.slug} (id ${pageDoc.id})`)
  } else {
    pages.push(pageDoc)
    console.log(`Created page /${industry.slug} (id ${pageDoc.id})`)
  }
}

// 2. Update the /applications hub page in snapshot so cards link to their inner pages
const appPageIndex = pages.findIndex((p) => p.slug === 'applications')
if (appPageIndex !== -1) {
  const appPage = pages[appPageIndex]
  const indBlock = appPage.layout?.find((b) => b.blockType === 'industries')
  if (indBlock && indBlock.sectors) {
    const slugMap = {
      'Oil and Gas': '/applications/oil-and-gas-automation-uae',
      'Automotive': '/applications/automotive-manufacturing-automation-uae',
      'Pharmaceutical': '/applications/pharmaceutical-automation-uae',
      'Food and Beverage': '/applications/food-and-beverage-automation-uae',
      'Water Treatment': '/applications/water-treatment-automation-uae',
      'Power Generation': '/applications/power-generation-automation-uae',
      'Logistics': '/applications/logistics-and-warehouse-automation-uae',
      'Construction': '/applications/construction-industry-automation-uae',
      'Petrochemical': '/applications/petrochemical-automation-uae',
      'Manufacturing Plant': '/applications/manufacturing-plant-automation-uae',
    }

    indBlock.sectors.forEach((sector) => {
      for (const [key, slugUrl] of Object.entries(slugMap)) {
        if (sector.name.includes(key)) {
          sector.href = slugUrl
          sector.linkLabel = `Explore ${key.toLowerCase()} automation`
          break
        }
      }
    })
    console.log(`Updated /applications hub industries block with links to all 10 inner pages`)
  }
}

await writeFile(SNAPSHOT, JSON.stringify(snapshot, null, 2) + '\n')
console.log(`\nSuccessfully updated ${SNAPSHOT}`)
