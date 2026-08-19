import type { AstroCookies } from 'astro'

const PREVIEW_COOKIE = 'payload-preview'

/** True when the visitor arrived through the validated preview endpoint. */
export const isPreview = (cookies: AstroCookies): boolean =>
  cookies.get(PREVIEW_COOKIE)?.value === '1'
