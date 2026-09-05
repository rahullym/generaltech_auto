/**
 * Brings the live generaltechautomation.ae site's identity into the CMS:
 * the logo, the homepage photography, the brand wall, and the nav/footer
 * structure. Body copy is NOT touched — that comes from seed-homepage.ts.
 *
 * Run with:  pnpm --filter cms seed:chrome
 * Idempotent: media is matched by filename, globals are overwritten.
 */
import fs from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '../payload-types'

/** Where the assets pulled from the live site were staged. */
const ASSETS =
  process.env.ASSET_DIR ??
  '/private/tmp/claude-501/-Users-rahul-generaltechautomation/621c0732-f02a-42f3-b123-1add64a6331d/scratchpad/live-assets'

/**
 * The Services menu: the approved label, and the permalink the page actually
 * lives at. The paths are not uniform — each service page uses the permalink
 * its own source document specifies, so some sit at the root and some under
 * /service/ — which is why the whole path is written out rather than built
 * from a slug. The old paths still resolve, but they redirect, and the menu
 * should not spend a hop on every click.
 */
const SERVICES = [
  ['Annual Maintenance Contracts (AMC Services )for Panels, VFD, UPS & Servo Drives', '/amc-services-panels-vfd-ups-servo-drives-uae'],
  ['Asset Data Management', '/asset-data-management-services-uae'],
  ['Automation Solutions', '/industrial-automation-solutions-uae'],
  ['CNC Machine Repair Services', '/service/cnc-machine-repair-services-uae'],
  ['Commissioning & Start Up - Measurement', '/service/measurement-commissioning-start-up-services-uae'],
  ['Custom Panel Design & Manufacturing', '/service/custom-control-panel-design-manufacturing-uae'],
  ['Digital Transformation', '/service/digital-transformation-services-uae'],
  ['Field Instrumentation Services and Support', '/service/field-instrumentation-services-and-support-uae'],
  ['IoT Services', '/service/industrial-iot-services-uae'],
  ['Main Instrument Supplier', '/service/main-instrument-supplier-uae'],
  ['Measurement Preventative Services', '/service/measurement-preventative-services-uae'],
  ['PLC Maintenance Troubleshooting', '/plc-maintenance-and-troubleshooting-services-uae'],
  ['PLC Programming', '/plc-programming-services-uae'],
  ['Repair Services', '/industrial-repair-services-uae'],
  ['Retrofit Solutions', '/industrial-retrofit-solutions-uae'],
  ['Wireless Plant Network Support', '/wireless-plant-network-support-uae'],
] as const

const QUICK_LINKS = [
  ['About Us', '/about_us'],
  ['Products', '/products'],
  ['Brands', '/brands'],
  ['Services', '/services'],
  ['Applications', '/applications'],
  ['Contact Us', '/contact_us'],
] as const

