import type { CollectionConfig } from 'payload'

import { editors, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { previewUrl } from '../lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    group: 'Content',
    livePreview: { url: ({ data }) => previewUrl('posts', data?.slug) },
    preview: (doc) => previewUrl('posts', doc?.slug as string),
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
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'excerpt', type: 'textarea', maxLength: 300 },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', required: true },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'array',
      admin: { position: 'sidebar' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
  ],
}
