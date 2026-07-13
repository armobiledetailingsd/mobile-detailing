# Vehicle-Size Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single package price with sedan and truck/SUV rates in the Sanity schema, render both on the site, and load the real rate-card content.

**Architecture:** The `servicePackage` object inside the `servicesSection` schema swaps `price` for `priceSedan` + `priceTruckSuv`. Types are regenerated, `Services.tsx` renders a two-row rate list per card, and a one-off mutation script patches the live `siteHomepage` document (the seed script is updated to stay schema-valid).

**Tech Stack:** Sanity Studio v5 schemas, Sanity TypeGen, Next.js 15 / React 19, Vitest + Testing Library, `@sanity/client` via tsx script.

## Global Constraints

- After any schema change run `pnpm --filter studio typegen:all` and commit `apps/web/src/sanity.types.ts` with it (CLAUDE.md).
- Never edit `apps/web/src/sanity.types.ts` by hand.
- Conventional commits; no Co-Authored-By lines; no em dashes in commit messages.
- Work stays on branch `feat/booking-launch-prep` (never commit to main).
- Spec: `docs/superpowers/specs/2026-07-12-vehicle-size-pricing-design.md`.

---

### Task 1: Schema + types + web rendering (one atomic commit)

The schema change and the component change ship together; committing the schema alone would leave the web app type-broken.

**Files:**
- Modify: `apps/studio/schemas/sections/servicesSection/index.ts:32` (price field), `:43-48` (preview)
- Modify: `apps/studio/scripts/seed-homepage.ts:60-116` (services packages)
- Modify: `apps/web/src/components/sections/Services/Services.tsx:69-81` (card footer)
- Test: `apps/web/src/components/sections/Services/Services.test.tsx`
- Generated: `apps/web/src/sanity.types.ts` (via typegen, do not hand-edit)

**Interfaces:**
- Produces: `servicePackage` object with `priceSedan: number` and `priceTruckSuv: number` (both required); no `price` field. Task 2's mutation payload must use these exact field names.

- [ ] **Step 1: Update the schema fields and preview**

In `apps/studio/schemas/sections/servicesSection/index.ts`, replace the single `price` field line inside `servicePackage`:

```ts
defineField({ name: 'priceSedan', title: 'Sedan price ($)', type: 'number', validation: (Rule) => Rule.required().positive() }),
defineField({ name: 'priceTruckSuv', title: 'Truck or SUV price ($)', type: 'number', validation: (Rule) => Rule.required().positive() }),
```

and replace the `servicePackage` preview block with:

```ts
preview: {
  select: { title: 'name', sedan: 'priceSedan', truckSuv: 'priceTruckSuv' },
  prepare({ title, sedan, truckSuv }) {
    const rates = [sedan, truckSuv].filter((v) => v != null).map((v) => `$${v}`);
    return { title, subtitle: rates.join(' / ') };
  },
},
```

Leave the `serviceAddon` fields and preview untouched.

- [ ] **Step 2: Update the seed script packages**

In `apps/studio/scripts/seed-homepage.ts`, replace the three package objects (keep `_key`s `pkg1`-`pkg3`) with:

```ts
{
  _type: 'servicePackage',
  _key: 'pkg1',
  name: 'Bronze',
  priceSedan: 99.99,
  priceTruckSuv: 120,
  duration: '~1.5 hr',
  description: 'A thorough wash and interior refresh to keep your car looking its best.',
  includes: [
    'Hand washing',
    'Spray waxing',
    'Trim and tire dressing',
    'Interior and plastic wiping',
    'Vacuuming',
    'Cleaning: pedals, steering wheel, door panels, windows, carpets, and spot stains',
  ],
  popular: false,
},
{
  _type: 'servicePackage',
  _key: 'pkg2',
  name: 'Silver',
  priceSedan: 180,
  priceTruckSuv: 249.99,
  duration: '~3 hr',
  description: 'Deep interior detailing plus machine waxing or sealant for lasting protection.',
  includes: [
    'Machine waxing or sealant application',
    'Trim and tire dressing',
    'Steam cleaning: interior plastics, door panels, air vents',
    'Deep cleaning and vacuuming',
    'Leather conditioning',
    'Carpet and/or upholstery extraction and shampooing',
    'Cleaning: pedals, steering wheel, door jambs, windows inside and out',
  ],
  popular: true,
},
{
  _type: 'servicePackage',
  _key: 'pkg3',
  name: 'Gold',
  priceSedan: 275,
  priceTruckSuv: 300,
  duration: '~4.5 hr',
  description: 'Our most complete detail, from clay bar and sealant to engine bay work.',
  includes: [
    'Hand washing and clay bar treatment',
    'Waxing and sealant application',
    'Trim restoration, tire dressing, and wheel cleaning',
    'Interior plastic and vent steam cleaning',
    'Vacuuming and leather conditioning',
    'Carpet, floor mats, and upholstery shampooing and extraction',
    'Cleaning: pedals, roof, trunk, steering wheel, door jambs, windows inside and out',
    'Light scratch and swirl removal',
    'Engine bay work',
  ],
  popular: false,
},
```

