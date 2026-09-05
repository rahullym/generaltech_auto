/**
 * Facts that appear on more than one of the approved pages — the phone number,
 * the inbox, the office address — plus the small builders that turn them into
 * the link shape blocks expect. Stated once so a change lands everywhere.
 */

export const PHONE = '+971 6 543 6933'
export const TEL = 'tel:+97165436933'
export const EMAIL = 'mathews@generaltechuae.com'
export const MAILTO = `mailto:${EMAIL}`
export const ADDRESS = 'P.O. Box 25898, Sharjah, UAE'

/** Resolves a media filename to the id Payload stored it under. */
export type MediaResolver = (filename: string) => number | undefined

export const callAction = (label = `Call ${PHONE}`, appearance = 'primary') => ({
  link: { type: 'custom', label, url: TEL, appearance },
})

export const emailAction = (label = EMAIL, appearance = 'secondary') => ({
  link: { type: 'custom', label, url: MAILTO, appearance },
})

export const pageAction = (label: string, url: string, appearance = 'primary') => ({
  link: { type: 'custom', label, url, appearance },
})

/** A service link as the service index stores them. */
export const service = (label: string, url: string) => ({
  link: { type: 'custom', label, url, newTab: false },
})

export type SeededPage = {
  title: string
  slug: string
  meta: { title: string; description: string }
  layout: unknown[]
}
