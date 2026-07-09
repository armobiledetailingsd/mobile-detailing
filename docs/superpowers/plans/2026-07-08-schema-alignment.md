# Schema Alignment & Sanity Seeding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every page section fully editor-managed via Sanity Studio, eliminate all hardcoded component data, and seed the `siteHomepage` document with the existing mock content.

**Architecture:** Schema changes come first (studio), then `typegen:all` regenerates `sanity.types.ts`, then GROQ projections and components are updated to consume the new types. `Gallery` and `FinalCTA` are currently rendered statically in `page.tsx` outside the Sections dispatcher — they get moved into the Sections system as part of this work. A seed script populates the Sanity homepage document so the site renders correctly without manual Studio entry.

**Tech Stack:** Sanity Studio v5, Next.js 15 App Router, TypeScript 5, `@sanity/client`, `tsx`, pnpm + Turborepo

## Global Constraints

- Branch: `feat/schema-alignment` (already exists — work here)
- Never hand-edit `apps/web/src/sanity.types.ts` — always run `pnpm --filter studio typegen:all`
- Commit messages: conventional commits (`feat:`, `chore:`) — no em dashes, no Co-Authored-By
- Every new section must be registered in: (1) `schemas/sections/index.ts`, (2) `websitePage` `sections[]`, (3) `Sections.tsx` dispatcher
- `sanityFetch` only in route/page components; `client.fetch` for `generateStaticParams` / `sitemap.ts` / `middleware.ts`

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `apps/studio/schemas/sections/servicesSection/index.ts` | Modify | Replace `services[]` with `packages[]` + `addons[]` |
| `apps/studio/schemas/sections/finalCta/index.ts` | Create | New `finalCta` section schema |
| `apps/studio/schemas/sections/gallery/index.ts` | Create | New `gallery` section schema with image array |
| `apps/studio/schemas/sections/index.ts` | Modify | Register `finalCta` + `gallery` |
| `apps/studio/schemas/documents/websitePage/index.ts` | Modify | Add `finalCta` + `gallery` as array members |
| `apps/studio/scripts/seed-homepage.ts` | Create | Seed siteHomepage with all mock data |
| `apps/studio/package.json` | Modify | Add `tsx` + `@sanity/client` devDeps + seed script |
| `apps/web/src/sanity.types.ts` | Regenerate | Typegen output — do not hand-edit |
| `apps/web/src/lib/sanity/queries/page.ts` | Modify | Update servicesSection projection, add finalCta + gallery |
| `apps/web/src/components/sections/Services/Services.tsx` | Modify | Remove PACKAGES/ADDONS imports, consume Sanity props |
| `apps/web/src/components/sections/FinalCTA/FinalCTA.tsx` | Modify | Accept Sanity props, remove hardcoded constants |
| `apps/web/src/components/sections/Gallery/Gallery.tsx` | Modify | Accept Sanity props, render images via urlForImage |
| `apps/web/src/components/sections/Sections.tsx` | Modify | Add `finalCta` + `gallery` cases |
| `apps/web/src/app/[[...slug]]/page.tsx` | Modify | Remove static `<Gallery />` + `<FinalCTA />` renders |

---

## Task 1: Schema Changes + Typegen

**Files:**
- Modify: `apps/studio/schemas/sections/servicesSection/index.ts`
- Create: `apps/studio/schemas/sections/finalCta/index.ts`
- Create: `apps/studio/schemas/sections/gallery/index.ts`
- Modify: `apps/studio/schemas/sections/index.ts`
- Modify: `apps/studio/schemas/documents/websitePage/index.ts`
- Regenerate: `apps/web/src/sanity.types.ts`

**Interfaces:**
- Produces: Updated `HomepageQueryResult` type in `sanity.types.ts` with `packages[]`, `addons[]`, `finalCta`, `gallery` section shapes — all downstream tasks depend on this

- [ ] **Step 1: Replace `servicesSection/index.ts`**

