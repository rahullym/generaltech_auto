import type { CollectionConfig } from 'payload'

import { anyone, editors } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: anyone,
    create: editors,
    update: editors,
    delete: editors,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
    // Sizes the Astro frontend requests via srcset.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'wide', width: 1440, height: 810, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen readers. Required.' },
    },
    { name: 'caption', type: 'text' },
  ],
}
