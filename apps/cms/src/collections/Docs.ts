import type { CollectionConfig } from 'payload'

import { editors, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { previewUrl } from '../lib/preview'

/**
 * Documentation pages. Self-referential `parent` + `order` model the sidebar
 * tree; the frontend builds nesting from a single flat query.
 */
export const Docs: CollectionConfig = {
  slug: 'docs',
  labels: { singular: 'Doc', plural: 'Docs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'order', '_status'],
    group: 'Content',
    livePreview: { url: ({ data }) => previewUrl('docs', data?.slug) },
    preview: (doc) => previewUrl('docs', doc?.slug as string),
  },
  access: {
    read: publishedOrAuthenticated,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: {
    drafts: { autosave: { interval: 400 } },
    maxPerDoc: 50,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Used for search results and meta description.' },
    },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'docs',
      admin: {
        position: 'sidebar',
        description: 'Leave empty for a top-level section.',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers sort first within the same parent.',
      },
    },
  ],
}
