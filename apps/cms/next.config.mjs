import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
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
