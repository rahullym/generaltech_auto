import type { CollectionConfig } from 'payload'

import { editors, publishedOrAuthenticated } from '../access'
import {
  CallToAction,
  Coverage,
  Faq,
  FeatureGrid,
  Hero,
  Industries,
  LogoWall,
  MediaBlock,
  ProcessSteps,
  RichTextBlock,
  WhyUs,
} from '../blocks'
import { slugField } from '../fields/slug'
import { previewUrl } from '../lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    livePreview: { url: ({ data }) => previewUrl('pages', data?.slug) },
    preview: (doc) => previewUrl('pages', doc?.slug as string),
  },
  access: {
    read: publishedOrAuthenticated,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: {
    drafts: { autosave: { interval: 400 } },
    maxPerDoc: 50,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [
                Hero,
                RichTextBlock,
                MediaBlock,
                FeatureGrid,
                Industries,
                ProcessSteps,
                Coverage,
                LogoWall,
                WhyUs,
                CallToAction,
                Faq,
              ],
            },
          ],
        },
      ],
    },
  ],
}
