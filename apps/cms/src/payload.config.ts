import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories, Docs, Media, Pages, Posts, Users } from './collections'
import { Footer, Header, SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Vercel exposes the project's production hostname at build time, so the
// deployed CMS names itself correctly whether or not the variable is set. Set
// NEXT_PUBLIC_SERVER_URL to override — that is what to use once a real domain
// points here.
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3010')
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:4331'

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '- General Tech Automation',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  collections: [Pages, Posts, Categories, Docs, Media, Users],
  globals: [Header, Footer, SiteSettings],

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      HorizontalRuleFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [{ name: 'caption', type: 'text' }],
          },
        },
      }),
      LinkFeature({
        enabledCollections: ['pages', 'posts', 'docs'],
      }),
      BlocksFeature({
        blocks: [],
      }),
    ],
  }),

  db: postgresAdapter({
    pool: {
      // Vercel's Neon integration names the pooled connection DATABASE_URL.
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL,
    },
    push: process.env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  // Astro fetches from a different origin, so it must be allow-listed.
  cors: [frontendURL, serverURL].filter(Boolean),
  csrf: [frontendURL, serverURL].filter(Boolean),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, '../generated-schema.graphql'),
  },

  plugins: [
    // Uploads go to Vercel Blob wherever a store is connected, because a
    // serverless filesystem does not keep them. Without the token — local
    // development — they stay on disk in `media/`.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Media is public, so the site links straight to the store's CDN rather
      // than through this app.
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    seoPlugin({
      collections: ['pages', 'posts', 'docs'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title} | General Tech Automation`,
      generateDescription: ({ doc }) => doc?.excerpt || doc?.description || '',
      generateURL: ({ doc }) => `${frontendURL}/${doc?.slug ?? ''}`,
      tabbedUI: true,
    }),
  ],

  sharp,
})
