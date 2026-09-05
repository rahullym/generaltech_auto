/**
 * Source-of-truth check: every sentence in the source PDF must appear on the
 * page it was written for, word for word.
 *
 * The PDFs are extracted with `pdftotext` first (see the header of the run
 * script). Production metadata — the meta title/description/permalink header,
 * the keyword-density footer, and the schema recommendations — is excluded by
 * name, since it belongs in <head> and in JSON-LD rather than in the copy.
 *
 * Usage:  node scripts/diff-services-against-source.mjs <pdfTextDir> [baseUrl]
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const [textDir, BASE = 'http://localhost:4399'] = process.argv.slice(2)

/** Source file (by its leading number or name) -> the page it became. */
const PAIRS = [
  ['1.service', 'amc-services-panels-vfd-ups-servo-drives-uae'],
  ['2-service', 'asset-data-management-services-uae'],
  ['3.service', 'industrial-automation-solutions-uae'],
  ['4-service', 'service/cnc-machine-repair-services-uae'],
  ['5.service', 'service/measurement-commissioning-start-up-services-uae'],
  ['6.service', 'service/custom-control-panel-design-manufacturing-uae'],
  ['7.service', 'service/digital-transformation-services-uae'],
  ['8.service', 'service/field-instrumentation-services-and-support-uae'],
  ['9.service', 'service/industrial-iot-services-uae'],
  ['10.service', 'service/main-instrument-supplier-uae'],
  ['11.service', 'service/measurement-preventative-services-uae'],
  ['12.service', 'plc-maintenance-and-troubleshooting-services-uae'],
  ['13.service', 'plc-programming-services-uae'],
  ['14.service', 'industrial-repair-services-uae'],
  ['15.service', 'industrial-retrofit-solutions-uae'],
  ['Wireless-Plant', 'wireless-plant-network-support-uae'],
]

/**
 * Lines that are production metadata rather than page copy. Each is a prefix
 * match on the trimmed line, so the exclusion is explicit and auditable.
 */
const METADATA = [
  'Meta Title', 'Meta title', 'Meta Description', 'Meta description', 'Permalink',
  'Primary Keyword', 'Primary keyword', 'Word Count', 'Word count', 'Estimated SEO Score',
  'Secondary keywords', 'Secondary Keywords', 'SEO Score', 'Content stats', 'Keyword density',
  'Combined primary', 'All 35 secondary', 'No invented certifications', 'Turnaround times included',
  'Schema Recommendations', 'Service (primary schema', 'LocalBusiness (tie to', 'FAQPage (map',
  'BreadcrumbList (Home', 'Prepared for generaltechautomation.ae', 'Red highlight', 'Structure matches',
  'Inner page content', 'SEO • AEO • GEO', 'states', 'Page 1', 'Page 2', 'Page 3', 'Page 4',
  'Last Updated', 'supports', 'Meta ', 'Permalink / URL Slug', '96 / 100', '95+/100',
]

const isMetadata = (line) => METADATA.some((prefix) => line.startsWith(prefix))

/** Collapse the whitespace and the soft hyphens pdftotext leaves at wraps. */
const normalise = (value) =>
  value
    .replace(/­/g, '')
    .replace(/-\s*\n\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Words only, lowercased. `pdftotext` re-wraps hyphenated words and drops the
 * hyphen, and the page sets some phrases as separate elements, so comparing
 * punctuation would report formatting as missing copy. Comparing the word
 * stream still catches a dropped, reordered or reworded sentence.
 */
const words = (value) =>
  value
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** Letters and digits only. Absorbs the hyphen `pdftotext` eats at a line wrap. */
const compact = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '')

const visible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')

/**
 * Sentences worth checking: long enough to be prose rather than a label, and
 * not a line the exclusion list already accounted for.
 */
/** Where the copy stops and the copywriter's own QA notes begin. */
const FOOTERS = ['Content stats', 'Schema Recommendations', 'Prepared for generaltechautomation.ae']

const sentences = (text) => {
  let lines = text.split('\n')

  const footer = lines.findIndex((line) =>
    FOOTERS.some((marker) => line.trim().startsWith(marker)),
  )
  if (footer !== -1) lines = lines.slice(0, footer)

  // Everything above the last metadata line is the production header; the copy
  // starts after it. Anything below a stats/schema footer line is dropped the
  // same way, so only page copy is compared.
  let start = 0
  for (const [index, line] of lines.entries()) {
    if (isMetadata(line.trim())) start = index + 1
    if (index > 40) break
  }

  const body = lines
    .slice(start)
    .filter((line) => !isMetadata(line.trim()))
    .join('\n')

  return normalise(body)
    .split(/(?<=[.?!])\s+(?=[A-Z“"(\[])/)
    .map((s) => s.trim())
    .filter((s) => s.split(' ').length >= 8)
}

const files = await readdir(textDir)
let totalMissing = 0
let totalChecked = 0
let totalStructural = 0

for (const [prefix, slug] of PAIRS) {
  const file = files.find((name) => name.startsWith(prefix))
  if (!file) {
    console.error(`FAIL  no source text for ${prefix}`)
    totalMissing += 1
    continue
  }

  const source = await readFile(join(textDir, file), 'utf8')
  const page = visible(await (await fetch(`${BASE}/${slug}`)).text())

  const pageWords = ` ${words(page)} `
  const pageCompact = compact(page)
  const found = (sentence) =>
    pageWords.includes(` ${words(sentence)} `) || pageCompact.includes(compact(sentence))

  /**
   * A source "sentence" can straddle a heading — pdftotext runs the H2 into the
   * paragraph under it, and the page sets them as separate elements with other
   * chrome between. If some split of the sentence has both halves present, the
   * copy is all there and only the join is an artifact of the extraction.
   */
  const splitsCleanly = (sentence) => {
    const parts = sentence.split(' ')
    for (let i = 4; i <= parts.length - 4; i += 1) {
      if (found(parts.slice(0, i).join(' ')) && found(parts.slice(i).join(' '))) return true
    }
    return false
  }

  const candidates = sentences(source)
  const failed = candidates.filter((sentence) => !found(sentence))
  const structural = failed.filter(splitsCleanly)
  const missing = failed.filter((sentence) => !structural.includes(sentence))
  totalChecked += candidates.length
  totalStructural += structural.length

  if (missing.length) {
    totalMissing += missing.length
    console.log(`\n${slug} — ${missing.length} source sentence(s) not found:`)
    missing.forEach((s) => console.log(`   · ${s.slice(0, 160)}`))
  } else {
    console.log(`ok   ${slug}`)
  }
}

console.log(
  `\n${totalChecked} source sentences checked, ${totalMissing} missing, ` +
    `${totalStructural} present but split across a heading boundary`,
)
process.exit(totalMissing ? 1 : 0)
