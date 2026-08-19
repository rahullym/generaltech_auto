/**
 * Hand-written shapes for what the frontend actually consumes.
 *
 * Payload generates exhaustive types into `apps/cms/src/payload-types.ts`;
 * run `pnpm generate:types` and import from `@repo/types` when you want the
 * full generated surface. These narrower types keep the templates readable.
 */

export type Media = {
  id: string
  alt: string
  caption?: string
  url: string
  width?: number
  height?: number
  mimeType?: string
  sizes?: Record<string, { url?: string; width?: number; height?: number } | undefined>
}

export type LinkValue = {
  type?: 'reference' | 'custom'
  label?: string
  url?: string
  newTab?: boolean
  appearance?: 'primary' | 'secondary' | 'link'
  reference?: {
    relationTo: 'pages' | 'posts' | 'docs'
    value: string | { slug?: string }
  }
}

/** Lexical editor state, as stored by Payload's richText fields. */
export type LexicalNode = {
  type: string
  version?: number
  children?: LexicalNode[]
  direction?: 'ltr' | 'rtl' | null
  format?: string | number
  indent?: number
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  text?: string
  url?: string
  newTab?: boolean
  fields?: Record<string, unknown>
  value?: unknown
  relationTo?: string
  [key: string]: unknown
}

export type RichTextValue = {
  root: LexicalNode
}

export type SeoMeta = {
  title?: string
  description?: string
  image?: Media | string
}

export type Block = { id?: string; blockType: string; [key: string]: unknown }

export type Page = {
  id: string
  title: string
  slug: string
  layout: Block[]
  meta?: SeoMeta
  _status?: 'draft' | 'published'
  updatedAt: string
  createdAt: string
}

export type Author = {
  id: string
  name: string
  bio?: string
  avatar?: Media | string
}

export type Category = {
  id: string
  title: string
  slug: string
  description?: string
}

export type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string
  heroImage?: Media | string
  content: RichTextValue
  publishedAt: string
  authors?: (Author | string)[]
  categories?: (Category | string)[]
  tags?: { tag: string }[]
  meta?: SeoMeta
  _status?: 'draft' | 'published'
  updatedAt: string
}

export type Doc = {
  id: string
  title: string
  slug: string
  description?: string
  content: RichTextValue
  parent?: string | Doc | null
  order: number
  meta?: SeoMeta
  _status?: 'draft' | 'published'
  updatedAt: string
}

export type PaginatedDocs<T> = {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}

export type Global = { id: string; updatedAt: string }

export type NavItem = {
  id?: string
  link: LinkValue
  children?: { id?: string; link: LinkValue; description?: string }[]
}

export type Header = Global & {
  navItems?: NavItem[]
  ctas?: { id?: string; link: LinkValue }[]
}

export type Footer = Global & {
  columns?: { id?: string; title: string; links?: { id?: string; link: LinkValue }[] }[]
  copyright?: string
  socials?: { id?: string; platform: string; url: string }[]
}

export type SiteSettings = Global & {
  siteName: string
  tagline?: string
  defaultSeo?: SeoMeta
  logo?: Media | string
  favicon?: Media | string
  contact?: { email?: string; phone?: string; address?: string }
}