Leave the `addons` array as-is (it already matches the rate card).

- [ ] **Step 3: Regenerate types**

Run: `pnpm --filter studio typegen:all`
Expected: succeeds; `git diff apps/web/src/sanity.types.ts` shows `priceSedan` and `priceTruckSuv` replacing `price` in the services package type.

- [ ] **Step 4: Update the component test to the new fields (failing test)**

Replace `apps/web/src/components/sections/Services/Services.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Services, type ServicesSectionProps } from './Services';

const PROPS: ServicesSectionProps = {
  _type: 'servicesSection',
  _key: 'services',
  eyebrow: 'Services',
  heading: 'Services & Pricing',
  packages: [
    {
      _key: 'pkg-1',
      name: 'Full Detail',
      duration: '3 hrs',
      description: 'Inside and out.',
      priceSedan: 199,
      priceTruckSuv: 249.99,
      popular: true,
      includes: ['Hand wash'],
    },
  ],
  addons: [],
};

describe('Services booking CTAs', () => {
  it('links each package Book now CTA to /book', () => {
    render(<Services {...PROPS} />);
    const cta = screen.getByRole('link', { name: /book now: full detail/i });
    expect(cta).toHaveAttribute('href', '/book');
  });
});

describe('Services vehicle-size rates', () => {
  it('renders sedan and truck/SUV rates for each package', () => {
    render(<Services {...PROPS} />);
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('$199')).toBeInTheDocument();
    expect(screen.getByText('Truck or SUV')).toBeInTheDocument();
    expect(screen.getByText('$249.99')).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `pnpm --filter web test Services`
Expected: FAIL — "Unable to find an element with the text: Sedan" (the CTA test may also fail until the component compiles against the new types).

- [ ] **Step 6: Update the component footer**

In `apps/web/src/components/sections/Services/Services.tsx`, replace the card footer block (`<div className="mt-auto flex items-center justify-between">` through its closing `</div>`) with:

```tsx
<div className="mt-auto">
  <dl className="m-0 mb-4 flex flex-col gap-[6px]">
    <div className="flex items-baseline justify-between">
      <dt className="text-[13px] font-medium text-muted">Sedan</dt>
      <dd className="m-0 font-sans font-bold text-[22px] text-ink1">${pkg.priceSedan}</dd>
    </div>
    <div className="flex items-baseline justify-between">
      <dt className="text-[13px] font-medium text-muted">Truck or SUV</dt>
      <dd className="m-0 font-sans font-bold text-[22px] text-ink1">${pkg.priceTruckSuv}</dd>
    </div>
  </dl>
  <div className="flex justify-end">
    <Button
      href="/book"
      variant={pkg.popular ? 'ink' : 'outline'}
      size="sm"
      aria-label={`Book now: ${pkg.name}`}
    >
      Book now
    </Button>
  </div>
</div>
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `pnpm --filter web test Services`
Expected: PASS (both describe blocks).

- [ ] **Step 8: Type-check both apps**

Run: `pnpm --filter web exec tsc --noEmit && pnpm --filter studio exec tsc --noEmit`
Expected: no errors. (If a repo-level `pnpm check` or `lint` script exists, run that instead.)

- [ ] **Step 9: Commit**

```bash
git add apps/studio/schemas/sections/servicesSection/index.ts apps/studio/scripts/seed-homepage.ts apps/web/src/sanity.types.ts apps/web/src/components/sections/Services/
git commit -m "feat: add sedan vs truck/SUV pricing to service packages"
```

---

### Task 2: Patch live Sanity content

**Files:**
- Create: `apps/studio/scripts/update-services-pricing.ts`
- Modify: `apps/studio/package.json` (add script entry)

