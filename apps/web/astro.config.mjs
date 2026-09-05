// @ts-check
import node from '@astrojs/node'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

export default defineConfig({
  // Canonical origin. Everything that has to name the site absolutely — the
  // canonical link, og:url, robots.txt, the sitemap — is built from this, so
  // getting it wrong is not cosmetic: production was publishing
  // `<link rel="canonical" href="http://localhost:4331/…">` on every page,
  // because PUBLIC_SITE_URL is not set on the host and the localhost default
  // was taking its place. Vercel exposes the project's production hostname at
  // build time, so the deployed site names itself correctly whether or not the
  // variable is set. Set PUBLIC_SITE_URL to override — that is what to use once
  // the real domain points here.
  site:
    process.env.PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:4331'),

  // SSR: content is read from Payload on each request, so edits go live
  // immediately. Individual routes can still opt into `prerender = true`.
  output: 'server',

  // Vercel sets VERCEL=1 in its build container. Everywhere else — local
  // `pnpm start`, Docker, a plain VPS — the standalone Node server is what
  // runs, so the adapter is chosen rather than swapped.
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),

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
      // Where a contact-form submission is delivered. Anything that accepts a
      // JSON POST works; with this unset the form falls back to composing the
      // enquiry in the sender's own mail client. See pages/api/contact.ts.
      CONTACT_WEBHOOK_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
