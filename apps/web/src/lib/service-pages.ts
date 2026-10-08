/**
 * The service inner pages.
 *
 * A service is a Page whose type is "Service" in the CMS. It is fetched like
 * any other page; what this adds is the one thing a service has that a plain
 * page does not — the paths it used to live at.
 */
import { find } from './payload'

import type { Page } from './types'

/**
 * The canonical path for a retired one, or null when the path was never a
 * service page. Callers redirect permanently: the move is not provisional.
 */
export const serviceRedirect = async (path: string): Promise<string | null> => {
  const result = await find<Page>('pages', {
    where: { 'service.aliases.path': { equals: path } },
    select: ['slug'],
    limit: 1,
    depth: 0,
  })

  const page = result.docs[0]
  return page ? `/${page.slug}` : null
}
