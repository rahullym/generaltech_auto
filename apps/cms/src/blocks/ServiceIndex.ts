import type { Block } from 'payload'

import { linkField } from '../fields/link'

/**
 * The services page groups its offer into four families — repair, control,
 * instrumentation, panels — each introduced by a paragraph and then listed as
 * a run of named services. A feature grid can hold the paragraphs or the
 * names, but not both without either dropping copy or repeating the same card
 * four times over, so the two live together here: the family's approved
 * paragraph stays intact and the services under it become a linked index the
 * reader can scan.
 */
export const ServiceIndex: Block = {
  slug: 'serviceIndex',
  interfaceName: 'ServiceIndexBlock',
  labels: { singular: 'Service Index', plural: 'Service Indexes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.',
      },
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'groups',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Group', plural: 'Groups' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'iconName',
          type: 'select',
          defaultValue: 'cog',
          options: [
            { label: 'Retrofit / maintenance', value: 'refresh' },
            { label: 'Controller / PLC', value: 'cpu' },
            { label: 'Gauge / measurement', value: 'gauge' },
            { label: 'Cabinet / panel', value: 'cabinet' },
            { label: 'Machine / process', value: 'cog' },
            { label: 'Network / DCS', value: 'network' },
            { label: 'Connected / IoT', value: 'signal' },
            { label: 'Shield / safety', value: 'shield' },
          ],
        },
        {
          name: 'services',
          type: 'array',
          minRows: 1,
          required: true,
          labels: { singular: 'Service', plural: 'Services' },
          fields: [linkField()],
        },
      ],
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
