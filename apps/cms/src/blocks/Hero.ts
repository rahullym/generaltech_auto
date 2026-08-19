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
      admin: { condition: (_, siblingData) => siblingData?.variant === 'split' },
    },
    {
      name: 'actions',
      type: 'array',
      maxRows: 2,
      fields: [linkField({ appearances: true })],
    },
  ],
}
