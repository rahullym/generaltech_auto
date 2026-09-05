/**
 * "About General Tech Automation" — the approved About Us document, word for
 * word. Section headings, sentences and ordering are the source document's;
 * only the arrangement into blocks is this file's.
 */
import { doc, paragraph } from '../lexical'
import { EMAIL, MAILTO, PHONE, callAction, emailAction } from '../shared'
import type { MediaResolver, SeededPage } from '../shared'

export const aboutPage = (media: MediaResolver): SeededPage => ({
  title: 'About General Tech Automation',
  slug: 'about_us',
  meta: {
    title: 'Industrial Electronics Repair Company in UAE | General Tech Automation',
    description:
      'General Tech Automation is an industrial electronics repair company in UAE, headquartered in Sharjah, restoring drives, servo motors, PLCs, and control system electronics.',
  },
  layout: [
    // --- Hero -------------------------------------------------------------
    {
      blockType: 'hero',
      variant: 'centered',
      eyebrow: 'General Tech Automation · Sharjah, UAE',
      heading: 'About *General Tech Automation*',
      subheading: 'Industrial Electronics Repair Company in UAE',
      image: media('factory-about.jpg'),
      actions: [callAction(`Call ${PHONE}`), emailAction()],
    },

    // --- Opening statement -------------------------------------------------
    // The document opens on a single pull quote. It is set as a standfirst
    // beside the workshop photography rather than as a quoted block, so the
    // page starts on the same editorial footing as the home page.
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      lede: true,
      collapsible: false,
      media: [{ image: media('panel-inspection.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'General Tech Automation is an industrial electronics repair company in UAE, headquartered in Sharjah, restoring drives, servo motors, PLCs, and control system electronics for Oil & Gas, manufacturing, life sciences, and chemical plants across the UAE and GCC.',
        ),
      ),
    },

    // --- The figures -------------------------------------------------------
    // "Est. 1998 · 28+ Years Combined Experience · Sharjah HQ", split into the
    // figure and the words that qualify it, in the order they are written.
    {
      blockType: 'stats',
      tone: 'light',
      items: [
        { lead: 'Est.', value: '1998' },
        { value: '28+', label: 'Years Combined Experience' },
        { value: 'Sharjah', label: 'HQ' },
      ],
    },

    // --- Repair Guarantees & Service Standards -----------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'right',
      heading: 'Repair Guarantees & *Service Standards*',
      collapsible: false,
      media: [{ image: media('board-repair.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'As an industrial electronics repair company in UAE, General Tech Automation is a factory-authorized repair partner for a wide range of AC and DC drive manufacturers, so a faulty drive is often restored to spec rather than replaced outright.',
        ),
        paragraph(
          'Every repair carries our own service guarantee, and our workmanship follows the same calibration and quality discipline our sister company, General Tech Services, applies across its Sharjah lab. Equipment we touch comes back with a documented, traceable service record, which matters most to clients who choose an industrial electronics repair company in UAE for regulated or safety-critical work.',
        ),
      ),
    },

    // --- Who We Are --------------------------------------------------------
    // The same treatment the home page gives its own "Who We Are": a sticky
    // heading on a dark band, each paragraph numbered as its own beat.
    {
      blockType: 'richText',
      layout: 'split',
      eyebrow: 'Company overview',
      heading: 'Who We *Are*',
      numbered: true,
      collapsible: false,
      media: [{ image: media('engineer-tablet-plant.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "General Tech Automation is the automation and electronics repair arm of General Tech Services, a Sharjah calibration and instrumentation company operating since 1998 — 28+ years of combined engineering experience behind every job we take on, whether it's a new control panel build or a same-day servo drive repair.",
        ),
        paragraph(
          "As an industrial electronics repair company in UAE, we work from the same Sharjah facility as our sister company's calibration lab and technical workforce, so a client bringing us a faulty drive or a plant automation problem gets repair technicians, control engineers, and instrumentation specialists in one place, not three separate vendors.",
        ),
        paragraph(
          "Our team's average tenure runs well past a decade in the industry, and that experience shows up in how fast we can diagnose a fault, source a replacement part, or bring a legacy control panel back online without a full re-engineer.",
        ),
      ),
    },

    // --- What We Do --------------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      heading: 'What We *Do*',
      lede: true,
      collapsible: false,
      media: [
        { image: media('automation-machine.jpg') },
        { image: media('operator-control-panel.jpg') },
      ].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'General Tech Automation covers the two things plants need on a recurring basis: keeping industrial electronics running, and building or integrating the control systems around them.',
        ),
        paragraph(
          'Our Repair Services division tests and restores inverters, VFDs, servo drives, HMIs, and controllers — in our Sharjah workshop and in the field. Our Automation Solutions team handles PLC programming, SCADA architecture, and custom control panel design for new lines and retrofits. Between projects, our Annual Maintenance Contracts keep panels and drives on a preventative schedule so faults get caught before they cause downtime, not after.',
        ),
      ),
    },

    // --- Why Plants Choose Us ----------------------------------------------
    // Two claims, so they are numbered rather than run together: stock and
    // speed first, then the monitoring and follow-through that builds on it.
    {
      blockType: 'richText',
      layout: 'editorial',
      heading: 'Why Plants Choose This *Industrial Electronics Repair Company in UAE*',
      mediaPosition: 'right',
      numbered: true,
      collapsible: false,
      media: [{ image: media('oil-refinery.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "We stock a significant inventory of valves, actuators, and process measurement instrumentation in Sharjah, letting us respond immediately rather than waiting on an overseas order — often delivering a repaired or automated assembly the same day it's requested.",
        ),
        paragraph(
          "We offer 24/7 monitoring options for clients who want ongoing plant visibility rather than a one-off repair, and it's this combination of stock, speed, and follow-through that plants come back to this industrial electronics repair company in UAE for, project after project.",
        ),
      ),
    },

    // --- Industries We Serve ------------------------------------------------
    // The passage names four client groups and gives each its own sentence, so
    // each becomes a card carrying that sentence unchanged.
    {
      blockType: 'industries',
      eyebrow: 'Who we work with',
      heading: 'Industries We *Serve*',
      // Each sector carries a full sentence or two here, which a fixed-height
      // track card cuts off — so these lay out as a grid instead.
      display: 'grid',
      intro:
        'As an industrial electronics repair company in UAE, our client base sits in industries where downtime is expensive and repairs have to be right the first time.',
      sectors: [
        {
          name: 'Oil & Gas',
          iconName: 'oil',
          description:
            'Oil & Gas operators rely on us for field instrumentation and hazardous-area repair.',
        },
        {
          name: 'Manufacturing',
          iconName: 'factory',
          description:
            'Manufacturers bring us PLC programming, retrofit, and CNC machine repair work.',
        },
        {
          name: 'Life Sciences',
          iconName: 'pharma',
          description: 'Life sciences facilities need calibrated, documented measurement systems.',
        },
        {
          name: 'Chemical and Pulp & Paper',
          iconName: 'chemical',
          description:
            'Chemical and pulp & paper plants use our control integration to keep continuous processes running within tight tolerances.',
        },
      ],
    },

    // --- Where We Work ------------------------------------------------------
    {
      blockType: 'coverage',
      eyebrow: 'Where we work',
      heading: 'Where We *Work*',
      tone: 'dark',
      // Names only: the approved passage says where the company works but not
      // what it does in each place, and the block's per-area note would have to
      // be written rather than quoted.
      areas: [
        { name: 'Sharjah' },
        { name: 'Dubai' },
        { name: 'Abu Dhabi' },
        { name: 'Wider GCC' },
      ],
      content: doc(
        paragraph(
          'Based in Sharjah, this industrial electronics repair company in UAE serves clients across Dubai and Abu Dhabi and the wider GCC. Field service teams travel to client sites for commissioning and repair, while workshop-based electronics repair runs out of our Sharjah facility.',
        ),
      ),
    },

    // --- Closing ask --------------------------------------------------------
    {
      blockType: 'cta',
      variant: 'dark',
      heading: 'Work With an Industrial Electronics Repair Company in UAE *That Knows Your Plant*',
      body: "If your plant has a drive down, a control system that needs building, or a maintenance plan to put in place, General Tech Automation's Sharjah-based team can help.",
      actions: [callAction(`Call ${PHONE}`), { link: { type: 'custom', label: EMAIL, url: MAILTO, appearance: 'secondary' } }],
    },
  ],
})
