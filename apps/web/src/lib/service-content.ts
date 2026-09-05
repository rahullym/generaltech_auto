/**
 * The service inner pages, authored as content files and rendered through the
 * same blocks the homepage uses.
 *
 * Each page in `src/content/services/*.json` is written in a compact authoring
 * shape — paragraphs as plain strings rather than Lexical trees — and this
 * module expands it into the exact `Page` shape `BlockRenderer` already
 * consumes. Nothing new is rendered: `hero`, `richText`, `featureGrid`,
 * `processSteps`, `coverage`, `faq` and `cta` are the homepage's own blocks.
 *
 * The pages resolve from here whenever the CMS does not have them, which is
 * every deployment until the CMS is hosted. Moving one into Payload later needs
 * no code change: `getPage()` wins, and this becomes the fallback it already is.
 */
import snapshot from '../data/snapshot.json'

import type { Block, LexicalNode, Media, Page, RichTextValue } from './types'

// -- Authoring shape -------------------------------------------------------

type Action = { label: string; url: string; appearance?: 'primary' | 'secondary' | 'link' }

type AuthoredBlock =
  | {
      type: 'hero'
      variant?: 'centered' | 'minimal' | 'split' | 'banner'
      eyebrow?: string
      heading: string
      subheading?: string
      image?: string
      actions?: Action[]
    }
  | {
      type: 'prose'
      layout?: 'default' | 'editorial' | 'split'
      width?: 'prose' | 'full'
      eyebrow?: string
      heading?: string
      lede?: boolean
      numbered?: boolean
      collapsible?: boolean
      image?: string
      images?: string[]
      mediaPosition?: 'left' | 'right'
      body: string[]
    }
  | {
      type: 'features'
      heading?: string
      intro?: string
      display?: 'grid' | 'carousel'
      columns?: '2' | '3' | '4'
      items: { icon?: string; title: string; description?: string }[]
    }
  | {
      type: 'process'
      eyebrow?: string
      heading?: string
      intro?: string
      steps: { meta?: string; title: string; description?: string }[]
      footnote?: string
    }
  | {
      type: 'why'
      eyebrow?: string
      heading?: string
      intro?: string
      proofs?: { value: string; label: string }[]
      pillars: { title: string; body: string }[]
      footnote?: string
    }
  | {
      type: 'industries'
      eyebrow?: string
      heading?: string
      intro?: string
      sectors: { name: string; icon?: string; description?: string }[]
      footnote?: string
    }
  | {
      type: 'coverage'
      eyebrow?: string
      heading?: string
      tone?: 'dark' | 'light'
      note?: string
      areas: { name: string; note?: string }[]
      body?: string[]
    }
  | {
      type: 'faq'
      eyebrow?: string
      heading?: string
      intro?: string
      items: { q: string; a: string[] }[]
    }
  | {
      type: 'cta'
      variant?: 'dark' | 'light' | 'compact'
      eyebrow?: string
      heading: string
      body?: string
      actions?: Action[]
    }

export type AuthoredService = {
  /** Position in the Services menu and on the index page. */
  order: number
  title: string
  slug: string
  /**
   * Paths this page used to live at. They 301 here, so the menu, the services
   * index and any link already in the wild keep resolving after the move to
   * the permalinks the source documents specify.
   */
  aliases?: string[]
  navLabel: string
  summary: string
  meta: { title: string; description: string }
  /** Optional `serviceType` for the Service JSON-LD. Defaults to the title. */
  serviceType?: string
  layout: AuthoredBlock[]
}

// -- Media -----------------------------------------------------------------

/**
 * The photography already shipped in `public/cms`.
 *
 * Rather than restating each file's dimensions and derivative names here — which
 * drifts the moment the CMS regenerates a size — the media records are read back
 * out of the committed snapshot, which is where the real ones already live. A
 * name that is not in the snapshot resolves to nothing and the block simply
 * renders without imagery, instead of shipping a broken `srcset`.
 */
const MEDIA: Record<string, Media> = (() => {
  const index: Record<string, Media> = {}

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) return node.forEach(walk)

    const record = node as Record<string, unknown>
    if (typeof record.filename === 'string' && typeof record.url === 'string') {
      index[record.filename] ??= record as unknown as Media
    }
    Object.values(record).forEach(walk)
  }

  walk(snapshot)
  return index
})()

const media = (name?: string): Media | undefined => (name ? MEDIA[name] : undefined)

// -- Lexical ---------------------------------------------------------------

/**
 * Wraps plain paragraphs in the Lexical shape Payload stores, so authored copy
 * flows through the very same `RichText` renderer as CMS copy.
 *
 * `**bold**` marks a run as strong (format bit 1) — the emphasis the source
 * documents carry on their keyword phrases. Nothing else is interpreted, so a
 * stray asterisk stays a stray asterisk rather than silently vanishing.
 */
const STRONG = 1

const inline = (text: string): LexicalNode[] =>
  text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**') && part.length > 4
      return {
        mode: 'normal',
        text: bold ? part.slice(2, -2) : part,
        type: 'text',
        style: '',
        detail: 0,
        format: bold ? STRONG : 0,
        version: 1,
      }
    })

