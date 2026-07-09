# Schema Alignment & Sanity Seeding

**Date:** 2026-07-08
**Status:** Approved

## Goal

Align every page section with Sanity Studio so all content is editor-managed. Eliminate hardcoded data from components. Seed the `siteHomepage` Sanity document with the mock content currently living in code.

## Scope

Three categories of work:
1. Schema changes (studio)
2. Web wiring (queries, dispatcher, components)
3. Seed script (populate Sanity with existing mock data)

---

## 1. Schema Changes

### 1a. `servicesSection` — upgrade

**Current:** `services[]{ icon, title, description, price }` — flat list ignored by the component.

**New:** Two arrays matching the component's actual render:

```
packages[]{
  name        string   required
  price       number   required
  duration    string   required  e.g. "~45 min"
  description text
  includes[]  string             bullet list
  popular     boolean
}

addons[]{
  label    string  required
  price    number  required
  duration string
}
```

Remove the old `services[]` field.

### 1b. `finalCta` — new section

```
eyebrow      string
heading      string   required
body         text
phoneNumber  string   required  E.164 or 10-digit US
phoneDisplay string   required  formatted for display
trustItems[]{
  icon   string  (icon picker)
  text   string  required
}
```

### 1c. `gallery` — new section

```
eyebrow  string
heading  string   required
items[]{
  image   image   required  (Sanity image with hotspot)
  label   string
  aspect  string  options: "4/3" | "16/9"
}
```

### Registration (both new sections)

- `apps/studio/schemas/sections/index.ts` — add to `sectionTypes[]`
- `apps/studio/schemas/documents/websitePage/index.ts` — add `defineArrayMember` to `sections[]`

---

## 2. Web Wiring

### 2a. GROQ query (`apps/web/src/lib/sanity/queries/page.ts`)

Add projections to `pageProjection`:

```groq
_type == "finalCta" => {
  eyebrow, heading, body, phoneNumber, phoneDisplay,
  trustItems[]{ icon, text }
},
_type == "gallery" => {
  eyebrow, heading,
  items[]{ image{ asset->, hotspot, crop }, label, aspect }
}
```

Also update `servicesSection` projection:

```groq
_type == "servicesSection" => {
  eyebrow,
  heading,
  packages[]{ name, price, duration, description, includes, popular },
  addons[]{ label, price, duration }
}
```

### 2b. Typegen

After schema changes:

```bash
pnpm --filter studio typegen:all
```

Commit the regenerated `apps/web/src/sanity.types.ts`.

### 2c. `Sections.tsx` — add two cases

```tsx
case 'finalCta':
  return <FinalCTA key={section._key} {...section} />;
case 'gallery':
  return <Gallery key={section._key} {...section} />;
```

### 2d. Component updates

**`Services.tsx`**
- Remove `PACKAGES` / `ADDONS` imports from `@/lib/booking/packages`
- Accept `packages` and `addons` from Sanity props
- Render identically to current UI using Sanity data

**`FinalCTA.tsx`**
- Remove hardcoded `TRUST_ITEMS`, phone number, and copy constants
- Accept `eyebrow`, `heading`, `body`, `phoneNumber`, `phoneDisplay`, `trustItems` as props
- Keep same visual layout

**`Gallery.tsx`**
- Remove hardcoded `GALLERY_ITEMS`
- Accept `eyebrow`, `heading`, `items[]` as props
- Render `<Image>` from Next.js using `item.image` URL with `item.aspect` for aspect ratio
- Keep same grid layout

---

## 3. Seed Script

**File:** `apps/studio/scripts/seed-homepage.ts`

Uses `@sanity/client` to create or patch the `siteHomepage` document with all sections pre-populated from the current hardcoded mock content:

- `heroSection` — existing copy + trust markers
- `trustBar` — existing items
- `servicesSection` — PACKAGES + ADDONS arrays
- `howItWorks` — existing steps
- `reviewsSection` — existing quotes + rating
- `coverageSection` — existing towns list
- `depositCallout` — existing deposit data
- `smsBanner` — existing phone/copy
- `finalCta` — existing copy + trust items + phone
- `gallery` — 6 items with labels + aspect ratios (no images yet — images uploaded manually in Studio after seeding)

Run with:

```bash
pnpm --filter studio tsx scripts/seed-homepage.ts
```

Requires `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and a write-capable `SANITY_API_TOKEN` in the studio env.

---

## Implementation Order

1. Studio schema changes (servicesSection upgrade, finalCta, gallery)
2. Register new schemas
3. Run typegen
4. Update GROQ projections
5. Update components (Services, FinalCTA, Gallery)
6. Add Sections.tsx cases
7. Write and run seed script
8. Commit everything on a feat/ branch

---

## Out of Scope

- Actual gallery image uploads (done manually in Studio post-seed)
- Booking flow / form integration
- Any schema changes to other sections (Hero, TrustBar, etc. are already aligned)
