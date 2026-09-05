import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

/** The icon keys `apps/web/src/lib/nav.ts` draws; anything else falls back. */
const NAV_ICONS = [
  'cpu',
  'network',
  'signal',
  'cabinet',
  'cog',
  'refresh',
  'shield',
  'gauge',
  'database',
  'clipboard',
  'chart',
  'package',
  'wrench',
  'code',
  'board',
  'upgrade',
]

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
          fields: [
            linkField(),
            { name: 'description', type: 'text', admin: { description: 'The line under the label in the menu.' } },
            {
              name: 'iconName',
              type: 'select',
              options: NAV_ICONS,
              admin: { description: 'Icon for the tile in an expanded menu.' },
            },
          ],
        },
        {
          name: 'megaMenu',
          type: 'group',
          label: 'Expanded menu',
          admin: {
            description:
              'A menu with more than six children opens as a panel. Every field here is optional — left empty, the panel names itself after this item and takes its quote card from the header button and the site contact details.',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Force the panel on or off',
              admin: { description: 'Leave unchecked to decide by the number of children.' },
            },
            { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
            { name: 'moreEyebrow', type: 'text', label: 'Overflow column heading', admin: { width: '50%' } },
            {
              name: 'featuredCount',
              type: 'number',
              label: 'Tiles before the overflow column',
              min: 0,
              max: 20,
              admin: { width: '50%', placeholder: '8' },
            },
            { name: 'viewAllLabel', type: 'text', admin: { width: '50%' } },
            { name: 'promoTitle', type: 'text' },
            { name: 'promoBody', type: 'textarea' },
            { name: 'stripLabel', type: 'text', label: 'Contact strip heading', admin: { placeholder: 'Talk to us' } },
          ],
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
