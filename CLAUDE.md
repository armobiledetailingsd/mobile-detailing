# CLAUDE.md

Conventions for working in this repo. Read this before making changes — it captures decisions that aren't obvious from the code alone.

## What this is

A starter for Webstacks marketing sites built on Next.js 15 + Sanity Studio v5, wired together as a pnpm + Turborepo monorepo. Pre-baked with live preview, the Sanity Presentation tool, SEO foundations, and a structure builder pattern ready for editors.

After cloning this starter for a new project, fill in the env vars (see [README.md](./README.md)), update `package.json` metadata, and you're ready to build.

## Stack

| Tool | Version | Notes |
|---|---|---|
| Next.js | **15.x** | Locked. Don't upgrade to 16 yet — next-sanity has a known prefetch-cascade issue that multiplies request volume 4–10×. Re-evaluate when Sanity ships the fix. |
| React | 19.x | |
| Sanity Studio | 5.x | Standalone at `apps/studio` (not embedded in Next) |
| next-sanity | 11.x | Pairs with Next 15 lock |
| Storybook | 10.x | Vite-based, lives inside `apps/web` |
| Tailwind CSS | 4.x | CSS-first config via `@theme` block in `globals.css` |
| TypeScript | 5.x | |
| Turborepo | 2.x | |
| pnpm | 10.x | |
| Node | 22 LTS | Use `nvm use` — see `.nvmrc` |

## Repository layout

```
.
├── apps/
│   ├── web/                          # Next.js 15 frontend + Storybook
│   │   └── src/
│   │       ├── app/                  # App Router
│   │       │   ├── [[...slug]]/      # catch-all page route
│   │       │   ├── api/draft-mode/   # draft mode toggle routes
│   │       │   ├── robots.ts
│   │       │   ├── sitemap.ts
│   │       │   └── layout.tsx        # fetches header/footer, renders SanityLive + VisualEditing
│   │       ├── components/
│   │       │   ├── atoms/            # tokens, primitives
│   │       │   ├── molecules/        # buttons, badges, inputs
│   │       │   ├── organisms/        # SiteHeader, SiteFooter, nav
│   │       │   ├── sections/         # page-level sections (richText, hero, etc.)
│   │       │   └── components/       # composed sections
│   │       ├── lib/sanity/
│   │       │   ├── client.ts         # base client (perspective: 'published', useCdn)
│   │       │   ├── live.ts           # defineLive — sanityFetch + SanityLive
│   │       │   ├── image.ts          # urlForImage helper
│   │       │   ├── dataAttribute.ts  # createDocDataAttribute for visual editing
│   │       │   └── queries/          # one file per concern (page, global, redirects)
│   │       ├── middleware.ts         # Sanity-backed redirects with 60s TTL cache
│   │       └── sanity.types.ts       # GENERATED — do not edit by hand
│   └── studio/                       # Sanity Studio v5
│       ├── schemas/
│       │   ├── documents/            # websitePage, siteSettings, headerNav, footerNav, redirect
│       │   ├── objects/              # seo, pageSettings, link
│       │   └── sections/             # richText (more to come)
│       ├── structure/                # Custom Structure Builder
│       └── sanity-typegen.json       # TypeGen config (paths into apps/web)
└── packages/                         # Reserved for future shared packages (empty for now)
```

## Sanity conventions

### Schema folder structure

- `documents/<name>/index.ts` — document types (`_type` is a top-level Sanity doc)
- `objects/<name>/index.ts` — reusable object types embedded in docs
- `sections/<name>/index.ts` — page-section object types referenced from `websitePage.sections[]`

Each folder has an `index.ts` barrel that re-exports the named type. Top-level `schemas/index.ts` composes everything into `schemaTypes`.

### Singletons

Singletons (Homepage, Site Settings, Header Navigation, Footer Navigation) are pinned to predictable document IDs. The IDs live in `apps/studio/structure/index.ts` as `SINGLETON_IDS`. Mirror these on the web side when a query needs them (see `HOMEPAGE_ID` in `queries/page.ts`).

**The homepage singleton's `slug` field is unused for routing** — the route fetches it by ID. The slug can be anything; ignore it.

### TypeGen — the single most easily-forgotten step

After **any** schema change (doc type, object type, field), or **any** new GROQ query, regenerate types:

```bash
pnpm --filter studio typegen:all
```

This runs `sanity schema extract` followed by `sanity typegen generate`. Output goes to `apps/web/src/sanity.types.ts` (committed).

