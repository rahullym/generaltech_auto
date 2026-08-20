import type { Block } from 'payload'

/**
 * The "why choose us" section. The differentiator copy is long, so it is
 * stored as titled pillars plus a strip of hard numbers rather than as one
 * rich-text passage — that lets the frontend draw a hairline column grid and
 * keeps the section scannable without cutting a word of the approved copy.
 */
export const WhyUs: Block = {
  slug: 'whyUs',
  interfaceName: 'WhyUsBlock',
  labels: { singular: 'Why Us', plural: 'Why Us' },
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
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Sits beside the heading — one or two sentences reads best.' },
    },
    {
      name: 'proofs',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Proof point', plural: 'Proof points' },
      admin: {
        description:
          'The number strip under the heading. Keep each value to a few characters — "28+", "6", "1".',
      },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'pillars',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Pillar', plural: 'Pillars' },
      admin: { description: 'Three columns read best on desktop; more wrap onto a second row.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Optional closing line under the columns.' },
    },
  ],
}
