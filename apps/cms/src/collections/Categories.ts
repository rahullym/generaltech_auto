import type { CollectionConfig } from 'payload'

import { anyone, editors } from '../access'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: editors,
    update: editors,
    delete: editors,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'description', type: 'textarea' },
  ],
}
