import type { CollectionConfig } from 'payload'

import { admins, adminsFieldLevel, adminsOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // The Astro frontend authenticates with an API key to read drafts
    // for live preview. Generate one per user in the admin panel.
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  access: {
    read: adminsOrSelf,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins may set roles, otherwise an editor could self-promote.
        create: adminsFieldLevel,
        update: adminsFieldLevel,
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: 'Shown on posts this user is credited as author of.' },
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
