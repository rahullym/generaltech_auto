import type { Block } from 'payload'

/**
 * The plant as a process drawing: shaded equipment, pipes coloured by medium,
 * and lettered measuring points on leader lines, with a key below.
 *
 * The words around the drawing and the key under it are ordinary fields. The
 * drawing itself is geometry — coordinates for every vessel, pipe run and
 * bubble — which no form lays out usefully, so it is held as one JSON document
 * in the shape `apps/web/src/components/blocks/Schematic.astro` draws.
 */
export const Schematic: Block = {
  slug: 'schematic',
  interfaceName: 'SchematicBlock',
  labels: { singular: 'Process Schematic', plural: 'Process Schematics' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.' },
    },
    { name: 'intro', type: 'textarea' },
    { name: 'title', type: 'text', label: 'Drawing title' },
    {
      name: 'key',
      type: 'array',
      label: 'Key',
      labels: { singular: 'Measuring point', plural: 'Measuring points' },
      admin: {
        description:
          'The list under the drawing. A bubble in the drawing points at an entry by its position here, counting from 1, so reordering this list means renumbering the bubbles.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'tag', type: 'text', required: true, admin: { width: '25%', description: 'F, T, P, L…' } },
            { name: 'sub', type: 'text', admin: { width: '25%' } },
            { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        { name: 'note', type: 'textarea' },
      ],
    },
    {
      name: 'drawing',
      type: 'json',
      required: true,
      admin: {
        description:
          'The geometry: width, height, equipment, lines, instruments, labels and mediaNames, in the drawing’s own units (1000 wide by default). Text inside the drawing — equipment and pipe labels — is edited here.',
      },
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
