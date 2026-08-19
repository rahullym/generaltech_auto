import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Site' },
  access: { read: anyone, update: editors },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'General Tech Automation' },
    { name: 'tagline', type: 'text' },
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Default SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
  ],
}
