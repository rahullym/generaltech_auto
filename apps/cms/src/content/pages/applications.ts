/**
 * "Industrial Automation Applications by Industry UAE" — the approved
 * Applications document, word for word.
 *
 * The document is a hub page: a direct answer, then one heading per sector.
 * Ten sectors is more than a stacked list can be read through, so they run on
 * the industries track — the same component the home page uses — with each
 * sector's paragraph carried unchanged on its own card.
 *
 * The document's closing "Content stats" panel is a production note about the
 * copy (word count, keyword density, cannibalisation checks) rather than
 * anything addressed to a reader, so it is not published. Its meta title and
 * description are applied as this page's SEO fields, which is what they are.
 */
import { doc, link, paragraph } from '../lexical'
import { EMAIL, MAILTO, PHONE, callAction } from '../shared'
import type { MediaResolver, SeededPage } from '../shared'

export const applicationsPage = (media: MediaResolver): SeededPage => ({
  title: 'Industrial Automation Applications by Industry UAE',
  slug: 'applications',
  meta: {
    title: 'Industrial Automation Applications by Industry UAE | GTA',
    description:
      'Industrial Automation Applications by Industry UAE — control, instrumentation & automation support for oil & gas, automotive, pharma & more.',
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'centered',
      eyebrow: 'Applications',
      heading: 'Industrial Automation Applications *by Industry UAE*',
      image: media('oil-refinery.jpg'),
      actions: [callAction(`Call ${PHONE}`)],
    },

    // --- Direct Answer --------------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      heading: 'Direct *Answer*',
      lede: true,
      collapsible: false,
      media: [
        { image: media('digital-bg.jpg') },
        { image: media('DeltaV.jpg') },
      ].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "Industrial Automation Applications by Industry UAE covers the control, instrumentation, and repair work General Tech Automation carries out across oil and gas, automotive, pharmaceutical, food and beverage, water treatment, power generation, logistics, construction, petrochemical, and manufacturing sites. Each sector has different accuracy, uptime, and compliance needs, so the automation approach — from PLC programming to CNC repair to measurement commissioning — is matched to the plant it's built for, not applied as a generic template.",
        ),
      ),
    },

    // --- Applications by Industry ---------------------------------------------
    {
      blockType: 'industries',
      eyebrow: 'By sector',
      heading: 'Applications *by Industry*',
      // Each sector carries a full sentence or two here, which a fixed-height
      // track card cuts off — so these lay out as a grid instead.
      display: 'grid',
      sectors: [
        {
          name: 'Oil and Gas Automation Applications UAE',
          iconName: 'oil',
          description:
            'Oil and gas sites depend on accurate, compliant measurement and control systems, from custody transfer metering to SCADA integration. Oil and gas automation applications UAE here cover instrumentation commissioning, control panel work, and measurement accuracy.',
          href: '/applications/oil-and-gas-automation-uae',
          linkLabel: 'Explore oil and gas automation',
        },
        {
          name: 'Automotive Manufacturing Automation Applications',
          iconName: 'automotive',
          description:
            'Automotive lines run on CNC machining, servo-driven robots and PLC-controlled assembly. Supported with CNC control repair, servo motor maintenance, and panel troubleshooting.',
          href: '/applications/automotive-manufacturing-automation-uae',
          linkLabel: 'Explore automotive manufacturing automation',
        },
        {
          name: 'Pharmaceutical Industry Automation Applications',
          iconName: 'pharma',
          description:
            'Pharmaceutical plants need documented, repeatable control and audit-ready records. Support covers instrumentation calibration, PLC programming, and control system repair.',
          href: '/applications/pharmaceutical-automation-uae',
          linkLabel: 'Explore pharmaceutical automation',
        },
        {
          name: 'Food and Beverage Automation Applications UAE',
          iconName: 'beverage',
          description:
            'Hygienic, continuous-run lines need reliable drives, washdown panels and recorded temperatures. Covered with VFD and servo drive maintenance, and CIP monitoring.',
          href: '/applications/food-and-beverage-automation-uae',
          linkLabel: 'Explore food and beverage automation',
        },
        {
          name: 'Water Treatment Automation Applications',
          iconName: 'water',
          description:
            'Accurate flow measurement and dependable control logic for desalination, STPs and pump stations. Work includes measurement commissioning and SCADA integration.',
          href: '/applications/water-treatment-automation-uae',
          linkLabel: 'Explore water treatment automation',
        },
        {
          name: 'Power Generation Automation Applications',
          iconName: 'power',
          description:
            'Control systems that fail safely and recover fast, from generator panels to solar SCADA. Supported with control panel repair, AMF panels, and preventive maintenance.',
          href: '/applications/power-generation-automation-uae',
          linkLabel: 'Explore power generation automation',
        },
        {
          name: 'Logistics and Warehousing Automation Applications',
          iconName: 'logistics',
          description:
            'Conveyors, sorters and storage systems that keep goods moving through every shift and peak season. Covered with VFD repair, PLC programming, and drive support.',
          href: '/applications/logistics-and-warehouse-automation-uae',
          linkLabel: 'Explore logistics and warehouse automation',
        },
        {
          name: 'Construction Industry Automation Applications',
          iconName: 'construction',
          description:
            'Automated batching plants, crusher controls and site power panels built for dust, heat and vibration. Supported through panel design, fault diagnosis, and commissioning.',
          href: '/applications/construction-industry-automation-uae',
          linkLabel: 'Explore construction industry automation',
        },
        {
          name: 'Petrochemical Automation Applications UAE',
          iconName: 'chemical',
          description:
            'High-precision measurement and strict safety control for polymer, fertilizer and chemical plants. Supported with analyser maintenance, SIS testing, and DCS migration.',
          href: '/applications/petrochemical-automation-uae',
          linkLabel: 'Explore petrochemical automation',
        },
        {
          name: 'Manufacturing Plant Automation Applications',
          iconName: 'factory',
          description:
            "Automation tailored to each line's machinery mix, from PLC troubleshooting to drive maintenance. Spanning CNC repair, servo maintenance, and line upgrades.",
          href: '/applications/manufacturing-plant-automation-uae',
          linkLabel: 'Explore manufacturing plant automation',
        },
      ],
    },

    // --- What the work looks like -------------------------------------------------
    // The sectors above tell a visitor whether we work in their industry; they
    // do not show what the work actually is. This grid does, one worked example
    // per card. The examples are not listed here — they are content files in
    // apps/web, and every one of them appears in the grid automatically.
    {
      blockType: 'applicationIndex',
      eyebrow: 'What automation looks like',
      heading: 'Worked examples of *what is possible*',
      intro:
        'Typical arrangements for problems we are asked about most often — what gets measured or controlled, what it is made of, how it goes in, and what changes once it is running. These are illustrative applications rather than case studies: no client names and no borrowed figures.',
      footnote:
        'Every example describes a common arrangement rather than one specific installation. What your site needs is settled by a survey, and the scope always follows the plant rather than the page.',
    },

    // --- Sector Experience and Support ------------------------------------------
    {
      blockType: 'richText',
      layout: 'split',
      media: [{ image: media('panel-inspection.jpg') }].filter((entry) => entry.image),
      eyebrow: 'One engineering team',
      heading: 'Sector Experience *and Support*',
      collapsible: false,
      content: doc(
        paragraph(
          'Work across these sectors draws on the same core engineering team — factory-trained on multiple control platforms — rather than separate teams per industry, which keeps response consistent regardless of sector. Site assessments for a new sector application are typically scheduled within 24–48 hours of enquiry, with a scoped proposal following the same visit wherever possible. These are real service capabilities, not case studies with invented client names or figures.',
        ),
      ),
    },

    // --- Explore by Service -------------------------------------------------------
    {
      blockType: 'richText',
      layout: 'editorial',
      heading: 'Explore *by Service*',
      mediaPosition: 'right',
      lede: true,
      collapsible: false,
      media: [{ image: media('automation-machine.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'Each industry above connects to a specific service: automotive and manufacturing sectors are best served by ',
          link('CNC Machine Repair Services', '/service/cnc-machine-repair-services-uae'),
          ', oil and gas and petrochemical sites by ',
          link('Commissioning & Start-Up – Measurement', '/service/measurement-commissioning-start-up-services-uae'),
          ', and cross-sector control work by ',
          link('PLC Maintenance & Troubleshooting', '/plc-maintenance-and-troubleshooting-services-uae'),
          '.',
        ),
      ),
    },

    {
      blockType: 'cta',
      variant: 'dark',
      heading: "Not sure which service fits your sector? Tell us about your plant and *we'll match the right support.*",
      actions: [
        callAction(`Call ${PHONE}`),
        { link: { type: 'custom', label: EMAIL, url: MAILTO, appearance: 'secondary' } },
      ],
    },
  ],
})
