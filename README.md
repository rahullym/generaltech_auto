# General Tech Automation

Marketing site, blog and documentation built on **Astro 7** (frontend) and
**Payload 3** (CMS), in a pnpm workspace.

## Architecture

```
apps/
  cms/    Payload 3.88 on Next.js 16 — admin panel + REST/GraphQL API
  web/    Astro 7 — SSR frontend, consumes the CMS over REST
```

Payload's admin panel is a Next.js app, so it cannot run inside Astro. The two
apps deploy independently; Astro talks to Payload over HTTP.

| | URL (dev) |
|---|---|
| Website | http://localhost:4331 |
| Admin panel | http://localhost:3010/admin |
| REST API | http://localhost:3010/api |
| GraphQL | http://localhost:3010/api/graphql |

## Getting started

```bash
# 1. Database
pnpm db:up                    # Postgres 17 in Docker on :5434

# 2. Environment
cp .env.example apps/cms/.env
cp .env.example apps/web/.env
openssl rand -base64 32       # paste into PAYLOAD_SECRET in apps/cms/.env
# Use the same PAYLOAD_PREVIEW_SECRET value in both .env files.

# 3. Install, migrate, seed, run
pnpm install
pnpm --filter cms migrate     # apply the initial schema
pnpm --filter cms seed        # demo content + admin user
pnpm dev                      # starts both apps
```

The seed creates `admin@example.com` / `changeme123` — change it before
deploying anywhere. Override with `SEED_EMAIL` and `SEED_PASSWORD`.

Open http://localhost:3010/admin to edit, http://localhost:4331 to view.

### Ports

`3000`, `4321` and `5432` were already in use on the original dev machine, so
this project uses **3010** (CMS), **4331** (web) and **5434** (Postgres).
Change them in `apps/*/package.json`, `docker-compose.yml` and the `.env` files.

### First content

The homepage reads the **Page** with slug `home`. The seed creates it; edit it
in the admin panel and reload the site to see changes immediately (SSR).

## Content model

**Collections**
- `pages` — block-based page builder (Hero, Rich Text, Media, Feature Grid, CTA, FAQ)
- `posts` — blog, with categories, tags, authors and `publishedAt`
- `docs` — self-nesting documentation tree via `parent` + `order`
- `categories`, `media`, `users`

**Globals** — `header`, `footer`, `site-settings`

Pages, posts and docs all have drafts + autosave enabled.

## Draft preview

Payload's Preview button and live-preview iframe point at
`/api/preview?secret=…&path=…` on the Astro app, which validates the shared
secret, sets an httpOnly cookie, and redirects. Routes then read drafts using
`PAYLOAD_API_KEY`.

To enable it:
1. In the admin panel, open a user, tick **Enable API Key**, copy the key.
2. Set `PAYLOAD_API_KEY` in `apps/web/.env`.
3. Set the same `PAYLOAD_PREVIEW_SECRET` in both `.env` files.

Exit preview at `/api/exit-preview`.

## Common tasks

```bash
pnpm dev              # both apps
pnpm dev:cms          # Payload only
pnpm dev:web          # Astro only
pnpm build            # build both apps (no database needed)
pnpm migrate          # apply pending migrations
pnpm typecheck        # every workspace
pnpm generate:types   # regenerate payload-types.ts after schema changes
pnpm --filter cms seed        # re-seed demo content (idempotent)
pnpm --filter cms seed:home   # reload the approved homepage copy (idempotent)
pnpm --filter cms migrate     # apply pending migrations
pnpm --filter cms migrate:fresh --force-accept-warning   # drop + rebuild
```

Scripts run with `payload run` must use **top-level `await`** — `payload run`
exits as soon as module evaluation finishes, so a floating promise is silently
dropped. See `apps/cms/src/seed.ts`.

### Schema changes

In development the Postgres adapter uses `push: true` (gated on
`NODE_ENV=development`), so schema edits apply automatically while `pnpm dev`
runs. Before deploying, capture them as a migration:

```bash
pnpm --filter cms migrate:create
```

The initial schema is committed as `apps/cms/src/migrations/*_initial.ts`.

Migrations are **not** part of `pnpm build` — building must not require a
database. Apply them as a release step instead:

```bash
pnpm build            # compile (no DB)
pnpm migrate          # apply migrations
pnpm --filter cms start
```

