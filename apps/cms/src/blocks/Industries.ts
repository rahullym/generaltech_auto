import type { Block } from 'payload'

/**
 * "Industries we serve". The approved copy names six sectors in one long
 * paragraph, so each sector is stored as its own card instead — the frontend
 * runs them left to right as the reader scrolls, so a plant manager reaches
 * their own industry without reading the other five, and no wording is lost.
 */
export const Industries: Block = {
  slug: 'industries',
  interfaceName: 'IndustriesBlock',
  labels: { singular: 'Industries', plural: 'Industries' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Sits beside the heading — one or two sentences reads best.' },
    },
    {
      // The pinned track walks six short cards past the reader in one screen.
      // A roster that is longer than that, or whose entries carry a paragraph
      // each, does not fit a fixed-height card and reads better as a grid —
      // the same choice the logo wall offers between a grid and a marquee.
      name: 'display',
      type: 'select',
      defaultValue: 'track',
      options: [
        { label: 'Track (scrolls sideways as the page scrolls)', value: 'track' },
        { label: 'Grid (best for long rosters or long descriptions)', value: 'grid' },
      ],
    },
    {
      name: 'sectors',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Sector', plural: 'Sectors' },
      admin: { description: 'One card each. Six to eight sectors keep the track readable.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'iconName',
          type: 'select',
          defaultValue: 'factory',
          options: [
            { label: 'Oil and gas', value: 'oil' },
            { label: 'Water and wastewater', value: 'water' },
            { label: 'Food and beverage', value: 'beverage' },
            { label: 'Pharmaceuticals', value: 'pharma' },
            { label: 'Power and utilities', value: 'power' },
            { label: 'Manufacturing', value: 'factory' },
            { label: 'Chemicals', value: 'chemical' },
            { label: 'Logistics', value: 'logistics' },
            { label: 'Automotive', value: 'automotive' },
            { label: 'Construction', value: 'construction' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'What the work looks like in this sector — one or two sentences.' },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Optional closing line under the index.' },
    },
  ],
}
