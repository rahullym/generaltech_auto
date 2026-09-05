import type { Field } from 'payload'

/**
 * Derives a slug from a title: lowercase, punctuation dropped, words joined
 * with hyphens.
 */
const fromTitle = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Tidies a slug an editor typed themselves, without reshaping it. Underscores
 * survive, because some of this site's URLs have always had them (`/about_us`,
 * `/contact_us`) and the navigation points at those; normalising them to
 * hyphens would silently move two live pages.
 */
const fromInput = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\-_]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')

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
        if (typeof value === 'string' && value.length > 0) return fromInput(value)

        const tracked = data?.[trackedField]
        if (typeof tracked === 'string' && tracked.length > 0) return fromTitle(tracked)

        return value
      },
    ],
  },
})
