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

/**
 * Caption headings — the title on a card, panel or process step — take the same
 * two-tone treatment as the section heading above them: the title in the card's
 * own colour with its closing word in red DM Sans italic, exactly as on
 * generaltech.ae ("Dimensional *Calibration*").
 *
 * Captions are almost never marked up by hand — they arrive from a CMS field or
 * a service content file as plain strings — so the closing word is found rather
 * than authored. An explicit `*…*` marker still wins wherever an editor wants a
 * different split.
 *
 * Only a title-cased caption splits ("Servo Motor & Drive Repair"). A
 * sentence-cased one ("Call logged and triaged") is left whole, because a red
 * italic "triaged" reads as a mistake rather than as a flourish, and a
 * single-word caption has nothing to split.
 */
export const splitCaption = (heading?: string | null): AccentHeading => {
  if (!heading) return { lead: '', accent: '' }
  if (heading.includes('*')) return splitAccent(heading)

  const words = heading.trim().split(/\s+/)
  if (words.length < 2) return { lead: heading.trim(), accent: '' }

  // A trailing parenthetical belongs to the word it qualifies: "… Contracts
  // (AMC)" accents both, never the bracket on its own.
  const span = words.length > 2 && words[words.length - 1].startsWith('(') ? 2 : 1
  const accent = words.slice(-span).join(' ')

  if (!/^[A-Z0-9]/.test(accent.replace(/^[^A-Za-z0-9]+/, ''))) {
    return { lead: heading.trim(), accent: '' }
  }

  return { lead: words.slice(0, -span).join(' '), accent }
}
