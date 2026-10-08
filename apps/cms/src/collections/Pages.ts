import type { CollectionConfig } from 'payload'

import { editors, publishedOrAuthenticated } from '../access'
import {
  ApplicationIndex,
  CallToAction,
  ContactBlock,
  Coverage,
  Diagram,
  Faq,
  FeatureGrid,
  Hero,
  Industries,
  LogoWall,
  MediaBlock,
  ProcessSteps,
  RichTextBlock,
  Schematic,
  ServiceIndex,
  Stats,
  WhyUs,
} from '../blocks'
import { slugField } from '../fields/slug'
import { previewUrl } from '../lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'kind', '_status', 'updatedAt'],
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
    slugField('title', { nested: true }),
    {
      name: 'kind',
      type: 'select',
      label: 'Page type',
      defaultValue: 'page',
      index: true,
      options: [
        { label: 'Page', value: 'page' },
        { label: 'Service', value: 'service' },
        { label: 'Application example', value: 'application' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'A service publishes Service structured data and may redirect its old paths. An application example appears as a card on the Applications page.',
      },
    },
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
                ServiceIndex,
                ApplicationIndex,
                Diagram,
                Schematic,
                Industries,
                ProcessSteps,
                Stats,
                Coverage,
                LogoWall,
                WhyUs,
                CallToAction,
                ContactBlock,
                Faq,
              ],
            },
          ],
        },
        {
          name: 'service',
          label: 'Service',
          admin: { condition: (data) => data?.kind === 'service' },
          fields: [
            {
              name: 'order',
              type: 'number',
              admin: { description: 'Position among the services, lowest first.' },
            },
            {
              name: 'serviceType',
              type: 'text',
              admin: {
                description:
                  'What the service is, for search engines — e.g. "CNC machine repair". Defaults to the page title.',
              },
            },
            {
              name: 'aliases',
              type: 'array',
              label: 'Old paths',
              labels: { singular: 'Old path', plural: 'Old paths' },
              admin: {
                description:
                  'Paths this page used to live at, without the leading slash. Each one redirects here permanently.',
              },
              fields: [{ name: 'path', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'application',
          label: 'Card',
          admin: { condition: (data) => data?.kind === 'application' },
          fields: [
            {
              name: 'order',
              type: 'number',
              admin: { description: 'Position on the Applications grid, lowest first.' },
            },
            {
              name: 'cardTitle',
              type: 'text',
              admin: { description: 'The card heading. Defaults to the page title, which is written for search and is longer.' },
            },
            {
              name: 'cardBlurb',
              type: 'textarea',
              admin: { description: 'The line under the card heading: the problem, in a visitor’s words.' },
            },
            { name: 'cardImage', type: 'upload', relationTo: 'media' },
            {
              name: 'sectors',
              type: 'array',
              labels: { singular: 'Sector', plural: 'Sectors' },
              admin: { description: 'The chips under the card.' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
