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
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories, Docs, Media, Pages, Posts, Users } from './collections'
import { Footer, Header, SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3010'
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
      connectionString: process.env.DATABASE_URI,
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
