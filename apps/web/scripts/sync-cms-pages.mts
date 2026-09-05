/**
 * Renders the approved page modules into the committed snapshot.
 *
 * `apps/cms/src/content/pages/*` is the source of truth for About Us,
 * Products, Brands, Services, Applications and Contact Us. Normally
 * `pnpm --filter cms seed:pages` loads them into Payload and
 * `pnpm --filter web snapshot` reads them back out — but that round trip needs
 * the CMS and its database running. The modules are pure data, so this renders
 * them straight into `src/data/snapshot.json` instead, leaving one source of
 * truth and no database to stand up for a copy or layout change.
 *
 * Media is resolved against the media objects already in the snapshot: the
 * blocks are stored depth-2, so a page carries the whole upload record rather
 * than the id Payload would hand back.
 *
 * Run with:  pnpm --filter web sync:pages
 */
import { readFile, writeFile } from 'node:fs/promises'

import { aboutPage } from '../../cms/src/content/pages/about'
import { applicationsPage } from '../../cms/src/content/pages/applications'
import { brandsPage } from '../../cms/src/content/pages/brands'
import { contactPage } from '../../cms/src/content/pages/contact'
import { productsPage } from '../../cms/src/content/pages/products'
import { servicesPage } from '../../cms/src/content/pages/services'

const SNAPSHOT = new URL('../src/data/snapshot.json', import.meta.url)

type Doc = Record<string, any>

const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8')) as {
  collections: Record<string, Doc[]>
  [key: string]: unknown
}

/** Every upload the snapshot already carries, indexed by filename. */
const uploads = new Map<string, Doc>()

const collect = (node: unknown): void => {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) return node.forEach(collect)

  const record = node as Doc
  if (typeof record.filename === 'string' && typeof record.url === 'string') {
    if (!uploads.has(record.filename)) uploads.set(record.filename, record)
  }
  Object.values(record).forEach(collect)
}

collect(snapshot)

const missing = new Set<string>()

const media = (filename: string): Doc | undefined => {
  const upload = uploads.get(filename)
  if (!upload) missing.add(filename)
  return upload
}

/**
 * The Brands page shows the marks the home page already carries, in the same
 * order, rather than a second roster that could drift out of step with it —
 * the same rule `seed-pages.ts` follows.
 */
const home = (snapshot.collections.pages ?? []).find((doc) => doc.slug === 'home')
const wall = (home?.layout ?? []).find((block: Doc) => block.blockType === 'logoWall')
const logos = (wall?.logos ?? []).map((logo: Doc) => ({ image: logo.image, name: logo.name }))

if (!logos.length) {
  console.error('no logo wall on the home page — refusing to publish Brands without the roster')
  process.exit(1)
}

const pages = [
  aboutPage(media as never),
  productsPage(media as never),
  brandsPage(media as never, logos),
  servicesPage(media as never),
  applicationsPage(media as never),
  contactPage(media as never),
]

const existing = snapshot.collections.pages ?? []
const now = new Date().toISOString()

for (const page of pages) {
  const index = existing.findIndex((doc) => doc.slug === page.slug)
  if (index === -1) {
    console.error(`no page with slug "${page.slug}" in the snapshot — refusing to invent one`)
    process.exit(1)
  }

  // Keep the identity and timestamps the snapshot already recorded; replace
  // only what the module owns.
  existing[index] = {
    ...existing[index],
    title: page.title,
    meta: { ...(existing[index].meta ?? {}), ...page.meta },
    layout: page.layout,
    updatedAt: now,
  }
  console.log(`updated /${page.slug} — ${page.layout.length} blocks`)
}

await writeFile(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`)

if (missing.size) {
  console.warn(`\nnot in the snapshot, rendered without imagery:\n  ${[...missing].join('\n  ')}`)
}
console.log(`\nwrote ${SNAPSHOT.pathname}`)
