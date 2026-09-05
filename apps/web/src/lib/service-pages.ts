/**
 * The registry of service inner pages.
 *
 * Every `src/content/services/*.json` file is picked up at build time, so
 * adding a service is adding a file. `getServicePage` is consulted only after
 * the CMS has been asked, which keeps Payload authoritative the moment a page
 * is created there under the same slug.
 */
import { toPage, type AuthoredService } from './service-content'

import type { Page } from './types'

const modules = import.meta.glob<{ default: AuthoredService }>('../content/services/*.json', {
  eager: true,
})

const authored: AuthoredService[] = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => a.order - b.order)

/** Slug -> expanded page, built once per process rather than per request. */
const pages = new Map<string, Page>(
  authored.map((service) => [service.slug, toPage(service)]),
)

export type ServiceSummary = {
  title: string
  slug: string
  href: string
  navLabel: string
  summary: string
}

export const serviceSummaries: ServiceSummary[] = authored.map((service) => ({
  title: service.title,
  slug: service.slug,
  href: `/${service.slug}`,
  navLabel: service.navLabel,
  summary: service.summary,
}))

export type ServiceMenuMeta = { label: string; blurb: string; icon: string }

/**
 * Menu presentation, keyed by the path the service is linked at. The header's
 * mega menu reads it so a nav item that points at a service page gets its short
 * label, its one-line blurb and its icon without the CMS having to restate any
 * of them — anything the CMS *does* say still wins.
 */
const menuMeta = new Map<string, ServiceMenuMeta>(
  authored.flatMap((service) =>
    service.menu ? [[`/${service.slug}`, service.menu] as const] : [],
  ),
)

export const serviceMenuMeta = (href: string): ServiceMenuMeta | null =>
  menuMeta.get(href) ?? null

export const getServicePage = (slug: string): Page | null => pages.get(slug) ?? null

/** Retired path -> the permalink it now lives at. */
const redirects = new Map<string, string>(
  authored.flatMap((service) =>
    (service.aliases ?? []).map((alias) => [alias, `/${service.slug}`] as const),
  ),
)

/**
 * The canonical path for a retired one, or null when the path was never a
 * service page. Callers redirect permanently: the move is not provisional.
 */
export const serviceRedirect = (slug: string): string | null => redirects.get(slug) ?? null

/** True when the slug is served from this registry rather than from the CMS. */
export const isServiceSlug = (slug: string): boolean => pages.has(slug)
