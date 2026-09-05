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
            'Oil and gas sites depend on accurate, compliant measurement and control systems, from custody transfer metering to SCADA integration. Oil and gas automation applications UAE here cover instrumentation commissioning, control panel work, and measurement accuracy — areas where a fault can shut down production for hours rather than minutes.',
        },
        {
          name: 'Automotive Manufacturing Automation Applications',
          iconName: 'automotive',
          description:
            'Automotive production lines run on CNC machining, servo-driven robotics, and PLC-controlled assembly stations. Automotive manufacturing automation applications supported here include CNC control repair, servo motor and drive maintenance, and panel troubleshooting to keep tight production tolerances intact.',
        },
        {
          name: 'Pharmaceutical Industry Automation Applications',
          iconName: 'pharma',
          description:
            'Pharmaceutical industry automation applications require documented, repeatable control processes. Support covers instrumentation calibration, PLC programming, and control system repair, with the fault-reporting and documentation practices pharmaceutical compliance requires.',
        },
        {
          name: 'Food and Beverage Automation Applications UAE',
          iconName: 'beverage',
          description:
            'Hygiene-rated equipment and continuous-run production lines define this sector. Food and beverage automation applications UAE covered here include VFD and servo drive maintenance, PLC troubleshooting, and panel design suited to washdown environments.',
        },
        {
          name: 'Water Treatment Automation Applications',
          iconName: 'water',
          description:
            'Water treatment automation applications rely on accurate flow measurement and dependable control logic. Work here includes measurement commissioning, SCADA integration, and instrumentation support for treatment plant operations.',
        },
        {
          name: 'Power Generation Automation Applications',
          iconName: 'power',
          description:
            'Power plants need control systems that fail safely and recover fast. Power generation automation applications supported include control panel repair, PLC maintenance, and preventive electrical maintenance to reduce unplanned outages.',
        },
        {
          name: 'Logistics and Warehousing Automation Applications',
          iconName: 'logistics',
          description:
            'Conveyor systems, sorting equipment, and automated storage rely on synchronized drives and controls. Logistics and warehousing automation applications covered include VFD repair, PLC programming, and control panel troubleshooting for continuous-run facilities.',
        },
        {
          name: 'Construction Industry Automation Applications',
          iconName: 'construction',
          description:
            'Construction industry automation applications include automated batching plants and site power distribution panels, supported through custom panel design, electrical fault diagnosis, and field commissioning.',
        },
        {
          name: 'Petrochemical Automation Applications UAE',
          iconName: 'chemical',
          description:
            'Petrochemical facilities combine high-precision measurement with strict safety requirements. Petrochemical automation applications UAE supported include gas measurement skid commissioning, control system repair, and instrumentation compliance checks.',
        },
        {
          name: 'Manufacturing Plant Automation Applications',
          iconName: 'factory',
          description:
            "General manufacturing plant automation applications span CNC machine repair, PLC troubleshooting, servo and drive maintenance, and automation solutions tailored to each production line's specific machinery mix.",
        },
      ],
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
