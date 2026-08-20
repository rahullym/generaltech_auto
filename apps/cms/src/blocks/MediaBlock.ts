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
    {
      // Photographs come in at whatever ratio they were shot; letting the
      // editor crop to a band keeps the page rhythm predictable.
      name: 'aspect',
      type: 'select',
      defaultValue: 'natural',
      options: [
        { label: 'Natural (uncropped)', value: 'natural' },
        { label: 'Wide 16:9', value: 'wide' },
        { label: 'Cinematic 21:9', value: 'cinematic' },
      ],
    },
    {
      name: 'overline',
      type: 'text',
      admin: { description: 'Optional label set over the image, e.g. a site or project name.' },
    },
  ],
}
