/**
 * The shape behind the header's expanded ("mega") menu.
 *
 * A nav item with a long child list is unreadable as a single dropdown column —
 * Services alone has sixteen entries — so those open into a panel instead: the
 * children as short headed columns of icon-and-blurb rows, with a quote card
 * beside them. The columns are the point. Sixteen links in one run gives a
 * visitor nothing to navigate by, and splitting them into a featured set and an
 * overflow list only helps if the split means something; ranking by position in
 * an alphabetical list means nothing, so each child names its own group and the
 * panel is built from those.
 *
 * Everything here is derived, never required: the CMS can name each child's
 * group, its blurb and the promo copy, and where it says nothing the service
 * registry and the site settings fill the gaps, so the panel is complete with
 * the nav data that already exists. Children that name no group at all fall
 * back to untitled columns of roughly equal length, so a mega menu built from
 * links that are not services still reads as a panel.
 */
import { isActive, resolveHref } from './urls'

import type { Header, NavItem, SiteSettings } from './types'

/**
 * The Services menu's columns, in the order they read across the panel.
 *
 * Sixteen services in one alphabetical run gives a visitor no way to guess
 * where the one they want sits, so each row names the group it belongs under
 * and the menu becomes three short, headed columns. The order is editorial —
 * build, then keep running, then get data out. A group a row names but this
 * list omits still renders; it simply sorts last.
 */
export const SERVICE_MENU_GROUPS = [
  'Engineering & Build',
  'Maintenance & Repair',
  'Digital & Data',
] as const

/** Line icons on the same 24px grid the service and industry blocks use. */
export const NAV_ICONS: Record<string, string> = {
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
  network:
    '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4"/><path d="M5 16v-2h14v2"/>',
  signal:
    '<path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M2 8.82a16 16 0 0 1 20 0"/><path d="M8.5 16.43a6 6 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/>',
  cabinet:
    '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 2v20"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7 6h2"/><path d="M15 6h2"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  gauge: '<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M13.4 10.6 19 5"/><path d="M20.5 17a10 10 0 1 0-17 0"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  clipboard:
    '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/><circle cx="19" cy="6" r="1.6"/>',
  package:
    '<path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  wrench:
    '<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.9 9.9a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3 18 3a4 4 0 0 1 3 3l-3.3 3.3"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><path d="m13 4-2 16"/>',
  board:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 3v4h4"/><path d="M21 12h-5a2 2 0 0 0-2 2v2"/><circle cx="8" cy="14" r="2"/><path d="M3 9h3"/>',
  upgrade: '<path d="M12 20V8"/><path d="m6 14 6-6 6 6"/><path d="M5 4h14"/>',
}

export const navIcon = (name?: string | null): string => NAV_ICONS[name ?? ''] ?? NAV_ICONS.cog

export type MegaTile = {
  href: string
  label: string
  blurb?: string
  icon: string
  active: boolean
}

/** One column of the panel. `title` is null only in the ungrouped fallback. */
export type MegaGroup = { title: string | null; items: MegaTile[] }

export type MegaMenu = {
  eyebrow: string
  groups: MegaGroup[]
  viewAll: { href: string; label: string } | null
  promo: { title: string; body?: string; cta: { href: string; label: string } | null } | null
  strip: { label: string; items: string[] } | null
}

/** A panel rather than a column past this many children, unless the CMS says. */
const MEGA_THRESHOLD = 6

/** As many columns as the panel can give a readable width to. */
const MAX_COLUMNS = 3

/** Whether this item's children open as the expanded panel. */
export const isMega = (item: NavItem): boolean =>
  item.megaMenu?.enabled ?? (item.children ?? []).length > MEGA_THRESHOLD

/** Splits `items` into `count` columns of near-equal length, in order. */
const inColumns = <T,>(items: T[], count: number): T[][] => {
  const columns = Math.min(count, items.length)
  const per = Math.ceil(items.length / Math.max(columns, 1))

  return Array.from({ length: columns }, (_, index) =>
    items.slice(index * per, (index + 1) * per),
  ).filter((column) => column.length > 0)
}

/**
 * The panel's columns: one per named group, ordered as the service registry
 * lists them, with any group it does not name following in the order the
 * children introduce it.
 *
 * Children that name no group are the fallback for a menu built from links
 * that are not services: rather than one unreadable column of everything, they
 * are dealt into untitled columns the panel can lay out side by side.
 */
const toGroups = (entries: { group: string | null; tile: MegaTile }[]): MegaGroup[] => {
  const named = new Map<string, MegaTile[]>()
  const loose: MegaTile[] = []

  for (const { group, tile } of entries) {
    if (!group) {
      loose.push(tile)
      continue
    }

    const column = named.get(group)
    if (column) column.push(tile)
    else named.set(group, [tile])
  }

  // Anything the registry does not rank sorts last, and ties keep insertion
  // order because Array.prototype.sort is stable.
  const rank = (title: string) => {
    const index = (SERVICE_MENU_GROUPS as readonly string[]).indexOf(title)
    return index === -1 ? SERVICE_MENU_GROUPS.length : index
  }

  const groups: MegaGroup[] = [...named]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([title, items]) => ({ title, items }))

  const spare = Math.max(MAX_COLUMNS - groups.length, 1)

  return [...groups, ...inColumns(loose, spare).map((items) => ({ title: null, items }))]
}

/**
 * Builds the panel for one nav item. `pathname` marks the current page inside
 * it; `header` and `settings` supply the quote card and the contact strip.
 */
export const buildMegaMenu = (
  item: NavItem,
  pathname: string,
  header: Header,
  settings: SiteSettings,
): MegaMenu => {
  const config = item.megaMenu ?? {}
  const parentLabel = item.link?.label ?? ''
  const parentHref = resolveHref(item.link)
  const children = item.children ?? []

  const entries = children.map((child) => {
    const href = resolveHref(child.link)

    return {
      group: child.groupName || null,
      tile: {
        href,
        label: child.link?.label ?? '',
        blurb: child.description ?? undefined,
        icon: child.iconName ?? 'cog',
        active: isActive(href, pathname),
      },
    }
  })

  const ctaLink = header.ctas?.[0]?.link
  const phone = settings.contact?.phone
  const email = settings.contact?.email

  return {
    eyebrow: config.eyebrow || parentLabel,
    groups: toGroups(entries),
    viewAll:
      parentHref === '#'
        ? null
        : {
            href: parentHref,
            label: config.viewAllLabel || `View all ${parentLabel.toLowerCase()}`,
          },
    promo: {
      title: config.promoTitle || `Need help with ${parentLabel.toLowerCase()}?`,
      body: config.promoBody || settings.tagline || settings.defaultSeo?.description || undefined,
      cta: ctaLink ? { href: resolveHref(ctaLink), label: ctaLink.label ?? 'Get in touch' } : null,
    },
    strip:
      phone || email
        ? { label: config.stripLabel || 'Talk to us', items: [phone, email].filter(Boolean) as string[] }
        : null,
  }
}
