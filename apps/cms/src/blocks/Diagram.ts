import type { Block } from 'payload'

import { diagramIcon } from '../fields/diagramIcon'

/**
 * A picture of the arrangement rather than a photograph of a plant.
 *
 * `chain` draws the signal or control path as a run of labelled stages — what
 * measures, what it is wired to, where the reading ends up — with the protocol
 * on each connector. `groups` draws a retrofit instead: what is replaced beside
 * what is kept.
 */
export const Diagram: Block = {
  slug: 'diagram',
  interfaceName: 'DiagramBlock',
  labels: { singular: 'Diagram', plural: 'Diagrams' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'chain',
      options: [
        { label: 'Chain (signal path, stage by stage)', value: 'chain' },
        { label: 'Groups (replaced beside kept)', value: 'groups' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.' },
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'nodes',
      type: 'array',
      labels: { singular: 'Stage', plural: 'Stages' },
      admin: { condition: (_, siblingData) => siblingData?.variant !== 'groups' },
      fields: [
        diagramIcon(),
        { name: 'title', type: 'text', required: true },
        { name: 'note', type: 'textarea' },
        {
          name: 'via',
          type: 'text',
          label: 'Connector label',
          admin: { description: 'Written on the connector into this stage — e.g. "4–20 mA" or "Modbus RTU".' },
        },
      ],
    },
    {
      name: 'groups',
      type: 'array',
      labels: { singular: 'Group', plural: 'Groups' },
      admin: { condition: (_, siblingData) => siblingData?.variant === 'groups' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'note', type: 'textarea' },
        {
          name: 'tone',
          type: 'select',
          options: [
            { label: 'Accent (red)', value: 'accent' },
            { label: 'Neutral', value: 'neutral' },
          ],
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            diagramIcon(),
            { name: 'title', type: 'text', required: true },
            { name: 'note', type: 'textarea' },
          ],
        },
      ],
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