/** Turns a brand filename into a readable name: MICRO-DETECTORS -> Micro Detectors. */
const brandName = (file: string) =>
  path
    .basename(file, path.extname(file))
    .split(/[-_]/)
    .map((word) =>
      word.length <= 3 ? word.toUpperCase() : word[0]!.toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ')

const run = async () => {
  const payload = await getPayload({ config })

  /** Uploads a file once; re-running reuses the existing document. */
  const upload = async (file: string, alt: string): Promise<Media> => {
    const filename = path.basename(file)

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) return existing.docs[0] as Media

    return (await payload.create({
      collection: 'media',
      data: { alt },
      filePath: file,
    })) as Media
  }

  // --- Logo + photography ----------------------------------------------
  const logo = await upload(`${ASSETS}/logo-dark1.png`, 'General Tech Automation')
  const logoLight = await upload(`${ASSETS}/logo-light.png`, 'General Tech Automation')
  const heroImage = await upload(
    `${ASSETS}/industrial-slider.jpg`,
    'Industrial plant floor with automated production line',
  )
  const heroDigital = await upload(
    `${ASSETS}/digital-bg.jpg`,
    'Connected plant data visualised over a factory floor',
  )
  const panelInspection = await upload(
    `${ASSETS}/panel-inspection.jpg`,
    'Engineer thermal-imaging a live control panel on site',
  )
  const boardRepair = await upload(
    `${ASSETS}/board-repair.jpg`,
    'Technician soldering a component onto an industrial drive control board',
  )
  const deltaVImage = await upload(
    `${ASSETS}/DeltaV.jpg`,
    'Distributed control system operator workstation',
  )

  payload.logger.info('Uploaded logo and photography')

  // --- Brand wall -------------------------------------------------------
  const brandDir = `${ASSETS}/brands`
  const brandFiles = fs.existsSync(brandDir)
    ? fs.readdirSync(brandDir).filter((f) => !f.startsWith('.')).sort()
    : []

  const brands: { image: number | string; name: string }[] = []
  for (const file of brandFiles) {
    const name = brandName(file)
    const media = await upload(`${brandDir}/${file}`, `${name} logo`)
    brands.push({ image: media.id, name })
  }

  payload.logger.info(`Uploaded ${brands.length} brand logos`)

  // --- Site settings ----------------------------------------------------
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...settings,
      siteName: 'General Tech Automation',
      // The demo tagline from the original seed is not part of the brand.
      tagline: null,
      logo: logo.id,
      logoInverse: logoLight.id,
      contact: {
        email: 'mathews@generaltechuae.com',
        phone: '+971 6 543 6933',
        address: 'P.O. Box: 25898\nSharjah, U A E',
      },
    },
  })

  // --- Header -----------------------------------------------------------
  const custom = (label: string, url: string) => ({
    link: { type: 'custom' as const, label, url },
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        custom('Home', '/'),
        custom('About us', '/about_us'),
        custom('Products', '/products'),
        custom('Brands', '/brands'),
        {
          ...custom('Services', '/services'),
          children: SERVICES.map(([label, url]) => custom(label, url)),
        },
        custom('Applications', '/applications'),
        custom('Contact us', '/contact_us'),
      ],
      ctas: [
        {
          link: {
            type: 'custom' as const,
            label: 'Get A Free Quote',
            url: '/contact_us',
            appearance: 'primary' as const,
          },
        },
      ],
    },
  })

  // --- Footer -----------------------------------------------------------
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Quick Links',
          links: QUICK_LINKS.map(([label, url]) => custom(label, url)),
        },
        {
          title: 'Services',
          links: SERVICES.slice(0, 8).map(([label, url]) => custom(label, url)),
        },
        {
          title: 'More Services',
          links: SERVICES.slice(8).map(([label, url]) => custom(label, url)),
        },
      ],
      copyright: '© 2024 Copyright ® All Rights Reserved. General Tech Services LLC.',
    },
  })

  payload.logger.info('Updated site settings, header and footer')

  // --- Wire the imagery + brand wall into the homepage ------------------
  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    draft: true,
  })

  const page = home.docs[0]
  if (!page) {
    payload.logger.warn('No home page found — run `pnpm --filter cms seed:home` first')
    process.exit(0)
  }

  const layout = (page.layout ?? []) as any[]

  // The hero becomes a full-screen banner: crossfading plant photography, the
  // approved strapline, both calls to action, and the partner marquee.
  const hero = layout.find((block) => block.blockType === 'hero')
  if (hero) {
    hero.variant = 'banner'
    hero.eyebrow = 'Industrial Automation Engineering'
    hero.subheading =
      'General Tech Automation delivers PLC logic design, control architecture, HMI development and Industry 4.0 engineering across the UAE.'
    hero.image = heroImage.id
    hero.images = [heroImage, heroDigital, deltaVImage].map((media) => ({ image: media.id }))
    hero.marqueeLogos = brands.map((brand) => ({ image: brand.image }))
    hero.actions = [
      {
        link: {
          type: 'custom',
          label: 'Call +971 6 543 6933',
          url: 'tel:+97165436933',
          appearance: 'primary',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Get A Free Quote',
          url: '/contact_us',
          appearance: 'secondary',
        },
      },
    ]
  }

  const indexOf = (predicate: (block: any) => boolean) => layout.findIndex(predicate)

  // The opening two paragraphs become an editorial section: a photo collage
  // beside the copy, with the first paragraph set as a standfirst.
  const intro = layout.find(
    (block) =>
      block.blockType === 'richText' &&
      JSON.stringify(block.content).includes('is a dedicated industrial automation'),
  )
  if (intro) {
    intro.layout = 'editorial'
    intro.mediaPosition = 'left'
    intro.lede = true
    intro.collapsible = true
    intro.media = [{ image: panelInspection.id }, { image: boardRepair.id }]
  }

  // The homepage carries no standalone photography any more. The full-bleed
  // banner went first (it stacked a second large photograph right under the
  // intro collage), and the contained DeltaV shot above Service Coverage went
  // with it — the coverage section now holds the screen on its own, and a
  // photograph directly above it only pushed it off. The photo still appears
  // in the hero rotation.
  for (let i = layout.length - 1; i >= 0; i -= 1) {
    if (layout[i]?.blockType === 'media') layout.splice(i, 1)
  }

  // The brand wall sits before the FAQ, as "Our Brands" does on the live site.
  if (brands.length && !layout.some((block) => block.blockType === 'logoWall')) {
    const faq = indexOf((block) => block.blockType === 'faq')
    const at = faq > 0 ? faq : layout.length
    layout.splice(at, 0, {
      blockType: 'logoWall',
      eyebrow: 'Authorized Partners',
      heading: 'Our *Brands*',
      logos: brands,
    })
  }

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout },
  })

  payload.logger.info('Homepage now carries the logo, photography and brand wall')
}

await run()
process.exit(0)
