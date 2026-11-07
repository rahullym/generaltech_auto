import { withPayload } from '@payloadcms/next/withPayload'

// The admin panel is used through the website's domain, which proxies `/admin`
// and `/api` here — but its scripts and styles must not come that way. The
// website's Vercel project hosted this CMS before the split, and once those
// old deployments expired, Vercel began answering 410 Gone on that domain for
// every `/_next/static` path they had contained. Chunk names are content
// hashes, so most of each new build's chunks share a name with one of them,
// and the panel came up blank. Loading the assets straight from this
// deployment's own hostname keeps the website's history out of it.
//
// Set NEXT_PUBLIC_ASSET_URL to pick the host explicitly; otherwise production
// builds on Vercel use the project's production hostname, and everything else
// (local dev, previews) serves assets from its own origin as usual.
const assetURL =
  process.env.NEXT_PUBLIC_ASSET_URL ||
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(assetURL ? { assetPrefix: assetURL.replace(/\/+$/, '') } : {}),
  // The CMS renders no public pages of its own; Astro owns the frontend.
  // Only the admin panel and the REST/GraphQL API live here.
  images: {
    remotePatterns: [],
  },
  // Editors use the panel at the website's own address, which proxies here.
  // The Vercel hostname this project was first reachable at sends anyone who
  // still has it bookmarked to the same page there.
  async redirects() {
    const site = process.env.FRONTEND_URL
    if (!site) return []

    return ['/admin', '/admin/:path*'].map((source) => ({
      source,
      has: [{ type: 'host', value: 'generaltech-auto-admin.vercel.app' }],
      destination: `${site}${source}`,
      permanent: false,
    }))
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