**Interfaces:**
- Consumes: `priceSedan` / `priceTruckSuv` field names from Task 1; env vars `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_API_TOKEN` (already present in `apps/studio/.env` / `.env.local`, same as the seed script).

- [ ] **Step 1: Write the mutation script**

Create `apps/studio/scripts/update-services-pricing.ts`. It patches only the services section of the homepage (published and draft, if present) rather than replacing the whole document, so other editor changes survive:

```ts
// apps/studio/scripts/update-services-pricing.ts
// One-off: replace servicesSection packages/addons with the real rate card
// (sedan vs truck/SUV pricing). Safe to re-run.
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID is required');
if (!token) throw new Error('SANITY_API_TOKEN is required (needs write permission)');

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

const packages = [
  {
    _type: 'servicePackage',
    _key: 'pkg1',
    name: 'Bronze',
    priceSedan: 99.99,
    priceTruckSuv: 120,
    duration: '~1.5 hr',
    description: 'A thorough wash and interior refresh to keep your car looking its best.',
    includes: [
      'Hand washing',
      'Spray waxing',
      'Trim and tire dressing',
      'Interior and plastic wiping',
      'Vacuuming',
      'Cleaning: pedals, steering wheel, door panels, windows, carpets, and spot stains',
    ],
    popular: false,
  },
  {
    _type: 'servicePackage',
    _key: 'pkg2',
    name: 'Silver',
    priceSedan: 180,
    priceTruckSuv: 249.99,
    duration: '~3 hr',
    description: 'Deep interior detailing plus machine waxing or sealant for lasting protection.',
    includes: [
      'Machine waxing or sealant application',
      'Trim and tire dressing',
      'Steam cleaning: interior plastics, door panels, air vents',
      'Deep cleaning and vacuuming',
      'Leather conditioning',
      'Carpet and/or upholstery extraction and shampooing',
      'Cleaning: pedals, steering wheel, door jambs, windows inside and out',
    ],
    popular: true,
  },
  {
    _type: 'servicePackage',
    _key: 'pkg3',
    name: 'Gold',
    priceSedan: 275,
    priceTruckSuv: 300,
    duration: '~4.5 hr',
    description: 'Our most complete detail, from clay bar and sealant to engine bay work.',
    includes: [
      'Hand washing and clay bar treatment',
      'Waxing and sealant application',
      'Trim restoration, tire dressing, and wheel cleaning',
      'Interior plastic and vent steam cleaning',
      'Vacuuming and leather conditioning',
      'Carpet, floor mats, and upholstery shampooing and extraction',
      'Cleaning: pedals, roof, trunk, steering wheel, door jambs, windows inside and out',
      'Light scratch and swirl removal',
      'Engine bay work',
    ],
    popular: false,
  },
];

const addons = [
  { _type: 'serviceAddon', _key: 'ao1', label: 'Headlight Restoration', price: 50 },
  { _type: 'serviceAddon', _key: 'ao2', label: 'Dog Hair Removal', price: 50 },
  { _type: 'serviceAddon', _key: 'ao3', label: 'Rock Chip Touch-Ups', price: 100 },
];

async function run() {
  for (const id of ['siteHomepage', 'drafts.siteHomepage']) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`${id}: not found, skipping`);
      continue;
    }
    const sections = (doc.sections ?? []).map((s: { _type: string }) =>
      s._type === 'servicesSection' ? { ...s, packages, addons } : s
    );
    await client.patch(id).set({ sections }).commit();
    console.log(`${id}: services section updated`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Add to `apps/studio/package.json` scripts:

```json
"update-services": "tsx scripts/update-services-pricing.ts"
```

- [ ] **Step 2: Run the mutation**

Run: `pnpm --filter studio update-services`
Expected: `siteHomepage: services section updated` (and the draft line if a draft exists).

- [ ] **Step 3: Verify the live data**

Run:

```bash
pnpm --filter studio exec sanity documents get siteHomepage | grep -E "priceSedan|priceTruckSuv|name"
```

Expected: Bronze/Silver/Gold with both price fields; no remaining `"price":` on packages. Alternatively load the homepage locally (`pnpm dev`) and confirm the services section shows both rates per card.

- [ ] **Step 4: Commit**

```bash
git add apps/studio/scripts/update-services-pricing.ts apps/studio/package.json
git commit -m "feat: add script to load rate card pricing into services section"
```
