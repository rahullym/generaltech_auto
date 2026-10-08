/**
 * Serves the CMS under the website's own domain.
 *
 * The admin panel is a separate deployment, but editors should not have to
 * know that: `/admin` on the website is the admin panel, and the address bar
 * stays on the site's domain. Vercel can proxy a path to another origin from
 * the routing table, without a function in between, so this adds those routes
 * to the Build Output the Astro adapter has just written.
 *
 * Three prefixes belong to the CMS: `/admin` (the panel), `/api` (Payload's
 * REST and GraphQL API, which the panel calls) and `/_next` (the panel's own
 * scripts and styles). They go in ahead of Astro's catch-all and behind its
 * specific routes, so `/api/preview` and `/api/exit-preview` stay the
 * website's.
 *
 * Usage:  node scripts/proxy-cms.mjs <path to .vercel/output/config.json>
 */
import { readFile, writeFile } from 'node:fs/promises'

const file = process.argv[2]
const cms = (process.env.PAYLOAD_URL ?? '').replace(/\/+$/, '')

if (!/^https:\/\//.test(cms)) {
  console.log('proxy-cms: PAYLOAD_URL is not a hosted CMS, so /admin is not proxied')
  process.exit(0)
}

const config = JSON.parse(await readFile(file, 'utf8'))

const proxied = [
  { src: '^/admin/?$', dest: `${cms}/admin` },
  { src: '^/admin/(.*)$', dest: `${cms}/admin/$1` },
  { src: '^/_next/(.*)$', dest: `${cms}/_next/$1` },
  { src: '^/api/(.*)$', dest: `${cms}/api/$1` },
]

// The first route that would already answer `/admin` is Astro's catch-all.
const at = config.routes.findIndex((route) => route.src && new RegExp(route.src).test('/admin'))
if (at === -1) throw new Error('proxy-cms: no catch-all route found to go ahead of')

config.routes.splice(at, 0, ...proxied)
await writeFile(file, JSON.stringify(config, null, '\t'))
console.log(`proxy-cms: /admin, /api and /_next are served from ${cms}`)
