/**
 * "Industrial Automation Services in the UAE" — the approved Services
 * document, word for word.
 *
 * The document sets out four service families, each as a paragraph followed by
 * the run of named services in it. Both halves matter — the paragraph is the
 * argument, the names are what a reader is actually looking for — so the
 * service index block carries them together rather than dropping either.
 */
import { doc, paragraph } from '../lexical'
import { EMAIL, MAILTO, PHONE, callAction, pageAction, service } from '../shared'
import type { MediaResolver, SeededPage } from '../shared'

export const servicesPage = (media: MediaResolver): SeededPage => ({
  title: 'Industrial Automation Services in the UAE',
  slug: 'services',
  meta: {
    title: 'Industrial Automation Services in the UAE | General Tech Automation',
    description:
      'Factory-authorized repair, maintenance and automation support for PLCs, servo motors, drives and panels — delivered across Dubai, Sharjah and Abu Dhabi.',
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'centered',
      eyebrow: 'Services',
      heading: 'Industrial Automation Services *in the UAE*',
      subheading:
        'Factory-authorized repair, maintenance and automation support for PLCs, servo motors, drives and panels — delivered across Dubai, Sharjah and Abu Dhabi.',
      image: media('7_1.jpg'),
      actions: [pageAction('Get A Free Quote', '/contact_us'), callAction(`Call ${PHONE}`, 'secondary')],
    },

    {
      blockType: 'richText',
      layout: 'editorial',
      mediaPosition: 'left',
      lede: true,
      collapsible: false,
      media: [
        { image: media('panel-inspection.jpg') },
        { image: media('board-repair.jpg') },
      ].filter((entry) => entry.image),
      content: doc(
        paragraph(
          'General Tech Automation delivers industrial automation services and factory-authorized electronics repair across the United Arab Emirates, from our Sharjah workshop to job sites in Dubai and Abu Dhabi. Our engineers repair, maintain, and program the equipment that keeps production lines, process plants, and utilities running: PLCs, servo motors, HMIs, VFDs, and the panels that house them. Every unit we handle is load tested and function tested before it leaves our facility, so you get equipment you can trust the moment it goes back into service.',
        ),
      ),
    },

    // --- Why General Tech Automation ----------------------------------------
    {
      blockType: 'richText',
      layout: 'split',
      eyebrow: 'Why choose us',
      heading: 'Why *General Tech Automation*',
      collapsible: false,
      // Without imagery the column under the heading is empty for the height
      // of the band; the split layout drops a photograph in beneath it.
      media: [{ image: media('engineer-tablet-plant.jpg') }].filter((entry) => entry.image),
      content: doc(
        paragraph(
          "Downtime on a production line or process skid costs more than the repair itself. That's why our industrial automation services are built around fast turnaround and traceable, genuine parts. We hold factory authorization from multiple global automation brands, so our technicians are trained directly by the manufacturers whose equipment they repair, and our replacement components come with full warranty backing.",
        ),
      ),
    },

    // --- The four families ---------------------------------------------------
    {
      // No umbrella heading: the document titles each family and writes
      // nothing above the set, so the panels carry the headings it does have.
      blockType: 'serviceIndex',
      groups: [
        {
          title: 'Repair & Maintenance Services',
          iconName: 'refresh',
          description:
            'Our core repair services cover industrial electronics repair, servo motor repair, and AC and DC motor repair for facilities across Dubai, Sharjah, and Abu Dhabi. We handle HMI and display repair, PLC repair and maintenance, and VFD and AC drive repair, along with soft starter repair, CNC machine repair services, and hydraulic and pneumatic repair. As a factory authorized repair center, we replace failed components rather than the whole unit wherever possible, keeping turnaround time and cost down.',
          services: [
            service('Industrial Electronics Repair', '/industrial-repair-services-uae'),
            service('Servo Motor Repair', '/industrial-repair-services-uae'),
            service('AC & DC Motor Repair', '/industrial-repair-services-uae'),
            service('HMI & Display Repair', '/industrial-repair-services-uae'),
            service('VFD / AC Drive Repair', '/industrial-repair-services-uae'),
            service('Soft Starter Repair', '/industrial-repair-services-uae'),
            service('CNC Machine Repair', '/service/cnc-machine-repair-services-uae'),
            service('Hydraulic & Pneumatic Repair', '/industrial-repair-services-uae'),
          ],
        },
        {
          title: 'Automation & Control Services',
          iconName: 'cpu',
          description:
            'Beyond repair, we provide PLC maintenance and troubleshooting, PLC programming, and complete automation solutions for new and legacy control systems. Our retrofit solutions modernize aging equipment for Industry 4.0 without a full system replacement, and our digital transformation and industrial IoT services help plants move toward real-time monitoring and predictive maintenance.',
          services: [
            service('PLC Maintenance & Troubleshooting', '/plc-maintenance-and-troubleshooting-services-uae'),
            service('PLC Programming', '/plc-programming-services-uae'),
            service('Automation Solutions', '/industrial-automation-solutions-uae'),
            service('Retrofit Solutions', '/industrial-retrofit-solutions-uae'),
            service('Digital Transformation', '/service/digital-transformation-services-uae'),
            service('Industrial IoT Services', '/service/industrial-iot-services-uae'),
          ],
        },
        {
          title: 'Instrumentation & Measurement Services',
          iconName: 'gauge',
          description:
            'General Tech Automation acts as a main instrument supplier and provides field instrumentation services and support, measurement preventative services, and commissioning and start-up support. We also offer weighing scale repair services and asset data management to keep your instrumentation records accurate and audit-ready.',
          services: [
            service('Main Instrument Supplier', '/service/main-instrument-supplier-uae'),
            service('Field Instrumentation Services', '/service/field-instrumentation-services-and-support-uae'),
            service('Measurement Preventative Services', '/service/measurement-preventative-services-uae'),
            service('Commissioning & Start-Up', '/service/measurement-commissioning-start-up-services-uae'),
            service('Weighing Scale Repair', '/service/measurement-preventative-services-uae'),
            service('Asset Data Management', '/asset-data-management-services-uae'),
          ],
        },
        {
          title: 'Panel Design, Manufacturing & Support Contracts',
          iconName: 'cabinet',
          description:
            'Our workshop designs and manufactures custom control panels engineered around your process, and our wireless plant network support extends reliable connectivity across your site. For ongoing coverage, we offer Annual Maintenance Contracts (AMC) for panels, VFDs, UPS, and servo drives, giving facilities predictable, scheduled maintenance instead of reactive callouts.',
          services: [
            service('Custom Panel Design & Manufacturing', '/service/custom-control-panel-design-manufacturing-uae'),
            service('Wireless Plant Network Support', '/wireless-plant-network-support-uae'),
            service(
              'AMC for Panels, VFD, UPS & Servo Drives',
              '/amc-services-panels-vfd-ups-servo-drives-uae',
            ),
          ],
        },
      ],
    },

    // --- Coverage -------------------------------------------------------------
    {
      blockType: 'coverage',
      eyebrow: 'Where we work',
      heading: 'Service Coverage Across the *UAE*',
      tone: 'dark',
      areas: [
        { name: 'Dubai', note: 'Industrial & free zone facilities' },
        { name: 'Sharjah', note: 'Head office & workshop' },
        { name: 'Abu Dhabi', note: 'Energy & manufacturing sites' },
        { name: 'N. Emirates', note: 'On-request coverage' },
      ],
      content: doc(
        paragraph(
          "Operating from our Sharjah headquarters, our service teams reach Dubai's industrial and free zone facilities, Abu Dhabi's energy and manufacturing sites, and the wider Northern Emirates, all supported by the same factory-trained technicians and genuine parts supply chain on every call-out.",
        ),
      ),
    },

    {
      blockType: 'cta',
      variant: 'dark',
      heading: 'Request a Service or *Repair Quote*',
      body:
        'Have equipment down or a maintenance contract to plan? Contact General Tech Automation to discuss your industrial automation services requirements anywhere in the UAE.',
      actions: [
        pageAction('Get A Free Quote', '/contact_us'),
        { link: { type: 'custom', label: EMAIL, url: MAILTO, appearance: 'secondary' } },
      ],
    },
  ],
})
