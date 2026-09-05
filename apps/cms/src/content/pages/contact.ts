/**
 * "Contact General Tech Automation UAE" — the approved Contact Us document,
 * word for word.
 *
 * The document marks two placeholders, `[Contact form]` and `[Map embed]`.
 * Those are the two things the contact block supplies; every sentence around
 * them is the document's.
 */
import { doc, paragraph } from '../lexical'
import { ADDRESS, EMAIL, MAILTO, PHONE, TEL, callAction, emailAction } from '../shared'
import type { MediaResolver, SeededPage } from '../shared'

// The office as Google Maps knows it. A P.O. box is not a place a map can
// point at, so the search is on the company in Sharjah.
const MAP_QUERY = 'General Tech Services LLC, Sharjah, United Arab Emirates'
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

export const contactPage = (media: MediaResolver): SeededPage => ({
  title: 'Contact General Tech Automation UAE',
  slug: 'contact_us',
  meta: {
    title: 'Contact General Tech Automation UAE | Sharjah',
    description:
      'Contact General Tech Automation UAE by phone, email, or the form below to request an automation service quote or ask a question. Response within one business day.',
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'centered',
      eyebrow: 'General Tech Automation · Sharjah, UAE',
      heading: 'Contact *General Tech Automation UAE*',
      image: media('digital-bg.jpg'),
      actions: [callAction(`Call ${PHONE}`), emailAction()],
    },

    {
      blockType: 'richText',
      layout: 'default',
      width: 'prose',
      lede: true,
      collapsible: false,
      content: doc(
        paragraph(
          'Contact General Tech Automation UAE by phone, email, or the form below to request an automation service quote or ask a question. Every enquiry is routed to the right department, with a response within one business day. The team is Sharjah-based and covers Dubai, Abu Dhabi, and the wider UAE for industrial automation enquiry needs.',
        ),
      ),
    },

    // --- Get In Touch / the form / the map --------------------------------------
    {
      blockType: 'contact',
      eyebrow: 'Get in touch',
      heading: 'Get In *Touch*',
      intro:
        "If you're looking to get in touch automation services UAE wide, our team of experienced professionals is ready to assess your requirements and provide a comprehensive quote tailored to your specific needs and budget. Reach out through any of the channels below for a free quote industrial automation UAE teams can act on, or just a quick question:",
      details: [
        {
          iconName: 'phone',
          label: 'Phone',
          value: PHONE,
          href: TEL,
          note: 'The fastest way to reach General Tech Automation directly, and our main General Tech Automation phone number for all enquiries',
        },
        { iconName: 'email', label: 'Email', value: EMAIL, href: MAILTO },
        { iconName: 'location', label: 'Address', value: ADDRESS },
        { iconName: 'clock', label: 'Business hours', value: 'Mon–Fri, 8:00 am – 5:30 pm' },
      ],
      footnote:
        "The same number and email cover the entire service area, so there's no separate line to look up no matter which emirate you're calling from — one call reaches the right people either way.",

      formHeading: 'Request a Quote *or Callback*',
      formIntro:
        "Complete the form with your requirement and it goes straight to the right representative. Use it to request automation service quote UAE pricing for a new project, or simply request a callback automation UAE if you'd rather talk it through first — just note your preference in the message field.",
      formNote:
        'Every automation service enquiry form UAE submission gets a reply within one business day.',

      mapHeading: 'Find *Us*',
      mapIntro:
        "Our General Tech Automation office Sharjah is shown on the map below, and it also serves as the base for site visits across the Emirates. If you'd rather stop by than call, this automation company location UAE address is the one to use.",
      mapEmbedUrl: MAP_EMBED,
      mapLinkUrl: MAP_LINK,
    },

    {
      blockType: 'cta',
      variant: 'dark',
      heading: 'Have a project in mind? *Get in touch today.*',
      actions: [
        callAction(`Call ${PHONE}`),
        { link: { type: 'custom', label: EMAIL, url: MAILTO, appearance: 'secondary' } },
      ],
    },
  ],
})
