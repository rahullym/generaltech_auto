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