Full file replacement — swap the old `services[]` flat array for `packages[]` and `addons[]`:

```typescript
// apps/studio/schemas/sections/servicesSection/index.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { ControlsIcon } from '@sanity/icons';

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'object',
  icon: ControlsIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'packages',
      title: 'Packages',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'servicePackage',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'price', title: 'Price ($)', type: 'number', validation: (Rule) => Rule.required().positive() }),
            defineField({ name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "~45 min"', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'includes',
              title: 'Includes',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({ name: 'popular', title: 'Most popular?', type: 'boolean' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'price' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `$${subtitle}` : '' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'addons',
      title: 'Add-ons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceAddon',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'price', title: 'Price ($)', type: 'number', validation: (Rule) => Rule.required().positive() }),
            defineField({ name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "~30 min"' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'price' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `+$${subtitle}` : '' };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Services', subtitle: heading ?? '' };
    },
  },
});
```

- [ ] **Step 2: Create `finalCta/index.ts`**

```typescript
// apps/studio/schemas/sections/finalCta/index.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { ArrowRightIcon } from '@sanity/icons';

const ICON_OPTIONS = [
  'phone', 'map-pin', 'navigation', 'clock', 'wrench', 'check', 'check-circle',
  'arrow-right', 'star', 'shield', 'truck', 'alert-triangle', 'dollar-sign', 'message', 'gauge',
].map((v) => ({ title: v, value: v }));

export const finalCta = defineType({
  name: 'finalCta',
  title: 'Final CTA',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone number (href)',
      type: 'string',
      description: 'Used in tel: link. E.164 preferred: +15124567890.',
      validation: (Rule) =>
        Rule.required().regex(/^\+?1?\d{10}$|^\+\d{7,15}$/, { name: 'phone number', invert: false }),
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone number (display)',
      type: 'string',
      description: 'Formatted for display, e.g. (512) 456-7890',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trustItems',
      title: 'Trust items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustItem',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ICON_OPTIONS } }),
            defineField({ name: 'text', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'text' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Final CTA', subtitle: heading ?? '' };
    },
  },
});
```

- [ ] **Step 3: Create `gallery/index.ts`**

```typescript
// apps/studio/schemas/sections/gallery/index.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { ImagesIcon } from '@sanity/icons';

const ASPECT_OPTIONS = [
  { title: '4:3', value: '4/3' },
  { title: '16:9', value: '16/9' },
];

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Gallery items',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'aspect',
              title: 'Aspect ratio',
              type: 'string',
              options: { list: ASPECT_OPTIONS, layout: 'radio' },
              initialValue: '4/3',
            }),
          ],
          preview: {
            select: { title: 'label', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Gallery', subtitle: heading ?? '' };
    },
  },
});
```

- [ ] **Step 4: Register new schemas in `sections/index.ts`**

```typescript
// apps/studio/schemas/sections/index.ts
import { richText } from './richText';
import { heroSection } from './heroSection';
import { trustBar } from './trustBar';
import { servicesSection } from './servicesSection';
import { howItWorks } from './howItWorks';
import { reviewsSection } from './reviewsSection';
import { coverageSection } from './coverageSection';
import { depositCallout } from './depositCallout';
import { smsBanner } from './smsBanner';
import { finalCta } from './finalCta';
import { gallery } from './gallery';

export const sectionTypes = [
  richText,
  heroSection,
  trustBar,
  servicesSection,
  howItWorks,
  reviewsSection,
  coverageSection,
  depositCallout,
  smsBanner,
  finalCta,
  gallery,
];
```

- [ ] **Step 5: Add new array members to `websitePage/index.ts`**

Find the `sections` field's `of` array and add two more members at the end:

```typescript
// In apps/studio/schemas/documents/websitePage/index.ts
// Add after defineArrayMember({ type: 'smsBanner' }):
defineArrayMember({ type: 'finalCta' }),
defineArrayMember({ type: 'gallery' }),
```

