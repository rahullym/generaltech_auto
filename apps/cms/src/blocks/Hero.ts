import type { Block } from 'payload'

import { linkField } from '../fields/link'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Banner (full-screen, image slideshow)', value: 'banner' },
        { label: 'Centered', value: 'centered' },
        { label: 'Split with media', value: 'split' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.variant === 'split' ||
          siblingData?.variant === 'centered' ||
          siblingData?.variant === 'minimal',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Background slideshow',
      admin: {
        description: 'Crossfades behind the banner. One image is fine.',
        condition: (_, siblingData) => siblingData?.variant === 'banner',
      },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'marqueeLogos',
      type: 'array',
      label: 'Brand marquee',
      admin: {
        description: 'Partner marks that scroll along the bottom of the banner.',
        condition: (_, siblingData) => siblingData?.variant === 'banner',
      },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'actions',
      type: 'array',
      maxRows: 3,
      fields: [linkField({ appearances: true })],
    },
  ],
}
