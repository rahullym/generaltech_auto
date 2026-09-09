import type { Block } from 'payload'

/**
 * The application example grid.
 *
 * Deliberately thin: this block says where the grid goes and what introduces
 * it, and nothing else. The examples themselves are content files in the
 * website repo (`apps/web/src/content/applications/*.json`), each expanding
 * into a full page, and the grid draws whatever is there.
 *
 * Restating them here as an array of links — the way the service index does —
 * would mean every new example had to be written twice and kept in step, and a
 * card would go stale the moment its page was retitled. There is one list, and
 * the page a card opens is the thing the card is made from.
 */
export const ApplicationIndex: Block = {
  slug: 'applicationIndex',
  interfaceName: 'ApplicationIndexBlock',
  labels: { singular: 'Application Index', plural: 'Application Indexes' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description:
          'Introduces the grid of application examples. The examples are not listed here — they are content files in the website repo, and every one of them appears in the grid automatically.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.',
      },
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Small print under the grid.' },
    },
  ],
}
