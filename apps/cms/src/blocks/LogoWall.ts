import type { Block } from 'payload'

/** A grid of partner/brand marks, as on the General Tech Automation homepage. */
export const LogoWall: Block = {
  slug: 'logoWall',
  interfaceName: 'LogoWallBlock',
  labels: { singular: 'Logo Wall', plural: 'Logo Walls' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Logo', plural: 'Logos' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
