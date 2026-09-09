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
 * Authoring is the services' own: a file in `src/content/applications/*.json`
 * per example, expanded by `authored-content.ts` into the blocks the CMS pages
 * already render. Adding an example is adding a file.
 */
import { toPage, type AuthoredBlock, type AuthoredPage } from './authored-content'

import type { Page } from './types'

export type AuthoredApplication = AuthoredPage & {
  /** Position on the index grid. */
  order: number
  /** The card's heading — the page title is written for search, and is longer. */
  cardTitle: string
  /** The line under the card's heading: the problem, in a visitor's words. */
  cardBlurb: string
  /** A filename from the committed media, drawn as the card's image. */
  cardImage?: string
  /** The chips under the card. Sectors, not services — this is the "is this me?" cue. */
  sectors: string[]
  layout: AuthoredBlock[]
}

const modules = import.meta.glob<{ default: AuthoredApplication }>(
  '../content/applications/*.json',
  { eager: true },
)

const authored: AuthoredApplication[] = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => a.order - b.order)

/** Slug -> expanded page, built once per process rather than per request. */
const pages = new Map<string, Page>(
  authored.map((application) => [application.slug, toPage(application, 'application')]),
)

export type ApplicationSummary = {
  title: string
  href: string
  blurb: string
  image?: string
  sectors: string[]
}

/** What the index grid draws, in authoring order. */
export const applicationSummaries: ApplicationSummary[] = authored.map((application) => ({
  title: application.cardTitle,
  href: `/${application.slug}`,
  blurb: application.cardBlurb,
  image: application.cardImage,
  sectors: application.sectors,
}))

export const getApplicationPage = (slug: string): Page | null => pages.get(slug) ?? null

/** True when the slug is served from this registry rather than from the CMS. */
export const isApplicationSlug = (slug: string): boolean => pages.has(slug)
