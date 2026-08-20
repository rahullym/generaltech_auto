// @ts-check
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4331',

  // SSR: content is read from Payload on each request, so edits go live
  // immediately. Individual routes can still opt into `prerender = true`.
  output: 'server',

  // Vercel sets VERCEL=1 in its build container. Everywhere else — local
  // `pnpm start`, Docker, a plain VPS — the standalone Node server is what
  // runs, so the adapter is chosen rather than swapped.
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),

  integrations: [sitemap()],

  env: {
    schema: {
      PAYLOAD_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:3010',
      }),
      PAYLOAD_PREVIEW_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      PAYLOAD_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      PUBLIC_SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://localhost:4331',
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
