/**
 * Homepage structured data, exactly as supplied in the approved SEO document:
 * ProfessionalService + WebPage + FAQPage in one @graph. Rendered into <head>
 * by pages/index.astro.
 *
 * Because this graph already carries the FAQPage node, the FAQ block on the
 * homepage is told not to emit its own (see BlockRenderer's `faqSchema` prop).
 */
export const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://www.generaltechautomation.ae/#organization',
      name: 'General Tech Automation',
      url: 'https://www.generaltechautomation.ae/',
      description:
        'Industrial automation engineering company in the UAE delivering PLC programming, SCADA development, HMI design, DCS engineering, control panel manufacturing, and Industry 4.0 solutions.',
      telephone: '+971-6-543-6933',
      priceRange: '$$',
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Dubai' },
        { '@type': 'AdministrativeArea', name: 'Sharjah' },
        { '@type': 'AdministrativeArea', name: 'Abu Dhabi' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      parentOrganization: {
        '@type': 'Organization',
        name: 'General Tech Services LLC',
        url: 'https://www.generaltech.ae/',
        foundingDate: '1998',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'PLC Programming and Control Logic Design' },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Supervisory Control Architecture and SCADA Development',
          },
        },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'HMI Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DCS Engineering' } },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Connected Automation and Industry 4.0 Engineering',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Control Panel Design and Manufacturing' },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Process and Machine Automation Engineering' },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Automation Retrofit and Annual Maintenance Contracts',
          },
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.generaltechautomation.ae/#webpage',
      url: 'https://www.generaltechautomation.ae/',
      name: 'Industrial Automation Engineering Company in UAE',
      description:
        'General Tech Automation delivers PLC logic design, control architecture, HMI development and Industry 4.0 engineering across the UAE.',
      isPartOf: { '@id': 'https://www.generaltechautomation.ae/#website' },
      about: { '@id': 'https://www.generaltechautomation.ae/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.generaltechautomation.ae/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does this kind of automation engineering company actually do?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It designs, programs, and maintains the control systems - programmable controllers, supervisory software, and operator interfaces - that run industrial machinery and processes automatically, with minimal manual intervention.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which control platforms does General Tech Automation support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Siemens, Allen-Bradley, Schneider Electric, Mitsubishi, DeltaV, and ABB, including mixed-vendor plants where different systems need to work together.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you upgrade an old control system instead of replacing it entirely?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Our retrofit service modernizes existing control systems using current hardware and software, which is usually faster and less costly than a full replacement.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer ongoing maintenance after a project is commissioned?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, through our automation annual maintenance contracts, which include scheduled inspections and priority engineering support across the UAE.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is General Tech Automation different from a general automation supplier?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We focus exclusively on engineering - design, programming, panel build, and commissioning - rather than splitting attention across product sales, general repairs, and unrelated technical services.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide documentation after the project is complete?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every project includes as-built drawings, tag lists, and program backups, so your team retains full ownership of the system going forward.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a typical automation engineering project take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on scope, but most retrofit and panel projects run from a few weeks for a single machine to a few months for a plant-wide system, with timelines agreed during the site audit.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which industries in the UAE do you work with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oil and gas, water and wastewater treatment, food and beverage, pharmaceuticals, power generation, and general industrial manufacturing across Dubai, Sharjah, Abu Dhabi, and the Northern Emirates.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you decide between a retrofit and a full system replacement?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It comes down to the condition of the existing hardware and how well it can support current and near-future production needs. This is assessed during the site audit, with a straightforward recommendation including cost and lead-time trade-offs.',
          },
        },
      ],
    },
  ],
}
