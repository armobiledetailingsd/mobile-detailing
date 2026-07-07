# Lean Blog — Design Spec

**Date:** 2026-07-05
**Status:** Approved pending user review

## Goal

Add a blog to the mobile-tires marketing site to capture local SEO traffic
(evergreen tire content: maintenance, flat repair, seasonal tips). Content will
be published on a regular cadence (1-2+ posts/month), so the investment is
justified. Scope is deliberately lean: listing page + post pages + SEO
plumbing. No categories, authors, pagination, RSS, or related posts in v1.

## Sanity schema (apps/studio)

### New document: `blogPost`

Location: `apps/studio/schemas/documents/blogPost/index.ts` with barrel
`index.ts`, registered in `schemas/index.ts`.

Fields:

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `slug` | slug | required, sourced from title; used for routing (`/blog/<slug>`) |
| `excerpt` | text | required; shown on listing page, meta-description fallback |
| `coverImage` | image | required; alt text field required |
| `publishedAt` | datetime | required; controls listing order (newest first) |
| `body` | Portable Text | same block configuration as the existing `richText` section |
| `seo` | `seo` object | reuse existing object type |

`blogPost` is a regular document list, not a singleton. Add a plain document
list entry to the structure builder (`apps/studio/structure/index.ts`); no
`SINGLETON_IDS` involvement.

### Site Settings addition: blog on/off toggle

Add `blogEnabled` (boolean, `initialValue: true`) to the existing
`siteSettings` singleton. This is a kill switch for the entire blog surface:

- **On (default):** blog routes render, posts appear in the sitemap.
- **Off:** `/blog` and `/blog/[slug]` return 404 via `notFound()`; posts are
  excluded from `sitemap.ts`. Post content remains intact in Sanity, so
  re-enabling restores everything with no data loss.
- Nav links are already Sanity-driven (header/footer navigation documents), so
  editors remove the blog link there when disabling.

### TypeGen

After schema changes and new queries: `pnpm --filter studio typegen:all`.
Commit the regenerated `apps/web/src/sanity.types.ts` alongside.

## Web app (apps/web)

### Routes

- `src/app/blog/page.tsx` — listing page. Fetches all posts ordered by
  `publishedAt` desc via `sanityFetch` with revalidation tags. Renders a grid
  of `BlogPostCard`s. Shows all posts (no pagination in v1).
- `src/app/blog/[slug]/page.tsx` — post detail. `generateStaticParams` uses
  raw `client.fetch` (no request context); the page component uses
  `sanityFetch`. Unknown slug → `notFound()`.

Explicit routes take precedence over the existing `[[...slug]]` catch-all, so
no routing conflict.

Both routes check `blogEnabled` from site settings (fetched with `sanityFetch`
in the page components) and call `notFound()` when disabled.

### Queries

New file `src/lib/sanity/queries/blog.ts`:

- `BLOG_POSTS_QUERY` — list: slug, title, excerpt, coverImage, publishedAt.
- `BLOG_POST_QUERY` — detail by slug: all fields including body and seo.
- `BLOG_POST_SLUGS_QUERY` — slugs + publishedAt for `generateStaticParams` and
  the sitemap.

The `blogEnabled` flag is added to the existing site-settings/global query.

All page-level fetches pass revalidation `tags` per repo convention.

### Components

- `BlogPostCard` — molecule (`src/components/molecules/BlogPostCard/`), with
  story. Cover image, title, excerpt, date; links to the post.
- Post body rendering reuses the existing RichText/PortableText renderer.
- Blog pages have a fixed layout; they are **not** editor-composed sections,
  so `Sections.tsx` is untouched.

### SEO

- `generateMetadata` on both routes: title, description (seo override →
  excerpt fallback), OpenGraph image from cover image.
- `Article` JSON-LD structured data on post pages (headline, image,
  datePublished, publisher).
- `sitemap.ts` includes `/blog` and all post URLs via raw `client.fetch`,
  skipped entirely when `blogEnabled` is false.

### Visual editing

Add `createDocDataAttribute` on the post page (and listing cards) so posts
populate Presentation's "Documents on this page" panel. Draft preview works
through the existing `sanityFetch` / draft-mode setup with no extra wiring.

## Error handling

- Unknown post slug → 404.
- `blogEnabled` false → 404 on all blog routes, no sitemap entries.
- Missing optional SEO fields fall back to excerpt/cover image.

## Testing

- Type-check and build pass (`turbo` pipeline) with regenerated types.
- Manual verification: listing renders posts newest-first; post page renders
  body, metadata, and JSON-LD; toggling `blogEnabled` off 404s both routes and
  drops posts from the sitemap; draft posts preview correctly in Presentation.

## Out of scope (v1)

Categories/tags, author documents, pagination, RSS, related posts, comments.
