import type { Block } from 'payload'

/**
 * "Where we work". The covered areas are stored as their own rows rather than
 * being buried in the prose, so the frontend can thread them onto a single
 * rail — a map of the coverage without drawing an inaccurate one — with the
 * approved copy kept intact underneath.
 */
export const Coverage: Block = {
  slug: 'coverage',
  interfaceName: 'CoverageBlock',
  labels: { singular: 'Coverage', plural: 'Coverage' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.',
      },
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (full-bleed black band)', value: 'dark' },
        { label: 'Light (grey band)', value: 'light' },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description: 'Short response-time claim, set in a panel beside the heading.',
      },
    },
    {
      name: 'areas',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Area', plural: 'Areas' },
      admin: { description: 'Four areas fill the rail on desktop; more wrap onto a second row.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'note',
          type: 'text',
          admin: { description: 'One line naming the zones or towns the area covers.' },
        },
      ],
    },
    { name: 'content', type: 'richText' },
  ],
}
