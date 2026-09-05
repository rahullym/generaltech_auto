/**
 * The smallest set of Lexical node builders the seeded pages need.
 *
 * Payload stores rich text as a Lexical editor state, which is verbose to
 * write by hand and easy to get subtly wrong. These helpers keep the approved
 * copy readable in the page modules — a paragraph is a call with the sentence
 * in it — so a proofreader can compare a module against the source document
 * without reading past any JSON.
 */

export type TextRun = { text: string; bold?: boolean; italic?: boolean }

const IS_BOLD = 1
const IS_ITALIC = 1 << 1

export const text = (run: string | TextRun) => {
  const value = typeof run === 'string' ? { text: run } : run
  return {
    type: 'text',
    text: value.text,
    format: (value.bold ? IS_BOLD : 0) | (value.italic ? IS_ITALIC : 0),
    style: '',
    detail: 0,
    mode: 'normal',
    version: 1,
  }
}

/** An inline link to another page on the site, or to an external URL. */
export const link = (label: string | TextRun, url: string) => ({
  type: 'link',
  format: '',
  indent: 0,
  version: 3,
  direction: 'ltr' as const,
  fields: { linkType: 'custom', url, newTab: false },
  children: [text(label)],
})

type Child = string | TextRun | ReturnType<typeof link>

const child = (value: Child) =>
  typeof value === 'object' && 'type' in value && value.type === 'link' ? value : text(value as string | TextRun)

export const paragraph = (...runs: Child[]) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: runs.map(child),
})

export const heading = (value: string, tag: 'h2' | 'h3' | 'h4' = 'h2') => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [text(value)],
})

export const listItem = (...runs: Child[]) => ({
  type: 'listitem',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  value: 1,
  checked: undefined,
  children: runs.map(child),
})

export const list = (
  listType: 'bullet' | 'number',
  items: ReturnType<typeof listItem>[],
) => ({
  type: 'list',
  listType,
  start: 1,
  tag: listType === 'number' ? 'ol' : 'ul',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: items.map((item, index) => ({ ...item, value: index + 1 })),
})

export const doc = (...children: unknown[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children,
  },
})
