import type { Block } from 'payload'

import { linkField } from '../fields/link'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'actions',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      fields: [linkField({ appearances: true })],
    },
  ],
}
