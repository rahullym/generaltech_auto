/**
 * Snapshots the CMS into the repo so the site can be deployed on its own.
 *
 * The Astro app reads everything from Payload at request time. Until the CMS
 * and its database are hosted somewhere, a deployed site has nothing to read —
 * so this walks the API with the local CMS running, writes the responses to
 * `src/data/snapshot.json`, and copies every image the content references into
 * `public/cms/`. `lib/payload.ts` falls back to that file whenever the CMS
 * cannot be reached, which on Vercel is always.
 *
 * Run with the CMS up:  pnpm --filter web snapshot
 * Re-run after any content edit — the snapshot is a point in time, not a feed.
 */
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')
const mediaSource = resolve(webRoot, '../cms/media')
const mediaTarget = join(webRoot, 'public/cms')
const outFile = join(webRoot, 'src/data/snapshot.json')

const CMS = process.env.PAYLOAD_URL ?? 'http://localhost:3010'

/** Collections and globals in the shape `lib/payload.ts` asks for them. */
const COLLECTIONS = [
  { slug: 'pages', depth: 2, limit: 200 },
  { slug: 'posts', depth: 2, limit: 500 },
  { slug: 'docs', depth: 1, limit: 500 },
  { slug: 'categories', depth: 0, limit: 200 },
]
const GLOBALS = [
  { slug: 'header', depth: 2 },
  { slug: 'footer', depth: 2 },
  { slug: 'site-settings', depth: 1 },
]

const get = async (path) => {
  const res = await fetch(`${CMS}/api${path}`)
  if (!res.ok) throw new Error(`${res.status} from ${path} — is the CMS running on ${CMS}?`)
  return res.json()
}

/** Every media file the snapshot points at, by filename. */
const referenced = new Set()

/**
 * Rewrites absolute CMS media URLs to the copies served from `public/cms/`,
 * in place, anywhere they appear in the response.
 */
const rewrite = (node) => {
  if (Array.isArray(node)) return node.map(rewrite)
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) node[key] = rewrite(value)
    return node
  }
  if (typeof node === 'string' && node.startsWith(`${CMS}/api/media/file/`)) {
    const filename = decodeURIComponent(node.slice(`${CMS}/api/media/file/`.length))
    referenced.add(filename)
    return `/cms/${filename}`
  }
  return node
}

const snapshot = { generatedAt: new Date().toISOString(), collections: {}, globals: {} }

for (const { slug, depth, limit } of COLLECTIONS) {
  const result = await get(`/${slug}?depth=${depth}&limit=${limit}`)
  snapshot.collections[slug] = rewrite(result).docs ?? []
  console.log(`${slug}: ${snapshot.collections[slug].length} documents`)
}

for (const { slug, depth } of GLOBALS) {
  snapshot.globals[slug] = rewrite(await get(`/globals/${slug}?depth=${depth}`))
  console.log(`global ${slug}: ok`)
}

// Copy the referenced files. Uploads live on the CMS's disk; anything missing
// is reported rather than silently shipped as a broken image.
await mkdir(mediaTarget, { recursive: true })
const onDisk = new Set(await readdir(mediaSource).catch(() => []))
const missing = []

for (const filename of referenced) {
  if (!onDisk.has(filename)) {
    missing.push(filename)
    continue
  }
  await copyFile(join(mediaSource, filename), join(mediaTarget, filename))
}

await mkdir(dirname(outFile), { recursive: true })
await writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`)

console.log(`\ncopied ${referenced.size - missing.length} of ${referenced.size} images into public/cms`)
if (missing.length) console.warn(`missing from ${mediaSource}:\n  ${missing.join('\n  ')}`)
console.log(`wrote ${outFile}`)
