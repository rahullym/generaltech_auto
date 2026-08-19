import type { LexicalNode, RichTextValue } from './types'
import { resolveHref } from './urls'

// Lexical encodes inline styling as a bitmask on `format`.
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const escapeAttr = (value: string): string => escapeHtml(value)

/** Wraps text in the tags implied by its format bitmask. */
const applyTextFormat = (text: string, format: number): string => {
  let html = text

  if (format & IS_CODE) html = `<code>${html}</code>`
  if (format & IS_BOLD) html = `<strong>${html}</strong>`
  if (format & IS_ITALIC) html = `<em>${html}</em>`
  if (format & IS_STRIKETHROUGH) html = `<s>${html}</s>`
  if (format & IS_UNDERLINE) html = `<u>${html}</u>`
  if (format & IS_SUBSCRIPT) html = `<sub>${html}</sub>`
  if (format & IS_SUPERSCRIPT) html = `<sup>${html}</sup>`

  return html
}

const ALIGNMENTS = new Set(['left', 'center', 'right', 'justify'])

const alignClass = (format: unknown): string =>
  typeof format === 'string' && ALIGNMENTS.has(format) ? ` class="text-${format}"` : ''

const headingText = (node: LexicalNode): string =>
  (node.children ?? []).map((c) => c.text ?? '').join('')

const headingId = (node: LexicalNode): string =>
  headingText(node)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')

const renderChildren = (node: LexicalNode): string =>
  (node.children ?? []).map(renderNode).join('')

const renderNode = (node: LexicalNode): string => {
  switch (node.type) {
    case 'text': {
      const format = typeof node.format === 'number' ? node.format : 0
      return applyTextFormat(escapeHtml(node.text ?? ''), format)
    }

    case 'linebreak':
      return '<br />'

    case 'paragraph': {
      const inner = renderChildren(node)
      // Lexical emits empty paragraphs for blank lines; keep the spacing.
      if (!inner) return '<p><br /></p>'
      return `<p${alignClass(node.format)}>${inner}</p>`
    }

    case 'heading': {
      const tag = node.tag && /^h[1-6]$/.test(node.tag) ? node.tag : 'h2'
      // Anchor id must match what `extractHeadings` computes, or the
      // table of contents links go nowhere.
      const id = headingId(node)
      return `<${tag} id="${escapeAttr(id)}"${alignClass(node.format)}>${renderChildren(node)}</${tag}>`
    }

    case 'quote':
      return `<blockquote>${renderChildren(node)}</blockquote>`

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const cls = node.listType === 'check' ? ' class="list-check"' : ''
      return `<${tag}${cls}>${renderChildren(node)}</${tag}>`
    }

    case 'listitem': {
      // A nested list is wrapped in a listitem whose only child is a list.
      const checked = node.checked === true ? ' data-checked="true"' : ''
      return `<li${checked}>${renderChildren(node)}</li>`
    }

    case 'horizontalrule':
      return '<hr />'

    case 'link':
    case 'autolink': {
      const fields = (node.fields ?? {}) as Record<string, unknown>
      const href = resolveHref({
        type: fields.linkType === 'internal' ? 'reference' : 'custom',
        url: (fields.url as string) ?? node.url,
        reference: fields.doc as never,
      })
      const newTab = fields.newTab === true || node.newTab === true
      const rel = newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeAttr(href)}"${rel}>${renderChildren(node)}</a>`
    }

    case 'upload': {
      const value = node.value as
        | { url?: string; alt?: string; width?: number; height?: number }
        | undefined
      if (!value?.url) return ''

      const caption = (node.fields as { caption?: string } | undefined)?.caption
      const dims =
        value.width && value.height ? ` width="${value.width}" height="${value.height}"` : ''
      const img = `<img src="${escapeAttr(value.url)}" alt="${escapeAttr(value.alt ?? '')}"${dims} loading="lazy" decoding="async" />`

      return caption
        ? `<figure>${img}<figcaption>${escapeHtml(caption)}</figcaption></figure>`
        : `<figure>${img}</figure>`
    }

    case 'relationship':
      return ''

    default:
      // Unknown node types still render their children rather than vanishing.
      return renderChildren(node)
  }
}

/** Converts a Payload Lexical value into an HTML string. */
export const lexicalToHtml = (value?: RichTextValue | null): string => {
  if (!value?.root?.children) return ''
  return value.root.children.map(renderNode).join('')
}

/** Extracts plain text, for excerpts, meta descriptions and search indexes. */
export const lexicalToText = (value?: RichTextValue | null): string => {
  if (!value?.root) return ''

  const walk = (node: LexicalNode): string => {
    if (node.type === 'text') return node.text ?? ''
    return (node.children ?? []).map(walk).join(node.type === 'paragraph' ? '' : ' ')
  }

  return (value.root.children ?? [])
    .map(walk)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Collects headings so a doc page can render an on-page table of contents. */
export const extractHeadings = (
  value?: RichTextValue | null,
): { id: string; text: string; level: number }[] => {
  if (!value?.root?.children) return []

  return value.root.children
    .filter((node) => node.type === 'heading')
    .map((node) => ({
      id: headingId(node),
      text: headingText(node),
      level: Number(node.tag?.replace('h', '') ?? 2),
    }))
    .filter((h) => h.text.length > 0)
}
