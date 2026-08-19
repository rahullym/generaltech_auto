import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site' },
  access: { read: anyone, update: editors },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'links', type: 'array', fields: [linkField()] },
      ],
    },
    { name: 'copyright', type: 'text' },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['x', 'linkedin', 'github', 'youtube', 'instagram', 'facebook'],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
