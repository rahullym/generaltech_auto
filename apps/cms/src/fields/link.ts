import type { Field } from 'payload'

type LinkOptions = {
  /** Field name. Defaults to `link`. */
  name?: string
  /** When false, the link may be left empty entirely. Defaults to true. */
  required?: boolean
  /** Render an `appearance` select for button styling. */
  appearances?: boolean
}

/**
 * A link that is either internal (a relationship to a Page/Post/Doc, resolved
 * to a URL by the frontend) or an external URL. Reused by nav, CTAs and blocks.
 */
export const linkField = ({
  name = 'link',
  required = true,
  appearances = false,
}: LinkOptions = {}): Field => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'reference',
          options: [
            { label: 'Internal page', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        {
          name: 'label',
          type: 'text',
          required,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages', 'posts', 'docs'],
      required,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      type: 'text',
      required,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
    },
  ]

  if (appearances) {
    fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary button', value: 'primary' },
        { label: 'Secondary button', value: 'secondary' },
        { label: 'Text link', value: 'link' },
      ],
    })
  }

  return {
    name,
    type: 'group',
    fields,
  }
}
