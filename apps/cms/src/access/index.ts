import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

/** Anyone, including unauthenticated API consumers (the Astro frontend). */
export const anyone: Access = () => true

/** Any signed-in user. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Editors and admins may write content. */
export const editors: Access = ({ req: { user } }) =>
  Boolean(user && ['admin', 'editor'].includes((user as User).role))

/** Admins only — user management, destructive operations. */
export const admins: Access = ({ req: { user } }) => (user as User | null)?.role === 'admin'

export const adminsFieldLevel: FieldAccess = ({ req: { user } }) =>
  (user as User | null)?.role === 'admin'

/**
 * Published documents are public; drafts are visible only to signed-in users.
 * This is what lets Astro fetch live content anonymously while preview
 * requests (authenticated via the preview secret) still see drafts.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

/** Admins see every user; everyone else sees only their own record. */
export const adminsOrSelf: Access = ({ req: { user } }) => {
  const u = user as User | null
  if (!u) return false
  if (u.role === 'admin') return true

  return { id: { equals: u.id } }
}
