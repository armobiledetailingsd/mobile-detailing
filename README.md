# Mobile Tires — Developer Onboarding

Marketing site built on Next.js 15 + Sanity Studio v5 + Storybook, wired as a pnpm + Turborepo monorepo. Includes live preview, the Sanity Presentation tool, SEO foundations, and a Studio structure pattern ready for editors.

> Read [CLAUDE.md](./CLAUDE.md) for full conventions — schema layout, TypeGen workflow, atomic component layers, and common gotchas. Read it before making any changes.

---

## Prerequisites

- **Node 22 LTS** — use `nvm use` (`.nvmrc` is in the repo root)
- **pnpm 10** — `npm install -g pnpm@10`
- Access to the **Sanity project** — ask a teammate for the project ID and a Viewer-role API token
- Access to this **GitHub repo** — request from a repo admin if you can't clone it

---

## First-time setup

### 1. Clone the repo

```bash
git clone git@github.com:aronmobiletires/mobile-tires.git
cd mobile-tires
```

### 2. Set up environment variables

```bash
cp apps/studio/.env.example apps/studio/.env
cp apps/web/.env.example apps/web/.env.local
```

Fill in both files with the real project values. Ask a teammate for the Sanity project ID and read token if you don't have them.

**`apps/web/.env.local`**

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (from sanity.io/manage) |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | GROQ API date pin — don't change unless bumping |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `http://localhost:3333` for local dev |
| `SANITY_API_READ_TOKEN` | Viewer-role token — required for draft preview (see below) |

**Generating `SANITY_API_READ_TOKEN`**

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and open the project
2. Navigate to **API → Tokens**
3. Click **Add API token**
4. Name it something like `web-preview-<your-name>` so it's identifiable
5. Set permissions to **Viewer**
6. Click **Save** and copy the token immediately — it won't be shown again
7. Paste it as `SANITY_API_READ_TOKEN` in `apps/web/.env.local`

Each developer should generate their own token. Do not share or commit tokens.

**`apps/studio/.env`**

| Variable | What it is |
|---|---|
| `SANITY_STUDIO_PROJECT_ID` | Same project ID as above |
| `SANITY_STUDIO_DATASET` | Usually `production` |
| `SANITY_STUDIO_TITLE` | Browser tab label (e.g. `Mobile Tires`) |
| `SANITY_STUDIO_PREVIEW_URL` | `http://localhost:3000` for local dev |

### 3. Install dependencies

```bash
nvm use
pnpm install
```

### 4. Start the dev servers

```bash
pnpm dev:web       # Next.js → http://localhost:3000
pnpm dev:studio    # Sanity Studio → http://localhost:3333
```

Storybook is separate (not started by `pnpm dev`):

```bash
pnpm storybook     # → http://localhost:6006
```

If you hit port conflicts: `pkill -9 -f "next-server"` and `pkill -9 -f "sanity dev"`.

---

## Stack

| Tool | Version | Notes |
|---|---|---|
| Next.js | **15.x** | Locked — don't upgrade to 16. Known prefetch-cascade issue with next-sanity multiplies requests 4–10×. |
| React | 19.x | |
| Sanity Studio | 5.x | Standalone at `apps/studio` |
| next-sanity | 11.x | Pairs with Next 15 lock |
| Storybook | 10.x | Vite-based, lives inside `apps/web` |
| Tailwind CSS | 4.x | CSS-first config via `@theme` in `globals.css` |
| TypeScript | 5.x | |
| Turborepo | 2.x | |
| pnpm | 10.x | |
| Node | 22 LTS | Use `nvm use` |

---

## Repository layout

```
.
├── apps/
│   ├── web/                    # Next.js 15 frontend + Storybook
│   │   └── src/
│   │       ├── app/            # Routes, robots.ts, sitemap.ts, draft-mode API
│   │       ├── components/     # Atomic design system
│   │       │   ├── atoms/
│   │       │   ├── molecules/
│   │       │   ├── organisms/  # SiteHeader, SiteFooter, etc.
│   │       │   ├── sections/   # Page-level sections (richText, hero, etc.)
│   │       │   └── components/
│   │       ├── lib/sanity/     # client, live, queries, image, dataAttribute
│   │       ├── middleware.ts   # Sanity-backed redirects
│   │       └── sanity.types.ts # GENERATED — do not edit by hand
│   └── studio/                 # Sanity Studio v5
│       ├── schemas/
│       │   ├── documents/      # websitePage, siteSettings, header/footer nav, redirect
│       │   ├── objects/        # seo, pageSettings, link
│       │   └── sections/       # richText (more to come)
│       └── structure/          # Custom Structure Builder
└── packages/                   # Reserved for future shared packages
```

---

## Common commands

```bash
pnpm build                          # Build everything
pnpm check-types                    # Type-check all workspaces
pnpm lint                           # Lint all workspaces
pnpm format                         # Prettier across the repo
pnpm --filter studio typegen:all    # Regenerate Sanity types after schema changes
```

---

## Sanity TypeGen — don't skip this

After **any** schema change or new GROQ query, regenerate types:

```bash
pnpm --filter studio typegen:all
```

Commit the resulting `apps/web/src/sanity.types.ts` alongside your schema/query changes. CI type-check failures are almost always a missed typegen run.

---

## Live preview and Presentation tool

- `SanityLive` in `layout.tsx` opens a real-time SSE connection for content updates
- `VisualEditing` renders only when draft mode is active — gives clickable overlays inside Sanity's Presentation tool iframe
- Editors click "Open Preview" in the Studio to get a split-pane editing experience
- `SANITY_API_READ_TOKEN` is required for draft content. Without it, Presentation only shows published content.

---

## Git workflow

- **Never commit directly to `main`** — a pre-commit hook blocks it
- Branch naming: `feat/<description>` or `fix/<description>`
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `style:`
- Open a PR and get a review before merging

---

## Deployment

Two separate Vercel projects from the same repo:

| Project | Root Directory | Notes |
|---|---|---|
| Web | `apps/web` | Vercel auto-detects Next.js |
| Studio | `apps/studio` | `vercel.json` configures `sanity build` + SPA rewrites |

**Web project env vars** (set in Vercel UI):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `SANITY_API_READ_TOKEN` (Viewer-role, server-only)

**Studio project env vars**:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_PREVIEW_URL` (deployed web URL)
- `SANITY_STUDIO_TITLE`

**Sanity CORS origins** — add in [sanity.io/manage](https://www.sanity.io/manage) → API → CORS (with credentials enabled):

- `http://localhost:3000`
- Deployed web Vercel URL
- Production custom domain

---

## Adding a new page section

Three files are always required:

1. `apps/studio/schemas/sections/<name>/index.ts` — schema definition
2. Register in `apps/studio/schemas/sections/index.ts`
3. Add a case to `apps/web/src/components/sections/Sections.tsx`
4. Add the array member to `websitePage` schema so editors can pick it

Then run `pnpm --filter studio typegen:all` and commit the updated types.
# mobile-detailing
