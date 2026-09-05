import type { Block } from 'payload'

/**
 * The contact page: the ways to reach the company, the enquiry form, and the
 * office location, in one block. The approved copy introduces all three in a
 * single run, and splitting them into separate blocks would put a section
 * break between the phone number and the form that asks for it.
 *
 * The form posts to the Astro route at `/api/contact`; see that file for how a
 * submission is delivered.
 */
export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contact', plural: 'Contact' },
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
      name: 'details',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Detail', plural: 'Details' },
      fields: [
        {
          name: 'iconName',
          type: 'select',
          defaultValue: 'phone',
          options: [
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Address', value: 'location' },
            { label: 'Opening hours', value: 'clock' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Optional — a tel: or mailto: link for the value.' },
        },
        {
          name: 'note',
          type: 'textarea',
          admin: { description: 'Optional line under the value.' },
        },
      ],
    },
    { name: 'footnote', type: 'textarea' },

    {
      name: 'formHeading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.',
      },
    },
    { name: 'formIntro', type: 'textarea' },
    {
      name: 'formNote',
      type: 'textarea',
      admin: { description: 'Reassurance line under the submit button.' },
    },

    {
      name: 'mapHeading',
      type: 'text',
      admin: {
        description: 'Wrap the closing words in *asterisks* to set them in the red italic accent.',
      },
    },
    { name: 'mapIntro', type: 'textarea' },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      admin: { description: 'Google Maps embed URL. The map is only rendered when this is set.' },
    },
    {
      name: 'mapLinkUrl',
      type: 'text',
      admin: { description: 'Where the "open in Maps" link goes.' },
    },
  ],
}
