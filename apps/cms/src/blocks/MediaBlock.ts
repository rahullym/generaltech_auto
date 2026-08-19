import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'media',
  interfaceName: 'MediaBlock',
  labels: { singular: 'Media', plural: 'Media' },
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
  ],
}
