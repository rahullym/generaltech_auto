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
    // Sizes the Astro frontend requests via srcset. Width-only: sharp scales to
    // the width and keeps the source aspect ratio, so a wide site photograph is
    // never centre-cropped into a square. Components that must not be resampled
    // at all (logos) pass `raw` to <Picture> and use the original.
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'wide', width: 1440 },
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
