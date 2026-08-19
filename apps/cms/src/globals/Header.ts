import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Site' },
  access: { read: anyone, update: editors },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      fields: [
        linkField(),
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          maxRows: 20,
          fields: [linkField(), { name: 'description', type: 'text' }],
        },
      ],
    },
    {
      name: 'ctas',
      type: 'array',
      label: 'Header buttons',
      maxRows: 2,
      fields: [linkField({ appearances: true })],
    },
  ],
}
