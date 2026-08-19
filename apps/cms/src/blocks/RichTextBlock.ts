import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    {
      name: 'width',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Prose (readable measure)', value: 'prose' },
        { label: 'Full width', value: 'full' },
      ],
    },
    { name: 'content', type: 'richText', required: true },
  ],
}
