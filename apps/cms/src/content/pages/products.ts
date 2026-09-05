/**
 * "Products" — the approved Products document, word for word.
 *
 * The document's "What We Supply" passage names five categories in five
 * sentences and then says so ("organized across five main categories"), so the
 * passage becomes five cards, each carrying its own sentence unaltered and
 * titled with the category name that sentence opens on.
 */
import { doc, link, paragraph } from '../lexical'
import { EMAIL, MAILTO, PHONE, callAction, emailAction } from '../shared'
import type { MediaResolver, SeededPage } from '../shared'

export const productsPage = (media: MediaResolver): SeededPage => ({
  title: 'Products',
  slug: 'products',
  meta: {
    title: 'Industrial Automation Spare Parts Supplier in UAE | General Tech Automation',
    description:
      'General Tech Automation is an industrial automation spare parts supplier in UAE, stocking drives, servo motors, PLC and HMI components, and control panel parts in Sharjah.',
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'centered',
      eyebrow: 'General Tech Automation · Sharjah, UAE',
      heading: 'Products',
      subheading: 'Industrial Automation Spare Parts Supplier in UAE',
      image: media('automation-machine.jpg'),
      actions: [callAction(`Call ${PHONE}`), emailAction()],
    },

    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      lede: true,
      collapsible: false,
      media: [{ image: media('board-repair.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'General Tech Automation is an industrial automation spare parts supplier in UAE, stocking drives, servo motors, PLC and HMI components, and control panel parts in Sharjah for same-day dispatch to plants across the UAE and GCC.',
        ),
      ),
    },

    {
      blockType: 'stats',
      tone: 'light',
      items: [
        { value: '1998', label: 'Parent Est.' },
        { value: '28+', label: 'Years Combined Experience' },
        { value: 'Sharjah', label: 'Stockholding' },
      ],
    },

    // --- Genuine Stock ------------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'right',
      heading: 'Genuine Stock, Sourced to *Match Your Equipment*',
      collapsible: false,
      media: [{ image: media('operator-control-panel.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "As an industrial automation spare parts supplier in UAE, our catalog covers genuine OEM automation parts across the categories below, held in Sharjah so most standard requests don't wait on an overseas order.",
        ),
        paragraph(
          'When a part is obsolete or hard to source, our Repair Services team can often supply a tested surplus or refurbished replacement as part of a repair job rather than as a separate purchase — see ',
          link('Repair Services', '/service/repair-services'),
          " for that path if you're sending equipment in rather than buying a standalone part.",
        ),
      ),
    },

    // --- What We Supply -----------------------------------------------------
    {
      blockType: 'featureGrid',
      heading: 'What We *Supply*',
      intro:
        'As an industrial automation spare parts supplier in UAE, our Repair Services and Automation Solutions teams draw on the same inventory we make available to clients directly, organized across five main categories.',
      display: 'grid',
      columns: '3',
      features: [
        {
          iconName: 'refresh',
          title: 'VFD spare parts UAE',
          description:
            'VFD spare parts UAE and drive replacement parts cover AC and DC drives, inverters, and soft starters.',
        },
        {
          iconName: 'cog',
          title: 'Servo motor spare parts UAE',
          description:
            'Servo motor spare parts UAE and servo drive components include amplifiers and feedback devices for motion control systems.',
        },
        {
          iconName: 'cpu',
          title: 'PLC modules and spares UAE',
          description:
            'PLC modules and spares UAE span major platforms, alongside HMI panel components UAE for operator interfaces and displays.',
        },
        {
          iconName: 'cabinet',
          title: 'Control panel components',
          description:
            'Control panel components and panel wiring and control components support new builds and retrofits.',
        },
        {
          iconName: 'signal',
          title: 'Automation sensors and switches UAE',
          description:
            'Automation sensors and switches UAE round out our range for field-level monitoring and control.',
        },
      ],
      footnote:
        "If a part isn't on the shelf, our sourcing network typically brings it in faster than an end user going direct to the manufacturer, since we already hold established supplier relationships across these categories. It's this range that lets one automation spare parts supplier in UAE cover a plant's drive, motion control, and control panel needs without juggling separate vendors for each category.",
    },

    // --- Genuine Parts, Factory-Backed Repair -------------------------------
    {
      blockType: 'richText',
      layout: 'split',
      eyebrow: 'Parts and repair, one standard',
      heading: 'Genuine Parts, *Factory-Backed Repair*',
      numbered: true,
      collapsible: false,
      media: [{ image: media('board-repair.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "Our repair team's factory-backed drive credentials (see ",
          link('About Us', '/about_us'),
          ' for details) carry over into the parts side of the business — each component is tested before it leaves our Sharjah facility, not just boxed and shipped.',
        ),
        paragraph(
          'As an automation spare parts supplier in GCC markets, we back our parts with the same service guarantee that covers our repair work, so a replacement component and a repaired unit carry the same standard of documentation and traceability.',
        ),
      ),
    },

    // --- Industrial Control Components for Every Plant Type -----------------
    {
      blockType: 'industries',
      eyebrow: 'Who we supply',
      heading: 'Industrial Control Components for *Every Plant Type*',
      // Each sector carries a full sentence or two here, which a fixed-height
      // track card cuts off — so these lay out as a grid instead.
      display: 'grid',
      intro:
        'Our client base spans industries where a single failed component can stop a production line.',
      sectors: [
        {
          name: 'Oil & Gas',
          iconName: 'oil',
          description:
            'Oil & Gas facilities come to us for factory authorized spare parts UAE supporting field instrumentation.',
        },
        {
          name: 'Manufacturing',
          iconName: 'factory',
          description:
            'Manufacturers turn to this industrial automation spare parts supplier in UAE for PLC modules and servo drive components on line upgrades and retrofits.',
        },
        {
          name: 'Life Sciences and Chemical Plants',
          iconName: 'pharma',
          description:
            "Life sciences and chemical plants require documented, traceable parts for regulated equipment where an unverified substitute isn't an option.",
        },
      ],
    },

    // --- Where We Supply ----------------------------------------------------
    {
      blockType: 'coverage',
      eyebrow: 'Where we supply',
      heading: 'Where We *Supply*',
      tone: 'dark',
      areas: [
        { name: 'Sharjah' },
        { name: 'Dubai' },
        { name: 'Abu Dhabi' },
        { name: 'Wider GCC' },
      ],
      content: doc(
        paragraph(
          'Based in Sharjah, this industrial automation spare parts supplier in UAE serves industrial control components Sharjah clients directly, along with businesses across Dubai, Abu Dhabi, and the wider GCC, with stock held locally rather than shipped in on order each time, so most standard parts move same-day once a request comes in.',
        ),
      ),
    },

    // --- Why work with us ---------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      heading: 'Why Work With This *Industrial Automation Spare Parts Supplier in UAE*',
      mediaPosition: 'right',
      lede: true,
      collapsible: false,
      media: [{ image: media('7_1.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'Sourcing parts and repairing equipment from the same company means one point of contact when something fails, one warranty standard across new and repaired components, and a Sharjah-based team that already knows your equipment history from prior repair jobs.',
        ),
      ),
    },

    {
      blockType: 'cta',
      variant: 'dark',
      heading: 'Source Automation Parts From a Supplier *That Also Repairs Them*',
      body: "If you need a drive, servo motor, PLC module, or control panel component sourced quickly, General Tech Automation's Sharjah stock and repair team can help.",
      actions: [
        callAction(`Call ${PHONE}`),
        { link: { type: 'custom', label: EMAIL, url: MAILTO, appearance: 'secondary' } },
      ],
    },
  ],
})
