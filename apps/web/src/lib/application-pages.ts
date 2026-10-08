/**
 * The application examples: worked illustrations of what automation can do on a
 * plant, one page each.
 *
 * These answer a different question from the service pages. A service page says
 * what General Tech Automation will do for you; an application example says
 * what the finished thing looks like on your site — what gets measured, what it
 * is wired to, what appears on a screen afterwards. A visitor who does not yet
 * know that "field instrumentation" is what they want will recognise "we dip
 * our tanks by hand and still run dry".
 *
 * They are illustrative, not case studies: a typical arrangement for a common
 * problem, with no named client and no measured savings attached. Anything
 * stated as a result of a real project belongs in a real project's own page,
 * written from that project's numbers.
 *
 * An example is a Page whose type is "Application example" in the CMS. Its
 * card on the index grid is drawn from the Card fields on that page, so
 * publishing one is all it takes to list it.
 */
import { find } from './payload'

import type { Media, Page } from './types'

export type ApplicationSummary = {
  title: string
  href: string
  blurb?: string
  image?: Media
  sectors: string[]
}

/** What the index grid draws, in the order the pages give themselves. */
export const listApplications = async (): Promise<ApplicationSummary[]> => {
  const result = await find<Page>('pages', {
    where: { kind: { equals: 'application' } },
    select: ['title', 'slug', 'application'],
    sort: 'application.order',
    limit: 200,
    depth: 1,
  })

  return result.docs.map((page) => {
    const card = page.application ?? {}

    return {
      title: card.cardTitle || page.title,
      href: `/${page.slug}`,
      blurb: card.cardBlurb ?? undefined,
      image: card.cardImage && typeof card.cardImage === 'object' ? card.cardImage : undefined,
      sectors: (card.sectors ?? []).map((sector) => sector.name),
    }
  })
}
