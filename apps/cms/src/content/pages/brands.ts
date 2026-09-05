/**
 * "Brands" — the approved Brands document, word for word.
 *
 * Its four component-category sections each carry one paragraph naming the
 * marks in that category, so each becomes a card holding that paragraph
 * unaltered. The marks themselves are already on the site as the home page's
 * partner roster, so the same wall is shown here rather than described.
 */
import { doc, paragraph } from '../lexical'
import { EMAIL, MAILTO, PHONE, callAction, emailAction } from '../shared'
import type { MediaResolver, SeededPage } from '../shared'

export const brandsPage = (media: MediaResolver, logos: { image: number }[]): SeededPage => ({
  title: 'Brands',
  slug: 'brands',
  meta: {
    title: 'Industrial Automation Brands We Service in UAE | General Tech Automation',
    description:
      'Industrial automation brands we service in UAE across drives, control panels, sensors, and safety systems — repair, parts and integration from our Sharjah facility.',
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'centered',
      eyebrow: 'General Tech Automation · Sharjah, UAE',
      heading: 'Brands',
      subheading: 'Industrial Automation Brands We Service in UAE',
      image: media('DeltaV.jpg'),
      actions: [callAction(`Call ${PHONE}`), emailAction()],
    },

    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      lede: true,
      collapsible: false,
      media: [{ image: media('panel-inspection.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'General Tech Automation covers industrial automation brands we service in UAE across drives, control panels, sensors, and safety systems, repairing, supplying parts for, and integrating equipment from over 60 manufacturers out of our Sharjah facility.',
        ),
      ),
    },

    {
      blockType: 'stats',
      tone: 'light',
      items: [
        { value: '60+', label: 'Brands Serviced' },
        { value: '5', label: 'Component Categories' },
        { value: 'Sharjah', label: 'Stockholding' },
      ],
    },

    // --- Multi-brand support ------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'right',
      heading: 'Multi-Brand Support, *Not a Single-Brand Lock-In*',
      numbered: true,
      collapsible: false,
      media: [{ image: media('operator-control-panel.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "Working with a provider that covers this many industrial automation brands we service in UAE means a plant doesn't need a different vendor for every drive, sensor, or PLC on the floor.",
        ),
        paragraph(
          "We service, repair, and supply parts across the brands below rather than positioning ourselves as the exclusive authorized distributor for any single one. For equipment still under a manufacturer's own warranty or authorized network, we'll say so and point you there directly rather than take on work that belongs elsewhere.",
        ),
      ),
    },

    // --- The four component categories --------------------------------------
    // No umbrella heading: the document gives these four categories four
    // headings of their own and none above them, so the cards carry theirs and
    // nothing is written to sit over the set.
    {
      blockType: 'featureGrid',
      display: 'grid',
      columns: '2',
      features: [
        {
          iconName: 'cog',
          title: 'Drives, Motors & Motion Control',
          description:
            'Our repair and parts work covers drive and motion control brands including Siemens automation repair UAE, Control Techniques drive repair UAE, and multi-brand automation repair UAE more broadly for AC/DC drives, inverters, and servo systems from these and comparable manufacturers.',
        },
        {
          iconName: 'cabinet',
          title: 'Control Panels & Wiring Components',
          description:
            'For panel builds and retrofits, our work spans WAGO components supplier UAE, Phoenix Contact parts UAE, and Weidmuller panel components UAE for terminal blocks, relays, and wiring systems, alongside Rittal enclosures UAE for panel housings and climate control.',
        },
        {
          iconName: 'gauge',
          title: 'Sensors & Process Instrumentation',
          description:
            'Field-level monitoring and process measurement work draws on IFM sensors UAE, VEGA level measurement UAE, and WIKA instrumentation UAE for pressure and temperature, plus Leuze sensors UAE for photoelectric and safety sensing, and Datalogic and Microsonic components for detection and distance sensing.',
        },
        {
          iconName: 'shield',
          title: 'Safety, Signaling & Connectivity',
          description:
            'Rounding out the industrial automation brands we service in UAE, we support Pilz safety systems UAE for machine safety circuits, Harting connectors UAE for industrial connectivity, and Patlite for visual and audible signaling across plant floors.',
        },
      ],
    },

    // --- The marks themselves ------------------------------------------------
    // The same roster the home page carries, shown as scrolling bands: sixty
    // marks in a grid runs to eleven near-empty rows.
    {
      blockType: 'logoWall',
      heading: 'Industrial Automation Brands We *Service in UAE*',
      layout: 'marquee',
      logos,
    },

    // --- Genuine parts --------------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      heading: 'Genuine Parts Supplier, *Backed by Repair Expertise*',
      numbered: true,
      collapsible: false,
      media: [{ image: media('board-repair.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'As a genuine brand parts supplier UAE, every component we supply or fit during a repair is sourced through established supplier relationships and tested before it reaches a client, whether the job is a straightforward part swap or a full panel rebuild.',
        ),
        paragraph(
          "This range of industrial automation brands we service in UAE is what lets General Tech Automation take on mixed-brand plants without turning away equipment because it falls outside a single manufacturer's line, and it's a big part of why repeat clients bring us their whole panel rather than one drive at a time.",
        ),
      ),
    },

    // --- Why we don't chase every authorization -------------------------------
    {
      blockType: 'richText',
      layout: 'split',
      eyebrow: 'Straight about status',
      heading: "Why We Don't Chase *Every Authorization*",
      numbered: true,
      collapsible: false,
      content: doc(
        paragraph(
          "A number of these manufacturers already have official authorized distributors or service centers in the UAE, including some of the calibration and measurement instrument brands in our list. Where that's the case, we're upfront about it rather than implying a status we don't hold.",
        ),
        paragraph(
          "Our value on the industrial automation brands we service in UAE side is different: independent, multi-brand repair and parts sourcing for plants that don't want to manage a separate authorized-service relationship for every nameplate on their equipment.",
        ),
      ),
    },

    // --- Where we support them -------------------------------------------------
    {
      blockType: 'coverage',
      eyebrow: 'Where we work',
      heading: 'Where We Support *These Brands*',
      // Light: the section above it and the closing ask below are both black,
      // and three dark bands in a row read as one.
      tone: 'light',
      areas: [
        { name: 'Sharjah' },
        { name: 'Dubai' },
        { name: 'Abu Dhabi' },
        { name: 'Wider GCC' },
      ],
      content: doc(
        paragraph(
          "Based in Sharjah, we cover these industrial automation brands we service in UAE for clients across Dubai, Abu Dhabi, and the wider GCC, with parts stock held locally so most standard components don't wait on a manufacturer's own lead time.",
        ),
      ),
    },

    {
      blockType: 'cta',
      variant: 'dark',
      heading: 'Get Support Across the Brands *Running Your Plant*',
      body: "If your plant runs equipment from any of these brands — or one we haven't listed — General Tech Automation's Sharjah team can advise on repair, parts, or integration.",
      actions: [
        callAction(`Call ${PHONE}`),
        { link: { type: 'custom', label: EMAIL, url: MAILTO, appearance: 'secondary' } },
      ],
    },
  ],
})