The full `sections` field `of` array should look like:

```typescript
of: [
  defineArrayMember({ type: 'richText' }),
  defineArrayMember({ type: 'heroSection' }),
  defineArrayMember({ type: 'trustBar' }),
  defineArrayMember({ type: 'servicesSection' }),
  defineArrayMember({ type: 'howItWorks' }),
  defineArrayMember({ type: 'reviewsSection' }),
  defineArrayMember({ type: 'coverageSection' }),
  defineArrayMember({ type: 'depositCallout' }),
  defineArrayMember({ type: 'smsBanner' }),
  defineArrayMember({ type: 'finalCta' }),
  defineArrayMember({ type: 'gallery' }),
],
```

- [ ] **Step 6: Run typegen**

```bash
pnpm --filter studio typegen:all
```

Expected output: schema extract completes, then typegen writes `apps/web/src/sanity.types.ts`. No errors.

- [ ] **Step 7: Verify TypeScript in web app**

```bash
pnpm --filter web tsc --noEmit
```

Expected: TypeScript errors for `Services.tsx`, `FinalCTA.tsx`, `Gallery.tsx` — these are expected because the components still reference old types. Confirm errors are only in those three files (not in queries or other files).

- [ ] **Step 8: Commit**

```bash
git add apps/studio/schemas/ apps/web/src/sanity.types.ts
git commit -m "feat: add finalCta + gallery schemas, upgrade servicesSection to packages/addons"
```

---

## Task 2: Update GROQ Projections + Remove Static Renders

**Files:**
- Modify: `apps/web/src/lib/sanity/queries/page.ts`
- Modify: `apps/web/src/app/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: Updated `sanity.types.ts` from Task 1
- Produces: `HomepageQueryResult` now includes `packages[]`, `addons[]`, `finalCta`, `gallery` shapes that components can destructure

- [ ] **Step 1: Update `servicesSection` projection in `page.ts`**

In the `pageProjection` GROQ string, replace:

```groq
_type == "servicesSection" => {
  eyebrow,
  heading,
  services[]{ icon, title, description, price }
},
```

with:

```groq
_type == "servicesSection" => {
  eyebrow,
  heading,
  packages[]{ name, price, duration, description, includes, popular },
  addons[]{ label, price, duration }
},
```

- [ ] **Step 2: Add `finalCta` projection to `pageProjection`**

After the `smsBanner` projection block, add:

```groq
_type == "finalCta" => {
  eyebrow,
  heading,
  body,
  phoneNumber,
  phoneDisplay,
  trustItems[]{ icon, text }
},
```

- [ ] **Step 3: Add `gallery` projection to `pageProjection`**

After the `finalCta` block, add:

```groq
_type == "gallery" => {
  eyebrow,
  heading,
  items[]{ image{ asset->, hotspot, crop }, label, aspect }
},
```

- [ ] **Step 4: Remove static renders from `page.tsx`**

In `apps/web/src/app/[[...slug]]/page.tsx`, the homepage render currently has:

```tsx
<div data-sanity={createDocDataAttribute(page).toString()}>
  <Sections sections={page.sections} />
  <Gallery />
  <FinalCTA />
</div>
```

Change it to:

```tsx
<div data-sanity={createDocDataAttribute(page).toString()}>
  <Sections sections={page.sections} />
</div>
```

Also remove the now-unused imports at the top of the file:

```typescript
// Remove these two lines:
import { Gallery } from '@/components/sections/Gallery';
import { FinalCTA } from '@/components/sections/FinalCTA';
```

- [ ] **Step 5: Verify TypeScript**

```bash
pnpm --filter web tsc --noEmit
```

Expected: same errors as before in `Services.tsx`, `FinalCTA.tsx`, `Gallery.tsx` — no new errors introduced by query/page changes.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/sanity/queries/page.ts apps/web/src/app/
git commit -m "feat: update GROQ projections for packages/addons/finalCta/gallery, remove static renders"
```

