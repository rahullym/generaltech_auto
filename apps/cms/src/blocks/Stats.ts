import type { Block } from 'payload'

/**
 * A strip of hard figures — "Est. 1998", "28+ Years Combined Experience",
 * "Sharjah HQ". The approved page copy sets these as one row of three under
 * the opening paragraph, so they are stored as their own rows rather than as
 * a sentence: the frontend can then give the figure the display scale it has
 * on the home page's proof strip without a word being rewritten.
 *
 * Each row is split into the figure and the words that qualify it, in the
 * order they are written — "28+" / "Years Combined Experience" — so nothing is
 * added, removed or reordered.
 */
export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats', plural: 'Stats' },
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
      name: 'tone',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light (grey band)', value: 'light' },
        { label: 'Dark (full-bleed black band)', value: 'dark' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      maxRows: 4,
      labels: { singular: 'Figure', plural: 'Figures' },
      admin: {
        description:
          'Keep the value to a few characters — "1998", "28+", "60+". The label carries the rest of the phrase.',
      },
      fields: [
        {
          name: 'lead',
          type: 'text',
          admin: {
            description:
              'Optional word or two that reads before the figure — "Est." in "Est. 1998". Set above it so the phrase reads in its written order.',
          },
        },
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text' },
      ],
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
