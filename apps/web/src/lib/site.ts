import { findGlobal } from './payload'
import type { Footer, Header, SiteSettings } from './types'

export type SiteChrome = {
  header: Header
  footer: Footer
  settings: SiteSettings
}

/**
 * Header, footer and site settings are needed by every page. Fetched together
 * so a request costs three parallel calls rather than three serial ones.
 */
export const getSiteChrome = async (): Promise<SiteChrome> => {
  const [header, footer, settings] = await Promise.all([
    findGlobal<Header>('header', { depth: 2 }),
    findGlobal<Footer>('footer', { depth: 2 }),
    findGlobal<SiteSettings>('site-settings', { depth: 1 }),
  ])

  return { header, footer, settings }
}