---

## Task 3: Update Services Component

**Files:**
- Modify: `apps/web/src/components/sections/Services/Services.tsx`

**Interfaces:**
- Consumes: `ServicesSectionProps` extracted from `HomepageQueryResult` via `sanity.types.ts` — shape is `{ eyebrow?, heading, packages?, addons? }`
- Produces: `Services` component accepts Sanity-sourced props with no hardcoded data

- [ ] **Step 1: Replace `Services.tsx`**

Full file replacement. Remove the `PACKAGES`/`ADDONS` imports and render from Sanity props:

```tsx
// apps/web/src/components/sections/Services/Services.tsx
import type { HomepageQueryResult } from '@/sanity.types';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ServicesSectionProps = Extract<PageSection, { _type: 'servicesSection' }>;

export function Services({ eyebrow, heading, packages, addons }: ServicesSectionProps) {
  return (
    <section id="services" aria-labelledby="services-heading" style={{ background: 'var(--color-paper)', borderTop: '1px solid var(--color-line)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            {eyebrow}
          </p>
        )}
        <h2
          id="services-heading"
          style={{
            margin: '0 0 48px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'clamp(28px,4vw,40px)',
            color: 'var(--color-ink1)',
            letterSpacing: '-0.02em',
          }}
        >
          {heading ?? 'Services & Pricing'}
        </h2>

        {packages && packages.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
            {packages.map((pkg, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  background: 'var(--color-surface)',
                  border: pkg.popular ? '2px solid var(--color-ink1)' : '1.5px solid var(--color-line)',
                  borderRadius: 'var(--radius-card)',
                  padding: '28px 24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {pkg.popular && (
                  <span style={{
                    position: 'absolute', top: -12, left: 24,
                    background: 'var(--color-ink1)', color: 'var(--color-platinum)',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                    padding: '3px 10px', borderRadius: 100,
                    textTransform: 'uppercase',
                  }}>
                    Most popular
                  </span>
                )}

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>{pkg.duration}</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 20, color: 'var(--color-ink1)' }}>
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-ink2)', lineHeight: 1.55 }}>
                    {pkg.description}
                  </p>
                )}

                {pkg.includes && pkg.includes.length > 0 && (
                  <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.includes.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--color-ink2)' }}>
                        <span style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 2 }}>
                          <Icon name="check" size={15} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 28, color: 'var(--color-ink1)' }}>
                    ${pkg.price}
                  </span>
                  <Button variant={pkg.popular ? 'ink' : 'outline'} size="sm" aria-label={`Book ${pkg.name}`}>Book now</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addons && addons.length > 0 && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-line)',
            borderRadius: 'var(--radius-panel)',
            padding: '28px 28px',
          }}>
            <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-ink1)' }}>
              Add-ons
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {addons.map((addon, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: 'var(--color-ink2)' }}>{addon.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink1)', whiteSpace: 'nowrap' }}>+${addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm --filter web tsc --noEmit
```

Expected: `Services.tsx` error resolved. Errors remain only in `FinalCTA.tsx` and `Gallery.tsx`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/sections/Services/
git commit -m "feat: wire Services section to Sanity packages/addons"
```

---

## Task 4: Update FinalCTA Component + Wire into Sections

**Files:**
- Modify: `apps/web/src/components/sections/FinalCTA/FinalCTA.tsx`
- Modify: `apps/web/src/components/sections/Sections.tsx`

**Interfaces:**
- Consumes: `finalCta` shape from `HomepageQueryResult` — `{ eyebrow?, heading, body?, phoneNumber, phoneDisplay, trustItems? }`
- Produces: `FinalCTA` component accepts Sanity props; Sections dispatcher routes `finalCta` to it

- [ ] **Step 1: Replace `FinalCTA.tsx`**

```tsx
// apps/web/src/components/sections/FinalCTA/FinalCTA.tsx
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type FinalCtaProps = Extract<PageSection, { _type: 'finalCta' }>;

