/**
 * Structured data for a service inner page: Service + LocalBusiness + FAQPage
 * + BreadcrumbList, which is the set every source document asks for under its
 * "Schema Recommendations" heading.
 *
 * The FAQ questions are read back off the page's own `faq` block, so the graph
 * can never drift from the copy on the page. Because this graph carries the
 * FAQPage node, the block is told not to publish a second one.
 */
import { lexicalToText } from './lexical'

import type { Block, Page, RichTextValue } from './types'

const SITE = 'https://www.generaltechautomation.ae'
const ORGANISATION = `${SITE}/#organization`

type FaqItem = { question: string; answer: RichTextValue }

const faqItems = (layout: Block[]): FaqItem[] =>
  layout
    .filter((block) => block.blockType === 'faq')
    .flatMap((block) => (block.items as FaqItem[] | undefined) ?? [])

export const serviceSchema = (page: Page, serviceType?: string) => {
  const url = `${SITE}/${page.slug}`
  const faqs = faqItems(page.layout ?? [])

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: page.title,
      serviceType: serviceType ?? page.title,
      description: page.meta?.description,
      url,
      provider: { '@id': ORGANISATION },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Dubai' },
        { '@type': 'AdministrativeArea', name: 'Sharjah' },
        { '@type': 'AdministrativeArea', name: 'Abu Dhabi' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': ORGANISATION,
      name: 'General Tech Automation',
      url: `${SITE}/`,
      telephone: '+971-6-543-6933',
      email: 'mathews@generaltechuae.com',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sharjah',
        addressCountry: 'AE',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
        { '@type': 'ListItem', position: 3, name: page.title, item: url },
      ],
    },
  ]

  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: lexicalToText(item.answer) },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