`pnpm --filter cms deploy` does the last two together.

> On a machine where you have run `pnpm dev`, Payload records a `dev` row in
> `payload_migrations` and `payload migrate` will interactively warn about
> possible data loss. That prompt does not appear against a database that was
> only ever migrated.

## Design system

The frontend uses the same design language as the generaltech.ae marketing
site, so the two read as one brand.

**Tokens** (`apps/web/src/styles/global.css`)

| | |
|---|---|
| Red | `#ed1c25` — `bg-general-red`, `text-general-red` |
| Black / white | `#000` / `#fff` — `general-black`, `general-white` |
| Body text | `#1a1a1a`, muted copy `text-gray-700` |
| Font | Manrope 300–800 for everything; DM Sans **only** for italics (Manrope has no italic face, so `.italic` swaps the family) |

**Layout rhythm**

- Section: `py-32 px-6 md:px-12`, container `max-w-7xl mx-auto`.
- Eyebrow: a 2px red rule + `text-[11px] font-bold tracking-[0.25em] uppercase`.
- Section heading: `text-4xl sm:text-5xl lg:text-[72px] font-black tracking-tight leading-[0.95]`.
- Cards: `rounded-2xl border border-gray-100`, lifting on hover, with a red rule
  that grows to full width.
- Buttons: `rounded-xl px-8 py-5 text-[13px] font-bold uppercase tracking-[0.1em]`.
- Dark sections (hero, CTA, footer) are pure black with `text-white/50` copy.

**Red italic accent.** Headings set their last words in red DM Sans italic.
Editors mark that part by wrapping it in asterisks:

```
Numbers you can *count on.*
```

`splitAccent()` in `apps/web/src/lib/accent.ts` does the split; a heading with no
asterisks renders entirely in black.

**Motion.** Anything with `.reveal-item opacity-0 translate-y-8` fades up when it
scrolls into view — one IntersectionObserver in `Base.astro` drives them all, and
re-runs after every view transition. Section headers marked `sticky` pin under the
nav and collapse to their title on desktop. Page navigations show a red progress
bar at the top.

**Chrome.** The nav is fixed: a black contact strip over a white header that
shrinks on scroll. Pages that do not open with a dark hero pass nothing and get a
spacer; pages that do pass `heroFirst` to `Base.astro`.

The Payload admin panel picks up Manrope and the red primary button from
`apps/cms/src/app/(payload)/custom.scss`.

## Homepage content

The approved homepage copy ("Industrial Automation Engineering Company in UAE")
lives in `apps/cms/src/scripts/seed-homepage.ts` and is loaded into the `home`
page with `pnpm --filter cms seed:home`. Re-running it replaces the page, so any
edits made in the admin panel are overwritten — edit the script, or drop it, once
the copy is being maintained in the CMS.

Its structured data is separate: `apps/web/src/lib/home-schema.ts` holds the
ProfessionalService + WebPage + FAQPage `@graph` verbatim, rendered into `<head>`
by `pages/index.astro`. Because that graph already declares an FAQPage, the page
passes `faqSchema={false}` to `BlockRenderer` so the FAQ block does not publish a
second, conflicting copy.

An SEO `meta.title` is used as the complete `<title>` (no site-name suffix) via
`exactTitle` on `Base.astro`.

## Adding a block

1. Define it in `apps/cms/src/blocks/` and export it from `blocks/index.ts`.
2. Add it to the `layout` field's `blocks` array in `collections/Pages.ts`.
3. Create the matching component in `apps/web/src/components/blocks/`.
4. Register it in `apps/web/src/components/BlockRenderer.astro`.

An unregistered `blockType` renders nothing and warns in dev.

## Notes

- Rich text is rendered by `apps/web/src/lib/lexical.ts`, a dependency-free
  Lexical → HTML converter. Extend the `switch` in `renderNode` for new node types.
- The frontend uses its own narrow types in `apps/web/src/lib/types.ts` to keep
  templates readable. Payload's exhaustive generated types are in
  `apps/cms/src/payload-types.ts` and can be imported as `@cms/payload-types`.
- `graphql` is pinned to 16.x — Payload's peer range excludes 17.
- Media uploads are written to `apps/cms/media/` and are gitignored. Swap in
  `@payloadcms/storage-s3` before deploying to an ephemeral filesystem.
