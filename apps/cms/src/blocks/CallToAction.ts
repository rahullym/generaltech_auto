import type { Block } from 'payload'

import { linkField } from '../fields/link'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    {
      // The home page carries three CTAs. Rendering all of them as the same
      // black slab made the page repetitive, so each instance picks a
      // treatment and successive CTAs can alternate.
      name: 'variant',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark slab (full-width statement)', value: 'dark' },
        { label: 'Light editorial (heading left, actions right)', value: 'light' },
        { label: 'Compact bar (single line, low emphasis)', value: 'compact' },
      ],
      admin: {
        description:
          'Vary this between CTAs on the same page so they do not read as repeats.',
      },
    },
    // Small red kicker above the heading. Falls back to "Get in touch".
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'body',
      type: 'textarea',
      admin: { condition: (_, siblingData) => siblingData?.variant !== 'compact' },
    },
    {
      name: 'actions',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      fields: [linkField({ appearances: true })],
    },
  ],
}
