import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The CMS renders no public pages of its own; Astro owns the frontend.
  // Only the admin panel and the REST/GraphQL API live here.
  images: {
    remotePatterns: [],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
