import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (single column)', value: 'default' },
        { label: 'Editorial (copy beside imagery)', value: 'editorial' },
        { label: 'Split (sticky heading beside the copy)', value: 'split' },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Prose (readable measure)', value: 'prose' },
        { label: 'Full width', value: 'full' },
      ],
      admin: { condition: (_, siblingData) => siblingData?.layout !== 'editorial' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.layout === 'split' },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in red italics.',
        condition: (_, siblingData) => siblingData?.layout === 'split',
      },
    },
    {
      name: 'numbered',
      type: 'checkbox',
      label: 'Number each paragraph',
      admin: {
        description: 'Turns a long passage into numbered beats separated by hairlines.',
        condition: (_, siblingData) => siblingData?.layout === 'split',
      },
    },
    {
      name: 'media',
      type: 'array',
      label: 'Imagery',
      maxRows: 2,
      admin: {
        description: 'One image fills the column; two are offset into a collage.',
        condition: (_, siblingData) => siblingData?.layout === 'editorial',
      },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Imagery on the left', value: 'left' },
        { label: 'Imagery on the right', value: 'right' },
      ],
      admin: { condition: (_, siblingData) => siblingData?.layout === 'editorial' },
    },
    {
      name: 'lede',
      type: 'checkbox',
      label: 'Set the first paragraph as a standfirst',
      admin: { description: 'Renders the opening paragraph larger and darker.' },
    },
    {
      name: 'collapsible',
      type: 'checkbox',
      label: 'Collapse behind a "Read more" toggle',
      admin: {
        description:
          'Shows the opening of the copy and lets the reader expand the rest, keeping the section short.',
      },
    },
    { name: 'content', type: 'richText', required: true },
  ],
}
