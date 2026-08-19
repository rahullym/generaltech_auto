import type { Field } from 'payload'

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * URL slug, auto-derived from `trackedField` when left blank.
 * Indexed because every frontend lookup queries by it.
 */
export const slugField = (trackedField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  required: true,
  admin: {
    position: 'sidebar',
    description: 'Leave blank to generate from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        if (typeof value === 'string' && value.length > 0) return toSlug(value)

        const tracked = data?.[trackedField]
        if (typeof tracked === 'string' && tracked.length > 0) return toSlug(tracked)

        return value
      },
    ],
  },
})
