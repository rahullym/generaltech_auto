import type { Block } from 'payload'

/**
 * A numbered, rail-connected sequence of stages — the "how we work" section.
 * Kept separate from a rich-text ordered list so the frontend can draw the
 * timeline, track progress on scroll, and keep the stages scannable.
 */
export const ProcessSteps: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  labels: { singular: 'Process Steps', plural: 'Process Steps' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.' },
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'meta',
          type: 'text',
          label: 'Stage note',
          admin: { description: 'Optional short line above the title — e.g. "On-site" or "1–2 days".' },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Optional line under the stages, for a caveat or a handover promise.' },
    },
  ],
}