**Commit the regenerated types alongside the schema/query changes.** Type-check failures in CI are almost always "forgot to run typegen."

### Query patterns

- **In route handlers / page components** (have request context): use `sanityFetch` from `@/lib/sanity/live`. This handles draft mode + live revalidation tags automatically.
- **In `generateStaticParams`, `sitemap.ts`, `middleware.ts`** (no request context): use raw `client.fetch` from `@/lib/sanity/client`. `sanityFetch` calls `draftMode()` internally, which throws outside a request.

Always pass revalidation `tags` to `sanityFetch` so on-demand revalidation can target them when the webhook is wired up.

### Live preview vs Presentation

- `SanityLive` in `layout.tsx` opens an SSE connection for real-time content updates (works without a token, published content only)
- `VisualEditing` renders only when `draftMode.isEnabled` — gives clickable overlays inside Sanity's Presentation tool iframe
- Presentation tool is wired in `sanity.config.ts` — editors click "Open Preview" in Studio to get split-pane editing
- A `SANITY_API_READ_TOKEN` (Viewer role) in `apps/web/.env.local` is required to fetch draft content. Without it, Presentation still works but only shows published content.
- Data attributes (`createDocDataAttribute`) on the page/header/footer make Presentation's "Documents on this page" panel populate. Add similar attrs as you build more components.

### Sanity CORS

Every web origin that needs to talk to Sanity (Live API, draft mode) must be in the project's CORS allowlist (sanity.io/manage → API → CORS). Common entries:

- `http://localhost:3000` (with credentials) — local dev
- `https://<your-web>.vercel.app` (with credentials) — preview deploys
- Production custom domain (with credentials)

Without credentials enabled, draft preview cookies don't travel cross-origin and Presentation falls back to published content only.

## Web app conventions

### Atomic design layers

Components live in `apps/web/src/components/<layer>/<ComponentName>/`:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.stories.tsx    # optional, recommended
└── index.ts                     # barrel export
```

Layers (loosest → tightest coupling to page context):
1. **atoms** — design tokens consumed as primitives (Button, Heading, Icon)
2. **molecules** — small compositions (FormField, CardLink)
3. **organisms** — large reusable chrome (SiteHeader, SiteFooter, MainNav)
4. **sections** — page-level slices fetched from Sanity (RichText, Hero, Switchback)
5. **components** — fully composed feature areas

Section renderers must be discoverable by the dispatcher in `Sections.tsx`. Add new section types there.

### Storybook

Lives inside `apps/web`. Run with `pnpm storybook` (port 6006). Stories auto-discover from `apps/web/src/components/**/*.stories.@(ts|tsx|mdx)`. Storybook does **not** start with `pnpm dev` — keep it separate so the default dev flow stays fast.

### Tailwind v4

Tokens go in `@theme` blocks in `apps/web/src/app/globals.css`, **not** in a `tailwind.config.js`. Drop colors, type ramps, and spacing scales there once design ships tokens.

## Git conventions

- **Always work from a feat/ or fix/ branch.** A local hook refuses commits directly on `main`.
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `style:`
- Atomic commits — logical, focused changes
- No `Co-Authored-By` lines, no "generated by Claude" attributions
- No em dashes in commit messages, PR descriptions, or Slack messages

## Common gotchas

- **`sanityFetch` outside request context throws.** Use `client.fetch` for `generateStaticParams`, `sitemap.ts`, `middleware.ts`.
- **Forgetting to re-run typegen.** Schema changes need `pnpm --filter studio typegen:all`. Commit the resulting `sanity.types.ts` change.
- **Adding a new section schema means three files.** (1) studio schema, (2) register in `sections/index.ts`, (3) add case to web `Sections.tsx` dispatcher. (4) Don't forget the array member in `websitePage` schema if you want it pickable.
- **Don't put generated `_type`-tagged types in manual code.** Always import from `@/sanity.types`.
- **Sanity Studio won't boot without env.** `SANITY_STUDIO_PROJECT_ID` is required (the studio config throws on startup if missing). Same for the web app: `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- **Stale dev servers.** When ports collide, `pkill -9 -f "next-server"` and `pkill -9 -f "sanity dev"` clear them.

## Don'ts

- Don't push or commit directly to `main`
- Don't upgrade Next.js to 16 (see stack table)
- Don't edit `apps/web/src/sanity.types.ts` by hand
- Don't add components without picking the right atomic layer first
- Don't bypass the structure builder by adding singletons without IDs in `SINGLETON_IDS`
- Don't hardcode the Sanity project ID anywhere — read it from env, throw on missing
