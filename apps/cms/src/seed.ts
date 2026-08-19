/**
 * Seeds a minimal but complete site: an admin user, a homepage with every
 * block type, a couple of posts, and a small docs tree.
 *
 * Run with:  pnpm --filter cms seed
 * Safe to re-run: existing documents are matched by slug and updated.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

/** Wraps plain paragraphs in the Lexical shape Payload stores. */
const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'text',
          text,
          format: 0,
          style: '',
          detail: 0,
          mode: 'normal',
          version: 1,
        },
      ],
    })),
  },
})

const seed = async () => {
  const payload = await getPayload({ config })

  // --- Admin user -------------------------------------------------------
  const email = process.env.SEED_EMAIL || 'admin@example.com'
  const password = process.env.SEED_PASSWORD || 'changeme123'

  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Site Admin', role: 'admin' },
    })
    payload.logger.info(`Created admin user ${email} (password: ${password})`)
  } else {
    payload.logger.info(`Admin user ${email} already exists, skipping`)
  }

  // --- Helper: create or update by slug ---------------------------------
  const upsert = async (collection: 'pages' | 'posts' | 'docs' | 'categories', data: any) => {
    const found = await payload.find({
      collection,
      where: { slug: { equals: data.slug } },
      limit: 1,
      draft: true,
    })

    if (found.docs.length > 0) {
      return payload.update({
        collection,
        id: found.docs[0]!.id,
        data,
      })
    }

    return payload.create({ collection, data })
  }

  // --- Categories -------------------------------------------------------
  const engineering = await upsert('categories', {
    title: 'Engineering',
    slug: 'engineering',
    description: 'How we build things.',
  })

  await upsert('categories', {
    title: 'Company',
    slug: 'company',
    description: 'News and announcements.',
  })

  // --- Homepage ---------------------------------------------------------
  await upsert('pages', {
    title: 'Home',
    slug: 'home',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        variant: 'centered',
        eyebrow: 'Automation, delivered',
        heading: 'Ship better systems, faster',
        subheading:
          'We design and build automation that removes the busywork from your operations.',
        actions: [
          {
            link: {
              type: 'custom',
              label: 'Read the docs',
              url: '/docs',
              appearance: 'primary',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'View the blog',
              url: '/blog',
              appearance: 'secondary',
            },
          },
        ],
      },
      {
        blockType: 'featureGrid',
        heading: 'What we do',
        intro: 'Three things we are unreasonably good at.',
        columns: '3',
        features: [
          {
            title: 'Process automation',
            description: 'Map the workflow, remove the manual steps, measure the result.',
          },
          {
            title: 'Systems integration',
            description: 'Make the tools you already pay for talk to each other properly.',
          },
          {
            title: 'Reliability engineering',
            description: 'Observability and alerting so failures surface before customers do.',
          },
        ],
      },
      {
        blockType: 'faq',
        heading: 'Frequently asked',
        items: [
          {
            question: 'How long does a typical engagement take?',
            answer: richText('Most projects run six to twelve weeks from kickoff to handover.'),
          },
          {
            question: 'Do you work with existing systems?',
            answer: richText(
              'Yes. Most of our work integrates with software already in place rather than replacing it.',
            ),
          },
        ],
      },
      {
        blockType: 'cta',
        heading: 'Ready to start?',
        body: 'Tell us what is slowing you down and we will map out the fix.',
        actions: [
          {
            link: { type: 'custom', label: 'Get in touch', url: '/contact', appearance: 'primary' },
          },
        ],
      },
    ],
  })

  // --- A second page ----------------------------------------------------
  await upsert('pages', {
    title: 'About',
    slug: 'about',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        variant: 'minimal',
        heading: 'About us',
        subheading: 'A small team of engineers who like removing manual steps.',
      },
      {
        blockType: 'richText',
        width: 'prose',
        content: richText(
          'General Tech Automation started as a two-person consultancy and has grown into a team that ships automation for operations-heavy businesses.',
          'We care about systems that keep working after we leave.',
        ),
      },
    ],
  })

  // --- Posts ------------------------------------------------------------
  await upsert('posts', {
    title: 'Why we moved to Astro and Payload',
    slug: 'why-astro-and-payload',
    _status: 'published',
    excerpt:
      'Splitting the frontend from the CMS gave us faster pages and a much better editing experience.',
    publishedAt: new Date('2026-07-01').toISOString(),
    categories: [engineering.id],
    tags: [{ tag: 'astro' }, { tag: 'payload' }],
    content: richText(
      'We wanted a site that renders fast, is pleasant to edit, and does not lock content into a proprietary format.',
      'Astro handles the frontend and Payload owns the content model. The two talk over REST, which keeps deployment simple.',
    ),
  })

  await upsert('posts', {
    title: 'Automating the boring parts of onboarding',
    slug: 'automating-onboarding',
    _status: 'published',
    excerpt: 'Fourteen manual steps became two, and nobody has to remember the order any more.',
    publishedAt: new Date('2026-07-20').toISOString(),
    categories: [engineering.id],
    tags: [{ tag: 'operations' }],
    content: richText(
      'Onboarding a new client involved fourteen steps across five tools, each one a chance to forget something.',
      'We modelled the whole flow as a state machine and wired the tools together. It now takes two actions.',
    ),
  })

  // --- Docs tree --------------------------------------------------------
  const gettingStarted = await upsert('docs', {
    title: 'Getting started',
    slug: 'getting-started',
    _status: 'published',
    order: 0,
    description: 'Install, configure and run the project locally.',
    content: richText(
      'This guide walks through getting a local environment running.',
      'You will need Node 22 or newer, pnpm, and Docker for Postgres.',
    ),
  })

  await upsert('docs', {
    title: 'Installation',
    slug: 'installation',
    _status: 'published',
    order: 0,
    parent: gettingStarted.id,
    description: 'Dependencies and first run.',
    content: richText(
      'Run pnpm install from the repository root to install every workspace at once.',
      'Then start the database with pnpm db:up before running pnpm dev.',
    ),
  })

  await upsert('docs', {
    title: 'Configuration',
    slug: 'configuration',
    _status: 'published',
    order: 1,
    parent: gettingStarted.id,
    description: 'Environment variables explained.',
    content: richText(
      'Each app reads its own .env file. Copy .env.example into apps/cms and apps/web.',
      'PAYLOAD_SECRET must be a long random string and must not change between deploys.',
    ),
  })

  await upsert('docs', {
    title: 'Content model',
    slug: 'content-model',
    _status: 'published',
    order: 1,
    description: 'Collections, globals and blocks.',
    content: richText(
      'Content is organised into pages, posts and docs, plus three globals for site chrome.',
      'Pages are assembled from blocks, so editors can build layouts without a developer.',
    ),
  })

  // --- Globals ----------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'General Tech Automation',
      tagline: 'Automation that removes the busywork.',
      defaultSeo: {
        description: 'We design and build automation for operations-heavy businesses.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', label: 'About', url: '/about' } },
        { link: { type: 'custom', label: 'Blog', url: '/blog' } },
        { link: { type: 'custom', label: 'Docs', url: '/docs' } },
      ],
      ctas: [
        { link: { type: 'custom', label: 'Contact', url: '/contact', appearance: 'primary' } },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Product',
          links: [
            { link: { type: 'custom', label: 'Docs', url: '/docs' } },
            { link: { type: 'custom', label: 'Blog', url: '/blog' } },
          ],
        },
        {
          title: 'Company',
          links: [{ link: { type: 'custom', label: 'About', url: '/about' } }],
        },
      ],
      copyright: `© ${new Date().getFullYear()} General Tech Automation. All rights reserved.`,
    },
  })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

// Top-level await is required: `payload run` exits as soon as module
// evaluation completes, so a floating promise would never finish.
try {
  await seed()
} catch (error) {
  console.error(error)
  process.exit(1)
}
