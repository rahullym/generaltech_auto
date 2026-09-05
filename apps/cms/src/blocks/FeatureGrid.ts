import type { Block } from 'payload'

import { linkField } from '../fields/link'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Feature Grid', plural: 'Feature Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'display',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel (scrolls left to right)', value: 'carousel' },
      ],
    },
    {
      name: 'columns',
      admin: { condition: (_, siblingData) => siblingData?.display !== 'carousel' },
      type: 'select',
      defaultValue: '3',
      options: [
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3' },
        { label: 'Four', value: '4' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'iconName',
          type: 'select',
          label: 'Icon',
          admin: { description: 'Line icon drawn by the frontend. Overrides an uploaded icon.' },
          options: [
            { label: 'Controller / PLC', value: 'cpu' },
            { label: 'Dashboard / SCADA', value: 'dashboard' },
            { label: 'Screen / HMI', value: 'screen' },
            { label: 'Network / DCS', value: 'network' },
            { label: 'Connected / IoT', value: 'signal' },
            { label: 'Cabinet / panel', value: 'cabinet' },
            { label: 'Machine / process', value: 'cog' },
            { label: 'Retrofit / maintenance', value: 'refresh' },
            { label: 'Shield / safety', value: 'shield' },
            { label: 'Gauge / measurement', value: 'gauge' },
          ],
        },
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        linkField({ required: false }),
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: {
        description:
          'Optional closing line under the cards — for a passage that qualifies the set rather than belonging to any one card.',
      },
    },
  ],
}
