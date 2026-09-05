/**
 * Content check for the service inner pages.
 *
 * Every authored string — paragraph, heading, feature description, FAQ answer,
 * CTA body — is fetched back off the rendered page and matched character for
 * character. A page that drops, reorders or re-words a sentence fails here
 * rather than in review.
 *
 * Usage:  node scripts/verify-services.mjs [baseUrl]
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://localhost:4399'
const DIR = new URL('../src/content/services/', import.meta.url).pathname

/** Every string on the page that must survive to the rendered HTML. */
const strings = (service) => {
  const out = []
  const push = (value) => {
    if (typeof value === 'string' && value.trim()) out.push(value.trim())
  }

  for (const block of service.layout) {
    switch (block.type) {
      case 'hero':
        push(block.subheading)
        break
      case 'prose':
        block.body.forEach(push)
        break
      case 'features':
        push(block.intro)
        block.items.forEach((item) => {
          push(item.title)
          push(item.description)
        })
        break
      case 'process':
        push(block.intro)
        push(block.footnote)
        block.steps.forEach((step) => {
          push(step.meta)
          push(step.title)
          push(step.description)
        })
        break
      case 'why':
        push(block.intro)
        push(block.footnote)
        ;(block.proofs ?? []).forEach((proof) => push(proof.label))
        block.pillars.forEach((pillar) => {
          push(pillar.title)
          push(pillar.body)
        })
        break
      case 'industries':
        push(block.intro)
        push(block.footnote)
        block.sectors.forEach((sector) => {
          push(sector.name)
          push(sector.description)
        })
        break
      case 'coverage':
        push(block.note)
        block.areas.forEach((area) => {
          push(area.name)
          push(area.note)
        })
        ;(block.body ?? []).forEach(push)
        break
      case 'faq':
        push(block.intro)
        block.items.forEach((item) => {
          push(item.q)
          item.a.forEach(push)
        })
        break
      case 'cta':
        push(block.body)
        break
    }
  }

  // Headings carry an `*accent*` marker that the renderer strips; compare the
  // words rather than the marker.
  for (const block of service.layout) {
    if (block.heading) out.push(block.heading.replace(/\*/g, ''))
  }

  return out
}

/** Rendered HTML down to the visible text, with entities resolved. */
const visible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

/** Bold markers are formatting, not text; whitespace runs collapse in HTML. */
const normalise = (value) => value.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()

const files = (await readdir(DIR)).filter((name) => name.endsWith('.json')).sort()
let failures = 0
let checked = 0

for (const file of files) {
  const service = JSON.parse(await readFile(join(DIR, file), 'utf8'))
  const url = `${BASE}/${service.slug}`
  const response = await fetch(url)

  if (!response.ok) {
    console.error(`FAIL ${service.slug} — HTTP ${response.status}`)
    failures += 1
    continue
  }

  const text = visible(await response.text())
  const missing = strings(service)
    .map(normalise)
    .filter((value) => !text.includes(value))

  checked += 1
  if (missing.length) {
    failures += 1
    console.error(`FAIL ${service.slug} — ${missing.length} string(s) missing:`)
    for (const value of missing.slice(0, 6)) console.error(`   · ${value.slice(0, 120)}…`)
  } else {
    console.log(`ok   ${service.slug}`)
  }
}

console.log(`\n${checked}/${files.length} pages reachable, ${failures} failing`)
process.exit(failures ? 1 : 0)
