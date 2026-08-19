/**
 * The General Tech headline style sets the last few words of a heading in red
 * DM Sans italic ("Numbers You Can *Count On.*"). The CMS stores headings as
 * plain strings, so editors mark the accent by wrapping it in asterisks; if no
 * marker is present the whole heading renders in the normal black weight.
 */
export type AccentHeading = { lead: string; accent: string }

export const splitAccent = (heading?: string | null): AccentHeading => {
  if (!heading) return { lead: '', accent: '' }

  const match = heading.match(/^([\s\S]*?)\*([^*]+)\*([\s\S]*)$/)
  if (!match) return { lead: heading.trim(), accent: '' }

  const [, before, accent, after] = match
  return { lead: `${before}`.trimEnd(), accent: `${accent}${after}`.trim() }
}