export function FinalCTA({ eyebrow, heading, body, phoneNumber, phoneDisplay, trustItems }: FinalCtaProps) {
  return (
    <section
      aria-label="Book your detail"
      style={{
        background: 'var(--color-ink1)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '96px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
            {eyebrow}
          </p>
        )}
        <h2 style={{
          margin: '0 0 18px',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: 'clamp(32px, 5vw, 52px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          color: 'var(--color-platinum)',
        }}>
          {heading}
        </h2>
        {body && (
          <p style={{ margin: '0 0 36px', fontSize: 17, color: 'var(--color-steel)', lineHeight: 1.6 }}>
            {body}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
          {phoneNumber && (
            <a href={`tel:${phoneNumber}`} style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg" icon="phone" style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.18)' }}>
                {phoneDisplay}
              </Button>
            </a>
          )}
        </div>

        {trustItems && trustItems.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {trustItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {item.icon && <Icon name={item.icon as IconName} size={14} style={{ color: 'var(--color-steel)' }} />}
                <span style={{ fontSize: 13, color: 'var(--color-steel)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add `finalCta` case to `Sections.tsx`**

Add the import at the top:

```tsx
import { FinalCTA } from './FinalCTA';
```

Add the case in the switch statement, after the `smsBanner` case:

```tsx
case 'finalCta':
  return <FinalCTA key={section._key} {...section} />;
```

- [ ] **Step 3: Verify TypeScript**

```bash
pnpm --filter web tsc --noEmit
```

Expected: `FinalCTA.tsx` error resolved. Error remains only in `Gallery.tsx`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/sections/FinalCTA/ apps/web/src/components/sections/Sections.tsx
git commit -m "feat: wire FinalCTA section to Sanity, add to Sections dispatcher"
```

---

## Task 5: Update Gallery Component + Wire into Sections

**Files:**
- Modify: `apps/web/src/components/sections/Gallery/Gallery.tsx`
- Modify: `apps/web/src/components/sections/Sections.tsx`

**Interfaces:**
- Consumes: `gallery` shape from `HomepageQueryResult` — `{ eyebrow?, heading, items? }` where each item has `image` (Sanity image with `asset->`, `hotspot`, `crop`), `label?`, `aspect?`
- Consumes: `urlForImage` from `@/lib/sanity/image` — takes a Sanity image source, returns a URL builder (call `.width(n).url()` to get a string)
- Produces: `Gallery` component renders images from Sanity via `urlForImage`

- [ ] **Step 1: Replace `Gallery.tsx`**

```tsx
// apps/web/src/components/sections/Gallery/Gallery.tsx
import Image from 'next/image';
import type { HomepageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/lib/sanity/image';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type GalleryProps = Extract<PageSection, { _type: 'gallery' }>;

export function Gallery({ eyebrow, heading, items }: GalleryProps) {
  return (
    <section id="gallery" aria-label="Work gallery" style={{ background: 'var(--color-charcoal)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            {eyebrow}
          </p>
        )}
        <h2 style={{ margin: '0 0 40px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(26px,4vw,38px)', color: 'var(--color-platinum)', letterSpacing: '-0.02em' }}>
          {heading}
        </h2>

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item, i) => {
              const imageUrl = item.image ? urlForImage(item.image).width(800).url() : null;
              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: item.aspect ?? '4/3',
                    position: 'relative',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--color-surf-d) 0%, var(--color-elev-d) 100%)',
                  }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.label ?? ''}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(164,170,180,0.05) 0%, transparent 60%)',
                    }} />
                  )}
                  {item.label && (
                    <span style={{
                      position: 'absolute', bottom: 16, left: 16,
                      fontSize: 12, color: 'var(--color-steel)',
                      background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 8px',
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add `gallery` case to `Sections.tsx`**

Add the import at the top:

```tsx
import { Gallery } from './Gallery';
```

Add the case in the switch statement, after the `finalCta` case:

```tsx
case 'gallery':
  return <Gallery key={section._key} {...section} />;
```

- [ ] **Step 3: Verify TypeScript — all errors should be gone**

```bash
pnpm --filter web tsc --noEmit
```

Expected: **zero errors**. If Next.js Image reports an unrecognized hostname for Sanity assets, add the hostname to `next.config.ts` `images.remotePatterns`. The Sanity CDN hostname is `cdn.sanity.io`.

If the error appears, open `apps/web/next.config.ts` and add:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
    },
  ],
},
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/sections/Gallery/ apps/web/src/components/sections/Sections.tsx apps/web/next.config.ts
git commit -m "feat: wire Gallery section to Sanity images, add to Sections dispatcher"
```

---

## Task 6: Seed Script

**Files:**
- Modify: `apps/studio/package.json`
- Create: `apps/studio/scripts/seed-homepage.ts`

**Interfaces:**
- Consumes: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_API_TOKEN` from env
- Produces: `siteHomepage` Sanity document with all sections pre-populated

- [ ] **Step 1: Add devDependencies + seed script to `apps/studio/package.json`**

Add `"@sanity/client"` and `"tsx"` to `devDependencies`:

```json
"devDependencies": {
  "@sanity/client": "^6.0.0",
  "@types/react": "^19.0.0",
  "tsx": "^4.0.0",
  "typescript": "^5.7.2"
}
```

Add a `seed` script:

```json
"scripts": {
  "dev": "sanity dev",
  "start": "sanity start",
  "build": "sanity build",
  "deploy": "sanity deploy",
  "check-types": "tsc --noEmit",
  "lint": "echo '(no lint configured for studio)'",
  "extract-schema": "sanity schema extract --path schema.json --enforce-required-fields",
  "typegen": "sanity typegen generate",
  "typegen:all": "pnpm extract-schema && pnpm typegen",
  "seed": "tsx scripts/seed-homepage.ts"
}
```

Install:

```bash
pnpm install --filter studio
```

- [ ] **Step 2: Create `apps/studio/scripts/seed-homepage.ts`**

```typescript
// apps/studio/scripts/seed-homepage.ts
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID is required');
if (!token) throw new Error('SANITY_API_TOKEN is required (needs write permission)');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const homepage = {
  _id: 'siteHomepage',
  _type: 'websitePage',
  title: 'Homepage',
  slug: { _type: 'slug', current: 'homepage' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero',
      eyebrow: 'Austin\'s Mobile Detail Service',
      headlineMain: 'Premium detailing,',
      headlineAccent: 'delivered to you.',
      body: 'Austin\'s mobile detail service. We come to your home or office, no shop needed.',
      trustMarkers: [
        { _key: 'tm1', icon: 'star', value: '5.0', label: 'on Google' },
        { _key: 'tm2', icon: 'check-circle', value: '140+', label: 'reviews' },
        { _key: 'tm3', icon: 'shield', value: 'Fully', label: 'insured' },
        { _key: 'tm4', icon: 'truck', value: 'We come', label: 'to you' },
      ],
    },
    {
      _type: 'trustBar',
      _key: 'trust',
      items: [
        { _key: 'tb1', icon: 'star', value: '5.0 Rating', label: 'on Google' },
        { _key: 'tb2', icon: 'check-circle', value: '140+ Reviews', label: 'verified customers' },
        { _key: 'tb3', icon: 'shield', value: 'Fully Insured', label: 'licensed & bonded' },
        { _key: 'tb4', icon: 'truck', value: 'Mobile Service', label: 'we come to you' },
      ],
    },
    {
      _type: 'servicesSection',
      _key: 'services',
      eyebrow: 'What we offer',
      heading: 'Services & Pricing',
      packages: [
        {
          _key: 'pkg1',
          name: 'Express Refresh',
          price: 89,
          duration: '~45 min',
          description: 'Quick refresh for a clean, polished look between full details.',
          includes: ['Exterior hand wash', 'Wheel & tire clean', 'Interior vacuum', 'Window wipe-down'],
          popular: false,
        },
        {
          _key: 'pkg2',
          name: 'Signature Detail',
          price: 249,
          duration: '~3 hr',
          description: 'Our most popular service — a thorough inside-and-out transformation.',
          includes: [
            'Full exterior wash & clay bar',
            'Hand wax & paint sealant',
            'Interior deep clean & shampoo',
            'Leather conditioning',
            'Glass polish (all windows)',
          ],
          popular: true,
        },
        {
          _key: 'pkg3',
          name: 'Ceramic Coating',
          price: 699,
          duration: '~5 hr',
          description: 'Professional-grade ceramic protection that lasts years, not weeks.',
          includes: [
            'Paint decontamination & prep',
            'Single-stage machine polish',
            '9H ceramic coating application',
            '24-hr cure time guidance',
          ],
          popular: false,
        },
        {
          _key: 'pkg4',
          name: 'Paint Correction',
          price: 549,
          duration: '~6 hr',
          description: 'Eliminate swirls, scratches, and oxidation for showroom-grade clarity.',
          includes: [
            'Multi-stage machine polishing',
            'Swirl & scratch removal',
            'Paint depth measurement',
            'Sealant finish coat',
          ],
          popular: false,
        },
      ],
      addons: [
        { _key: 'ao1', label: 'Pet Hair Removal', price: 40, duration: '~30 min' },
        { _key: 'ao2', label: 'Engine Bay Detail', price: 45, duration: '~30 min' },
        { _key: 'ao3', label: 'Headlight Restoration', price: 60, duration: '~45 min' },
        { _key: 'ao4', label: 'Odor Elimination', price: 50, duration: '~30 min' },
      ],
    },
    {
      _type: 'howItWorks',
      _key: 'hiw',
      eyebrow: 'Simple process',
      heading: 'How it works',
      steps: [
        { _key: 's1', title: 'Book online', description: 'Choose your service and pick a time that works for you. Takes under 2 minutes.' },
        { _key: 's2', title: 'We come to you', description: 'Our detailer arrives at your home, office, or wherever your car is parked.' },
        { _key: 's3', title: 'Drive away clean', description: 'Sit back while we work. You\'ll get a spotless car without leaving your driveway.' },
      ],
    },
    {
      _type: 'reviewsSection',
      _key: 'reviews',
      eyebrow: 'What customers say',
      heading: 'Trusted by Austin drivers',
      rating: 5.0,
      reviewCount: 140,
      quotes: [
        {
          _key: 'r1',
          quote: 'Absolutely incredible work. My car looks better than it did when I bought it. Will 100% be booking again.',
          name: 'Marcus T.',
          city: 'Austin, TX',
        },
        {
          _key: 'r2',
          quote: 'The convenience alone is worth it — they came to my office while I worked. Car was spotless when I came down.',
          name: 'Priya S.',
          city: 'Round Rock, TX',
        },
        {
          _key: 'r3',
          quote: 'Best detail I\'ve ever had. The ceramic coating looks amazing and the team was super professional.',
          name: 'Jordan K.',
          city: 'Cedar Park, TX',
        },
      ],
    },
    {
      _type: 'coverageSection',
      _key: 'coverage',
      eyebrow: 'Service area',
      heading: 'We come to you across Greater Austin',
      body: 'We serve the greater Austin metro. If your zip isn\'t listed, reach out — we may still be able to help.',
      towns: [
        'Austin', 'Round Rock', 'Cedar Park', 'Pflugerville', 'Georgetown',
        'Kyle', 'Buda', 'Leander', 'Manor', 'Bee Cave',
      ],
    },
    {
      _type: 'depositCallout',
      _key: 'deposit',
      eyebrow: 'Booking policy',
      heading: 'A small deposit holds your spot',
      body: 'We require a deposit at booking to reserve your time slot. It goes toward your total — no extra fees.',
      depositAmount: '$70',
      depositLabel: 'Deposit',
      depositNote: 'Applied to your total at checkout. Refundable with 24-hour notice.',
      reasons: [
        { _key: 'd1', icon: 'clock', title: 'Protects your time slot', description: 'Guarantees we show up for you.' },
        { _key: 'd2', icon: 'dollar-sign', title: 'Goes toward your total', description: 'Not an extra charge.' },
        { _key: 'd3', icon: 'check-circle', title: 'Easy refunds', description: '24-hour cancellation window.' },
      ],
    },
    {
      _type: 'smsBanner',
      _key: 'sms',
      headline: 'Questions? Text us.',
      body: 'Fast replies, no hold music.',
      phoneNumber: '+15124567890',
      phoneDisplay: '(512) 456-7890',
    },
    {
      _type: 'finalCta',
      _key: 'cta',
      eyebrow: 'Ready to book?',
      heading: 'Your car deserves better.',
      body: 'Schedule in under 2 minutes. We come to you — no shop, no hassle.',
      phoneNumber: '+15124567890',
      phoneDisplay: '(512) 456-7890',
      trustItems: [
        { _key: 'ti1', icon: 'star', text: '5.0 on Google (140+ reviews)' },
        { _key: 'ti2', icon: 'shield', text: 'Fully insured' },
        { _key: 'ti3', icon: 'check-circle', text: 'Satisfaction guaranteed' },
      ],
    },
    {
      _type: 'gallery',
      _key: 'gallery',
      eyebrow: 'Our work',
      heading: 'Results that speak for themselves',
      items: [
        { _key: 'g1', label: 'Paint correction before/after', aspect: '4/3' },
        { _key: 'g2', label: 'Ceramic coating application', aspect: '16/9' },
        { _key: 'g3', label: 'Interior deep clean', aspect: '4/3' },
        { _key: 'g4', label: 'Engine bay detail', aspect: '4/3' },
        { _key: 'g5', label: 'Wheel & tire restoration', aspect: '4/3' },
        { _key: 'g6', label: 'Signature Detail result', aspect: '16/9' },
      ],
    },
  ],
};

async function seed() {
  console.log(`Seeding siteHomepage in project=${projectId} dataset=${dataset}...`);
  await client.createOrReplace(homepage);
  console.log('Done. Open Sanity Studio to upload gallery images.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Verify the seed script compiles**

```bash
pnpm --filter studio tsx --noEmit scripts/seed-homepage.ts 2>&1 || pnpm --filter studio tsc --noEmit
```

Expected: no TypeScript errors.

- [ ] **Step 4: Run the seed script**

Ensure your `.env.local` (or environment) has `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and `SANITY_API_TOKEN` (must be an Editor or Administrator token from sanity.io/manage → API → Tokens).

```bash
pnpm --filter studio seed
```

Expected output:
```
Seeding siteHomepage in project=<id> dataset=production...
Done. Open Sanity Studio to upload gallery images.
```

- [ ] **Step 5: Verify in Studio**

Start the studio: `pnpm --filter studio dev`

Open the homepage document and confirm all sections appear with data.

- [ ] **Step 6: Commit**

```bash
git add apps/studio/scripts/ apps/studio/package.json pnpm-lock.yaml
git commit -m "chore: add homepage seed script with all mock data"
```

---

## Wrap-Up

After all tasks are complete:

```bash
pnpm --filter web tsc --noEmit   # zero errors
pnpm dev                          # start dev server and verify homepage renders from Sanity
```

Upload gallery images manually in Sanity Studio (Documents → Homepage → Gallery section → each item).