const paragraph = (text: string): LexicalNode => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  children: inline(text),
  direction: 'ltr',
})

export const richText = (paragraphs: string[]): RichTextValue => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map(paragraph),
  },
})

// -- Expansion -------------------------------------------------------------

/** Stable, readable ids — Astro keys nothing on them, but Payload shapes carry them. */
const key = (slug: string, index: number, suffix = '') => `${slug}-${index}${suffix}`

const link = (action: Action) => ({
  type: 'custom' as const,
  label: action.label,
  url: action.url,
  newTab: null,
  appearance: action.appearance ?? 'primary',
})

const expand = (block: AuthoredBlock, slug: string, index: number): Block => {
  const id = key(slug, index)

  switch (block.type) {
    case 'hero':
      return {
        id,
        blockType: 'hero',
        variant: block.variant ?? 'centered',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading,
        subheading: block.subheading ?? null,
        image: media(block.image),
        images: [],
        marqueeLogos: [],
        actions: (block.actions ?? []).map((action, i) => ({
          id: key(slug, index, `-a${i}`),
          link: link(action),
        })),
      }

    case 'prose': {
      const images = block.images ?? (block.image ? [block.image] : [])
      return {
        id,
        blockType: 'richText',
        layout: block.layout ?? 'editorial',
        width: block.width ?? 'prose',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading ?? null,
        numbered: block.numbered ?? false,
        lede: block.lede ?? false,
        collapsible: block.collapsible ?? false,
        mediaPosition: block.mediaPosition ?? 'left',
        media: images
          .map((name, i) => ({ id: key(slug, index, `-m${i}`), image: media(name) }))
          .filter((entry): entry is { id: string; image: Media } => Boolean(entry.image)),
        content: richText(block.body),
      }
    }

    case 'features':
      return {
        id,
        blockType: 'featureGrid',
        heading: block.heading ?? null,
        intro: block.intro ?? null,
        display: block.display ?? 'grid',
        columns: block.columns ?? '3',
        features: block.items.map((item, i) => ({
          id: key(slug, index, `-f${i}`),
          iconName: item.icon,
          title: item.title,
          description: item.description,
        })),
      }

    case 'process':
      return {
        id,
        blockType: 'processSteps',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading ?? null,
        intro: block.intro ?? null,
        footnote: block.footnote ?? null,
        steps: block.steps.map((step, i) => ({
          id: key(slug, index, `-s${i}`),
          title: step.title,
          description: step.description,
          meta: step.meta,
        })),
      }

    case 'why':
      return {
        id,
        blockType: 'whyUs',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading ?? null,
        intro: block.intro ?? null,
        footnote: block.footnote ?? null,
        proofs: (block.proofs ?? []).map((proof, i) => ({
          id: key(slug, index, `-p${i}`),
          ...proof,
        })),
        pillars: block.pillars.map((pillar, i) => ({
          id: key(slug, index, `-c${i}`),
          ...pillar,
        })),
      }

    case 'industries':
      return {
        id,
        blockType: 'industries',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading ?? null,
        intro: block.intro ?? null,
        footnote: block.footnote ?? null,
        sectors: block.sectors.map((sector, i) => ({
          id: key(slug, index, `-i${i}`),
          name: sector.name,
          iconName: sector.icon ?? 'factory',
          description: sector.description,
        })),
      }

    case 'coverage':
      return {
        id,
        blockType: 'coverage',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading ?? null,
        tone: block.tone ?? 'dark',
        note: block.note ?? null,
        areas: block.areas.map((area, i) => ({
          id: key(slug, index, `-r${i}`),
          name: area.name,
          note: area.note,
        })),
        content: block.body ? richText(block.body) : undefined,
      }

    case 'faq':
      return {
        id,
        blockType: 'faq',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading ?? null,
        intro: block.intro ?? null,
        items: block.items.map((item, i) => ({
          id: key(slug, index, `-q${i}`),
          question: item.q,
          answer: richText(item.a),
        })),
      }

    case 'cta':
      return {
        id,
        blockType: 'cta',
        variant: block.variant ?? 'dark',
        eyebrow: block.eyebrow ?? null,
        heading: block.heading,
        body: block.body ?? null,
        actions: (block.actions ?? []).map((action, i) => ({
          id: key(slug, index, `-a${i}`),
          link: link(action),
        })),
      }
  }
}

/** One timestamp for the set: these pages ship with the build, not per request. */
const BUILT_AT = '2026-09-05T00:00:00.000Z'

export const toPage = (service: AuthoredService): Page => ({
  id: `service-${service.slug}`,
  title: service.title,
  slug: service.slug,
  layout: service.layout.map((block, index) => expand(block, service.slug, index)),
  meta: { title: service.meta.title, description: service.meta.description },
  _status: 'published',
  updatedAt: BUILT_AT,
  createdAt: BUILT_AT,
})

