/**
 * Loads the approved homepage copy ("Industrial Automation Engineering Company
 * in UAE", prepared by Teknoppy) into the `home` page, verbatim.
 *
 * Run with:  pnpm --filter cms seed:home
 * Safe to re-run: the page is matched by slug and replaced.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import type { Page } from '../payload-types'

type TextNode = { bold?: boolean; text: string }

const text = ({ text: value, bold }: TextNode) => ({
  type: 'text',
  text: value,
  format: bold ? 1 : 0,
  style: '',
  detail: 0,
  mode: 'normal',
  version: 1,
})

const paragraph = (...runs: (string | TextNode)[]) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: runs.map((run) => text(typeof run === 'string' ? { text: run } : run)),
})

const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [text({ text: value })],
})

const doc = (...children: unknown[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children,
  },
})

// --- Coverage -----------------------------------------------------------
// Not in the approved copy: the passage only names the emirates, so these
// one-liners describe where the industry sits in each and are the first thing
// to edit in the CMS if the client wants them said differently.
const COVERAGE_AREAS: [string, string][] = [
  ['Dubai', 'Jebel Ali, Al Quoz and Dubai Investment Park industrial areas.'],
  ['Sharjah', 'The industrial areas and the Hamriyah free zone.'],
  ['Abu Dhabi', 'Capital-region plants and Western Region facilities.'],
  ['Northern Emirates', 'Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah.'],
]

// --- Industries ---------------------------------------------------------
// The approved passage names six sectors and then describes five of them, so
// the five descriptions below are its own sentences, word for word. General
// industrial manufacturing is named but never described in the copy, so its
// line is written from the same source and is the one to edit in the CMS if
// the client wants it said differently.
const INDUSTRY_SECTORS: [string, string, string][] = [
  [
    'Oil and Gas',
    'oil',
    'Oil and gas projects typically involve control panel upgrades and safety-documented instrumentation work for upstream and downstream facilities, where reliability documentation matters as much as the engineering itself.',
  ],
  [
    'Water and Wastewater Treatment',
    'water',
    'Water and wastewater clients need SCADA-linked pump and process control systems that run unattended for long stretches but alert operators the moment something needs attention.',
  ],
  [
    'Food and Beverage Manufacturing',
    'beverage',
    'Food and beverage clients need fast changeover logic and hygienic panel builds with traceability data built into the control system from day one.',
  ],
  [
    'Pharmaceuticals',
    'pharma',
    'Pharmaceutical facilities require validated, audit-ready automation that can stand up to inspection, where our instrumentation-calibration background becomes a genuine advantage rather than a nice-to-have.',
  ],
  [
    'Power Generation and Utilities',
    'power',
    'Power and utility clients rely on us for panel design, retrofit of aging switchgear-linked automation, and remote monitoring that reduces truck rolls to distant sites across the Emirates.',
  ],
  [
    'General Industrial Manufacturing',
    'factory',
    'General manufacturers come to us for logic rewrites, line integration, and panel work that brings equipment from different eras back under one coherent, documented control system.',
  ],
]

// --- Process ------------------------------------------------------------
const PROCESS_STEPS: [string, string][] = [
  [
    'Site Audit',
    'We assess your existing control systems, hardware condition, and operational goals on-site.',
  ],
  [
    'Engineering Design',
    'A control philosophy, panel layout, and system architecture tailored to your process.',
  ],
  [
    'Programming and Panel Build',
    'Logic is written and tested; panels are fabricated in-house to specification.',
  ],
  [
    'Factory and Site Acceptance Testing',
    'Every system is validated before and after installation.',
  ],
  ['Commissioning', 'Brought live with minimal disruption to your ongoing operations.'],
  [
    'Ongoing Support',
    'Optional AMC coverage keeps systems maintained long after go-live, with full as-built documentation handed over.',
  ],
]

const PHONE = '+971 6 543 6933'
const TEL = 'tel:+97165436933'

const callAction = (label: string) => ({
  link: { type: 'custom', label, url: TEL, appearance: 'primary' },
})

// --- Services -----------------------------------------------------------
const SERVICES = [
  {
    title: 'PLC Programming and Control Logic Design',
    iconName: 'cpu',
    description:
      'New installations, logic redesign, and troubleshooting across Siemens, Allen-Bradley, Schneider, and Mitsubishi platforms. Every program is documented clearly enough for your own maintenance team to read and modify it later.',
  },
  {
    title: 'Supervisory Control Architecture and SCADA Development',
    iconName: 'dashboard',
    description:
      'Real-time dashboards for production, energy use, alarms, and equipment health, built for remote monitoring so decision-makers can track operations from anywhere in the UAE.',
  },
  {
    title: 'HMI Development',
    iconName: 'screen',
    description:
      'Operator interfaces designed around how a shift actually runs, with clear screen hierarchy and fast fault diagnosis to cut downtime and training time.',
  },
  {
    title: 'DCS Engineering',
    iconName: 'network',
    description:
      'Configuration, migration, and optimization of distributed control systems for continuous process industries, including legacy platform migration without extended shutdowns.',
  },
  {
    title: 'Connected Automation and Industry 4.0 Engineering',
    iconName: 'signal',
    description:
      'Practical, phased steps toward smart manufacturing: predictive maintenance, energy tracking, and unified data visibility across the plant floor.',
  },
  {
    title: 'Control Panel Design and Manufacturing',
    iconName: 'cabinet',
    description:
      'In-house panel design and build to UAE and international electrical standards, tested before it ever reaches site to shorten commissioning time.',
  },
  {
    title: 'Process and Machine Automation Engineering',
    iconName: 'cog',
    description:
      "From packaging lines and conveyor systems to water treatment and utility automation, engineered around your plant's actual throughput and layout.",
  },
  {
    title: 'Automation Retrofit and Annual Maintenance Contracts (AMC)',
    iconName: 'refresh',
    description:
      'Modernize existing control systems at a fraction of replacement cost, or keep them running reliably with scheduled inspections and priority engineering support.',
  },
]

// --- FAQ ----------------------------------------------------------------
const FAQS = [
  [
    'What does this kind of automation engineering company actually do?',
    'It designs, programs, and maintains the control systems — programmable controllers, supervisory software, and operator interfaces — that run industrial machinery and processes automatically, with minimal manual intervention.',
  ],
  [
    'Which control platforms does General Tech Automation support?',
    'Siemens, Allen-Bradley, Schneider Electric, Mitsubishi, DeltaV, and ABB, including mixed-vendor plants where different systems need to work together.',
  ],
  [
    'Can you upgrade an old control system instead of replacing it entirely?',
    'Yes. Our retrofit service modernizes existing control systems using current hardware and software, which is usually faster and less costly than a full replacement.',
  ],
  [
    'Do you offer ongoing maintenance after a project is commissioned?',
    'Yes, through our automation annual maintenance contracts, which include scheduled inspections and priority engineering support across the UAE.',
  ],
  [
    'How is General Tech Automation different from a general automation supplier?',
    'We focus exclusively on engineering — design, programming, panel build, and commissioning — rather than splitting attention across product sales, general repairs, and unrelated technical services.',
  ],
  [
    'Do you provide documentation after the project is complete?',
    'Yes. Every project includes as-built drawings, tag lists, and program backups, so your team retains full ownership of the system going forward.',
  ],
  [
    'How long does a typical automation engineering project take?',
    'It depends on scope, but most retrofit and panel projects run from a few weeks for a single machine to a few months for a plant-wide system, with timelines agreed during the site audit.',
  ],
  [
    'Which industries in the UAE do you work with?',
    'Oil and gas, water and wastewater treatment, food and beverage, pharmaceuticals, power generation, and general industrial manufacturing across Dubai, Sharjah, Abu Dhabi, and the Northern Emirates.',
  ],
  [
    'How do you decide between a retrofit and a full system replacement?',
    'It comes down to the condition of the existing hardware and how well it can support your current and near-future production needs. We assess this during the site audit and give you a straightforward recommendation, including the cost and lead-time trade-offs of each option.',
  ],
]

const run = async () => {
  const payload = await getPayload({ config })

  const layout = [
    // --- Hero -----------------------------------------------------------
    {
      blockType: 'hero',
      variant: 'centered',
      heading: 'Industrial Automation Engineering Company *in UAE*',
    },

    // --- Intro ----------------------------------------------------------
    {
      blockType: 'richText',
      width: 'prose',
      content: doc(
        paragraph(
          "General Tech Automation is a dedicated industrial automation engineering company in UAE, built to help manufacturers, process plants, and utilities move from manual operations to intelligent, connected production. As the automation engineering division backed by General Tech's 28+ years of industrial calibration and instrumentation heritage since 1998, we design, program, and commission control systems that keep UAE industries running safely, efficiently, and around the clock. Every plant we work with has its own history of quick fixes, undocumented changes, and equipment from different eras — our job is to bring that back under one coherent, well-documented system.",
        ),
        paragraph(
          'Industrial facilities across Dubai, Sharjah, Abu Dhabi, and the wider GCC face the same pressure: aging control systems, rising energy costs, and the need for real-time visibility into production. Plant managers are expected to do more with fewer people while keeping legacy machinery running and planning for a more connected future. General Tech Automation was created to answer that pressure directly, with a team that specializes exclusively in automation engineering rather than treating it as a side offering.',
        ),
      ),
    },

    // --- CTA 1 ----------------------------------------------------------
    {
      blockType: 'cta',
      heading: 'Talk to an automation engineer about *your plant*',
      actions: [callAction(`Call ${PHONE}`)],
    },

    // --- Who We Are -----------------------------------------------------
    // Sticky heading beside the copy, with each paragraph numbered — four dense
    // paragraphs read as four points rather than one block of text.
    {
      blockType: 'richText',
      layout: 'split',
      eyebrow: 'Company overview',
      heading: 'Who We *Are*',
      numbered: true,
      content: doc(
        paragraph(
          'General Tech Automation is the specialist automation engineering arm of General Tech, a UAE company established in 1998 with a long-standing reputation in industrial calibration, testing, and equipment supply. That heritage means our engineers work alongside instrumentation specialists who understand sensors, drives, and measurement accuracy at a component level, not just at the software layer — a combination few automation providers in the region can offer.',
        ),
        paragraph(
          "Our team holds hands-on experience across Siemens, Allen-Bradley, Schneider Electric, Mitsubishi, DeltaV, and ABB platforms, allowing us to support multi-vendor plants without forcing a client into a single ecosystem. Every project is scoped by a qualified automation engineer who visits the site, reviews the existing control setup, and designs a solution around the plant's real operating conditions, not a generic template. Cost is usually one of the first questions a plant manager asks, and the honest answer is that it depends heavily on scope — a single-machine logic rewrite is a very different project from a plant-wide control architecture. What we can promise is a transparent quotation after the initial site audit, with the reasoning behind each line item explained, rather than a flat number with no breakdown.",
        ),
        paragraph(
          "We focus on the engineering side of automation — design, build, and commissioning of new control systems and greenfield projects — while working alongside General Tech's wider technical network for equipment supply, calibration, and component-level repair when a project calls for it. This division of focus means our engineers can dedicate their time to design quality and project delivery, rather than spreading attention across sales, repairs, and unrelated technical services in the same week.",
        ),
        paragraph(
          "Documentation is treated as part of the deliverable, not an afterthought. Every project follows a consistent internal standard for drawings, tag naming, and program structure, regardless of which platform it's built on — so one engineer can pick up another's project, and your own maintenance team can open a program years later and understand it without a handover call. Control panels are built and labelled to recognized electrical standards, and any on-site changes are reflected back into the as-built drawings before a project is closed out.",
        ),
      ),
    },

    // --- Services -------------------------------------------------------
    {
      blockType: 'featureGrid',
      heading: 'Our Automation Engineering *Services*',
      intro:
        'Our engineers are trained across the major automation platforms used in UAE industry — Siemens SIMATIC and TIA Portal, Allen-Bradley ControlLogix and CompactLogix, Schneider Electric Modicon, Mitsubishi FX and iQ-series controllers, ABB drives and control systems, and Emerson DeltaV for distributed control environments. Working across this range means we can support a plant exactly as it exists today, rather than requiring a client to standardize on one vendor before we can help.',
      display: 'carousel',
      features: SERVICES,
    },

    // --- Industries -----------------------------------------------------
    // The approved passage is one 250-word paragraph naming six sectors; it is
    // split onto one card per sector so a plant manager can find their own
    // industry at a glance, with every sentence kept as written.
    {
      blockType: 'industries',
      eyebrow: 'Who we work with',
      heading: 'Industries We *Serve*',
      intro:
        'We support automation engineering projects across oil and gas, water and wastewater treatment, food and beverage manufacturing, pharmaceuticals, power generation, and general industrial manufacturing throughout the UAE.',
      sectors: INDUSTRY_SECTORS.map(([name, iconName, description]) => ({
        name,
        iconName,
        description,
      })),
      footnote:
        "Each industry brings its own compliance requirements and process risks, and our engineers scope every project accordingly rather than applying a one-size-fits-all design pulled from an unrelated client's job.",
    },

    // --- Coverage -------------------------------------------------------
    // The approved passage names the areas in prose; the block lists them as
    // their own rows so the section shows the coverage at a glance, with the
    // copy kept word for word underneath.
    {
      blockType: 'coverage',
      eyebrow: 'Where we work',
      heading: 'Service Coverage Across the *UAE*',
      tone: 'dark',
      note: 'Our engineers are based in the UAE — on-site within hours, not days.',
      areas: COVERAGE_AREAS.map(([name, note]) => ({ name, note })),
      content: doc(
        paragraph(
          'Our engineers are based in the UAE and can be on-site within hours rather than coordinating a project remotely from another region — often the difference between a minor delay and a costly production stoppage. Automation projects rarely go exactly to plan: a cable route that looked clear on a drawing turns out to be blocked, a legacy PLC has undocumented logic from a previous contractor, or a shutdown window gets compressed at the last minute. Being close to the plant, and staying reachable for the life of the system rather than just the length of the initial project, is what keeps a control system maintainable years after it was first commissioned.',
        ),
        paragraph(
          "We support projects across Dubai, Sharjah, Abu Dhabi, and the Northern Emirates, and the plants who benefit most from a dedicated engineering partner are often mid-sized manufacturers who have outgrown ad-hoc fixes but don't have the internal headcount to run a full in-house controls department. For these clients, we effectively act as an extension of their own maintenance and engineering team.",
        ),
      ),
    },

    // --- Process --------------------------------------------------------
    {
      blockType: 'processSteps',
      eyebrow: 'How we work',
      heading: 'Our Automation Engineering *Process*',
      steps: PROCESS_STEPS.map(([title, description]) => ({ title, description })),
    },

    // --- CTA 2 ----------------------------------------------------------
    {
      blockType: 'cta',
      variant: 'compact',
      eyebrow: 'Retrofit or rebuild',
      heading: 'Not sure whether you need a retrofit or a *full rebuild?*',
      actions: [callAction(`Get a free site assessment — Call ${PHONE}`)],
    },

    // --- Why choose us --------------------------------------------------
    // The one dark band between the process and the FAQ. The approved copy is
    // unchanged; it is split across three titled columns so the section can be
    // scanned by a plant manager who will not read 450 words end to end.
    {
      blockType: 'whyUs',
      eyebrow: 'Why choose us',
      heading: 'Why Choose *General Tech Automation*',
      intro:
        'One specialist team, one point of accountability, and a control system your own engineers can still read years after commissioning.',
      proofs: [
        { value: '28+', label: 'Years of UAE industrial heritage' },
        { value: '6', label: 'Control platforms supported in-house' },
        { value: '1', label: 'Engineer from site visit to handover' },
        { value: '0', label: 'Vendor lock-in — the drawings are yours' },
      ],
      pillars: [
        {
          title: 'Automation engineering is all we do',
          body:
            "Most automation providers in the UAE split their attention across product distribution, general engineering, and one-off projects. General Tech Automation exists purely as an automation engineering specialist, backed by General Tech's 28-year track record of industrial credibility in the region. That focus means faster response times, engineers who understand both the control logic and the physical equipment behind it, and a single point of accountability from design through commissioning to long-term support. Safety documentation is treated with the same discipline: emergency stop circuits are tested as part of every commissioning checklist, which matters most in regulated industries such as pharmaceuticals and oil and gas, where a system needs to be defensible during an audit, not just functional on the day it's switched on.",
        },
        {
          title: 'Multi-vendor by design, documented for your team',
          body:
            "We also work as a true multi-vendor integrator. Rather than pushing one brand, we recommend and build on the platform that genuinely fits your plant — Siemens, Allen-Bradley, Schneider Electric, Mitsubishi, ABB, or an existing DeltaV environment — so you're never locked into hardware that doesn't suit your process or your existing spares inventory. Every project leaves you with as-built drawings, tag lists, and program backups, so the system stays maintainable by your own team, or by us, long after commissioning — a small detail that saves real time and money the next time something needs to change.",
        },
        {
          title: 'An honest assessment before a quotation',
          body:
            "Clients typically come to us at one of two points: either a system has already failed and production is stopped, or a plant manager is planning ahead and wants to avoid reaching that point. Both conversations start the same way — with a site visit and an honest assessment of what's actually needed, not a pitch for the most expensive option available. If a smaller retrofit will solve the problem, that's what we'll recommend; if the underlying hardware genuinely needs replacing, we'll explain why before any quotation is issued. Throughout a project, you'll have one engineer who understands your system from the first visit through to final handover, rather than being passed between departments — which matters most during commissioning, when questions need fast answers.",
        },
      ],
    },

    // --- FAQ ------------------------------------------------------------
    {
      blockType: 'faq',
      heading: 'Frequently Asked *Questions*',
      items: FAQS.map(([question, answer]) => ({
        question,
        answer: doc(paragraph(answer!)),
      })),
    },

    // --- Closing CTA ----------------------------------------------------
    // The assessment pitch and the closing call sit in one dark section so the
    // page ends on a single ask rather than two stacked ones.
    {
      blockType: 'cta',
      eyebrow: 'Get an automation engineering assessment',
      heading: 'Speak with an automation engineer *today*',
      body: "If your current control systems are holding back production, visibility, or reliability, General Tech Automation can assess your plant and recommend a practical path forward, whether that's a new control system build, a retrofit, or an ongoing maintenance contract. A short site visit is usually enough to tell you which option makes sense, and what it will cost, before any commitment is made.",
      actions: [callAction(`Call ${PHONE}`)],
    },
  ]

  const data = {
    title: 'Industrial Automation Engineering Company in UAE',
    slug: 'home',
    _status: 'published' as const,
    // The blocks above are authored by hand; Payload's generated union expects
    // every optional field on every member, so assert rather than restate them.
    layout: layout as unknown as Page['layout'],
    meta: {
      title: 'Industrial Automation Engineering Company in UAE',
      description:
        'General Tech Automation delivers PLC logic design, control architecture, HMI development and Industry 4.0 engineering across the UAE. Call +971 6 543 6933.',
    },
  }

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    draft: true,
  })

  if (found.docs.length > 0) {
    await payload.update({ collection: 'pages', id: found.docs[0]!.id, data })
    payload.logger.info('Updated the home page with the approved automation copy')
  } else {
    await payload.create({ collection: 'pages', data })
    payload.logger.info('Created the home page with the approved automation copy')
  }

  // The header strip, the WhatsApp button and the footer all read the phone
  // number from Site Settings. Merge so the rest of the global is untouched.
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...settings,
      contact: { ...(settings.contact ?? {}), phone: PHONE },
    },
  })

  payload.logger.info('Done')
}

await run()
process.exit(0)
