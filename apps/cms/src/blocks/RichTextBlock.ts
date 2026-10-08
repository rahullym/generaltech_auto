import type { Block } from 'payload'

import { diagramIcon } from '../fields/diagramIcon'

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
      name: 'footprint',
      type: 'group',
      label: 'Plant footprint',
      admin: {
        description:
          'Drawn in the image column instead of a photograph: what is already on the plant, and what the work fits to it. Leave the rows empty to show the imagery.',
        condition: (_, siblingData) => siblingData?.layout === 'editorial',
      },
      fields: [
        { name: 'label', type: 'text' },
        {
          name: 'rows',
          type: 'array',
          labels: { singular: 'Row', plural: 'Rows' },
          fields: [
            { name: 'have', type: 'text', required: true, label: 'Already on the plant' },
            diagramIcon('haveIcon'),
            { name: 'add', type: 'text', label: 'What is fitted' },
            diagramIcon('addIcon'),
            { name: 'how', type: 'text', required: true, label: 'How it is fitted' },
          ],
        },
      ],
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
      defaultValue: true,
      label: 'Collapse behind a "Read more" toggle',
      admin: {
        description:
          'On by default: a long passage shows its opening and the reader expands the rest. Copy that already fits is never clamped, whatever this says. Untick to publish the passage open.',
      },
    },
    { name: 'content', type: 'richText', required: true },
  ],
}
