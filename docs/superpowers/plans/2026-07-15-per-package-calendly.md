# Per-Package Calendly Scheduling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route each booking to the Calendly event type matching the chosen package (Bronze 1.5 hr, Silver 2.5 hr, Gold 4 hr) so the detailer's calendar blocks the correct duration.

**Architecture:** Three Calendly event types (created manually in Calendly, one shared calendar, 30 min after-buffer each) are stored as three required URL fields in Sanity Site Settings. The web app gains a `PackageSlug` concept in `apps/web/src/lib/booking/packages.ts`; Services cards link to `/book?package=<slug>`; the book page validates the param and passes all three URLs plus an optional preselection into `BookingFlow`, which grows a "Choose your package" first step (flow becomes 1 Package → 2 Contact → 3 Schedule → 4 Pay).

**Tech Stack:** Next.js 15 (App Router, `searchParams` is a Promise), Sanity Studio v5 + TypeGen, vitest + @testing-library/react, TypeScript 5.

Spec: `docs/superpowers/specs/2026-07-15-per-package-calendly-design.md`

## Global Constraints

- Branch: `feat/booking-launch-prep` (never commit to `main`).
- Conventional commits (`feat:`, `test:`, etc.). No `Co-Authored-By` lines. No em dashes in commit messages.
- After any Sanity schema or GROQ change, run `pnpm --filter studio typegen:all` and commit the regenerated `apps/web/src/sanity.types.ts`. Never hand-edit that file.
- Web tests: `pnpm --filter web test` (vitest run). Typecheck: `pnpm --filter web check-types`.
- Preserve `CORE_ZIPS`, `TRAVEL_ZIPS`, `getTravelFee`, `isServiceableZip` in `packages.ts` — they have live consumers (`BookingFlow.tsx`, `Hero/BookingCTA.tsx`, tests).
- Invalid `?package=` values are silently ignored (never an error). Missing Calendly/Stripe settings on `/book` → `notFound()`.

## Manual setup outside this repo (not a task, but required before launch)

In Calendly, under the existing account, create three event types **all bound to the same detailer calendar**, each with a 30 min "after event" buffer:

| Event type | Duration |
|---|---|
| Bronze Detail | 1 hr 30 min |
| Silver Detail | 2 hr 30 min |
| Gold Detail | 4 hr |

Paste each public URL into Sanity Studio → Site Settings → Booking after Task 2 deploys. Also enter the existing Stripe link value unchanged. The old `calendlyUrl` value shows as an unknown field in Studio; remove it via Studio's affordance.

> **Note for the human:** site copy (Sanity services section) says Silver "~3 hr" and Gold "~4.5 hr", while the Calendly event durations above are 2.5 hr and 4 hr per the owner's instruction. This plan displays the site copy durations in the picker (consistent with the Services cards). Confirm with the owner whether either side should change; no code change needed if the discrepancy is intentional (site copy includes buffer/setup time).

---

### Task 1: Package slugs in `packages.ts`

**Files:**
- Modify: `apps/web/src/lib/booking/packages.ts:1-80` (replace stale `Package`/`PACKAGES`/`Addon`/`ADDONS`; keep everything from the ZIP comment down untouched)
- Test: `apps/web/src/lib/booking/packages.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces (used by Tasks 3, 4, 5):
  - `type PackageSlug = 'bronze' | 'silver' | 'gold'`
  - `type Package = { slug: PackageSlug; name: string; priceSedan: number; priceTruckSuv: number; duration: string }`
  - `const PACKAGES: Package[]` (Bronze, Silver, Gold in that order)
  - `function resolvePackageSlug(name: string | null | undefined): PackageSlug | null`
  - Unchanged exports still available: `CORE_ZIPS`, `TRAVEL_ZIPS`, `getTravelFee`, `isServiceableZip`

- [ ] **Step 1: Write the failing tests**

Append to `apps/web/src/lib/booking/packages.test.ts` (also add `PACKAGES, resolvePackageSlug` to the existing import from `'./packages'`):

```ts
import { CORE_ZIPS, PACKAGES, isServiceableZip, resolvePackageSlug } from './packages';
```

```ts
describe('PACKAGES', () => {
  it('lists the Bronze, Silver, and Gold rate card', () => {
    expect(PACKAGES.map((p) => p.slug)).toEqual(['bronze', 'silver', 'gold']);
    const bronze = PACKAGES[0]!;
    expect(bronze).toEqual({
      slug: 'bronze',
      name: 'Bronze',
      priceSedan: 99.99,
      priceTruckSuv: 120,
      duration: '~1.5 hr',
    });
  });
});

describe('resolvePackageSlug', () => {
  it('resolves known names case-insensitively with whitespace trimmed', () => {
    expect(resolvePackageSlug('Bronze')).toBe('bronze');
    expect(resolvePackageSlug(' silver ')).toBe('silver');
    expect(resolvePackageSlug('GOLD')).toBe('gold');
  });

  it('returns null for unknown, empty, or missing names', () => {
    expect(resolvePackageSlug('Full Detail')).toBeNull();
    expect(resolvePackageSlug('')).toBeNull();
    expect(resolvePackageSlug(null)).toBeNull();
    expect(resolvePackageSlug(undefined)).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test src/lib/booking/packages.test.ts`
Expected: FAIL — `resolvePackageSlug` is not exported / `PACKAGES[0].slug` undefined.

- [ ] **Step 3: Replace the stale package data**

In `apps/web/src/lib/booking/packages.ts`, replace everything from line 1 down to (not including) the `// North County San Diego service area.` comment with:

```ts
export type PackageSlug = 'bronze' | 'silver' | 'gold';

export type Package = {
  slug: PackageSlug;
  name: string;
  priceSedan: number;
  priceTruckSuv: number;
  duration: string;
};

// Rate card mirrors the Sanity servicesSection content
// (apps/studio/scripts/update-services-pricing.ts). Calendly event durations
// are configured per package in Calendly itself; these strings are display copy.
export const PACKAGES: Package[] = [
  { slug: 'bronze', name: 'Bronze', priceSedan: 99.99, priceTruckSuv: 120, duration: '~1.5 hr' },
  { slug: 'silver', name: 'Silver', priceSedan: 180, priceTruckSuv: 249.99, duration: '~3 hr' },
  { slug: 'gold', name: 'Gold', priceSedan: 275, priceTruckSuv: 300, duration: '~4.5 hr' },
];

// Sanity service packages have no stable key, so the (case-insensitive) name
// is the join key between CMS content and booking slugs.
export function resolvePackageSlug(name: string | null | undefined): PackageSlug | null {
  const normalized = (name ?? '').trim().toLowerCase();
  return PACKAGES.some((p) => p.slug === normalized) ? (normalized as PackageSlug) : null;
}
```

Delete the old `Package` type, `PACKAGES` array, `Addon` type, and `ADDONS` array (all confirmed unused elsewhere). Keep `CORE_ZIPS`, `TRAVEL_ZIPS`, `getTravelFee`, and `isServiceableZip` exactly as they are.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test src/lib/booking/packages.test.ts`
Expected: PASS (all `isServiceableZip` tests still green too).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/booking/packages.ts apps/web/src/lib/booking/packages.test.ts
git commit -m "feat: replace stale package data with Bronze/Silver/Gold slugs"
```

---

### Task 2: Sanity schema fields, GROQ projection, typegen

**Files:**
- Modify: `apps/studio/schemas/documents/siteSettings/index.ts:62-70` (replace the `calendlyUrl` field)
- Modify: `apps/web/src/lib/sanity/queries/global.ts:25-36` (`siteSettingsQuery` projection)
- Regenerate: `apps/web/src/sanity.types.ts` (via typegen — never hand-edit)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces (used by Task 5): `SiteSettingsQueryResult` gains `calendlyUrlBronze: string | null`, `calendlyUrlSilver: string | null`, `calendlyUrlGold: string | null`; `calendlyUrl` disappears from the generated types.

- [ ] **Step 1: Replace the schema field**

In `apps/studio/schemas/documents/siteSettings/index.ts`, replace the `calendlyUrl` `defineField` block (the one titled "Calendly scheduling URL") with these three fields, keeping `stripeDepositLink` after them unchanged:

```ts
defineField({
  name: 'calendlyUrlBronze',
  title: 'Calendly URL — Bronze (1.5 hr)',
  type: 'url',
  description:
    'Public Calendly link for the Bronze Detail event type, e.g. https://calendly.com/your-team/bronze-detail',
  validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
  group: 'booking',
}),
defineField({
  name: 'calendlyUrlSilver',
  title: 'Calendly URL — Silver (2.5 hr)',
  type: 'url',
  description:
    'Public Calendly link for the Silver Detail event type, e.g. https://calendly.com/your-team/silver-detail',
  validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
  group: 'booking',
}),
defineField({
  name: 'calendlyUrlGold',
  title: 'Calendly URL — Gold (4 hr)',
  type: 'url',
  description:
    'Public Calendly link for the Gold Detail event type, e.g. https://calendly.com/your-team/gold-detail',
  validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
  group: 'booking',
}),
```

- [ ] **Step 2: Update the GROQ projection**

In `apps/web/src/lib/sanity/queries/global.ts`, in `siteSettingsQuery`, replace the line `calendlyUrl,` with:

```groq
  calendlyUrlBronze,
  calendlyUrlSilver,
  calendlyUrlGold,
```

- [ ] **Step 3: Regenerate types**

Run: `pnpm --filter studio typegen:all`
Expected: succeeds; `apps/web/src/sanity.types.ts` diff shows `calendlyUrlBronze/Silver/Gold` in `SiteSettings` and `SiteSettingsQueryResult`, `calendlyUrl` removed.

- [ ] **Step 4: Verify the web app now fails to typecheck (expected — proves the types took)**

Run: `pnpm --filter web check-types`
Expected: FAIL in `apps/web/src/app/book/page.tsx` (`calendlyUrl` no longer exists on `SiteSettingsQueryResult`). This is fixed in Task 5. Do NOT fix it here; Tasks 3-5 land before the next full typecheck gate.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/schemas/documents/siteSettings/index.ts apps/web/src/lib/sanity/queries/global.ts apps/web/src/sanity.types.ts
git commit -m "feat: replace calendlyUrl setting with per-package Bronze/Silver/Gold URLs"
```

Note: this commit intentionally leaves `book/page.tsx` typechecking red until Task 5. If your workflow requires green typecheck per commit, execute Tasks 2-5 as one review unit and only run the typecheck gate at Task 5 Step 6.

---

### Task 3: Services cards link to `/book?package=<slug>`

**Files:**
- Modify: `apps/web/src/components/sections/Services/Services.tsx` (import + Book now `href`)
- Test: `apps/web/src/components/sections/Services/Services.test.tsx`

**Interfaces:**
- Consumes: `resolvePackageSlug` from Task 1 (`@/lib/booking/packages`).
- Produces: `/book?package=bronze|silver|gold` links that Task 5's page reads.

- [ ] **Step 1: Write the failing tests**

In `apps/web/src/components/sections/Services/Services.test.tsx`, replace the `Services booking CTAs` describe block with:

```tsx
describe('Services booking CTAs', () => {
  it('links a known package Book now CTA to /book with its slug', () => {
    const props: ServicesSectionProps = {
      ...PROPS,
      packages: [{ ...PROPS.packages![0]!, name: 'Silver' }],
    };
    render(<Services {...props} />);
    const cta = screen.getByRole('link', { name: /book now: silver/i });
    expect(cta).toHaveAttribute('href', '/book?package=silver');
  });

  it('falls back to plain /book when the package name is unknown', () => {
    render(<Services {...PROPS} />);
    const cta = screen.getByRole('link', { name: /book now: full detail/i });
    expect(cta).toHaveAttribute('href', '/book');
  });
});
```

- [ ] **Step 2: Run tests to verify the new case fails**

Run: `pnpm --filter web test src/components/sections/Services/Services.test.tsx`
Expected: FAIL — href is `/book`, expected `/book?package=silver`.

- [ ] **Step 3: Wire the slug into the CTA**

In `apps/web/src/components/sections/Services/Services.tsx`, add the import:

```ts
import { resolvePackageSlug } from '@/lib/booking/packages';
```

Inside the `packages.map((pkg) => ...)` callback, compute the slug before the returned JSX by changing the arrow body to a block:

```tsx
{packages.map((pkg) => {
  const slug = resolvePackageSlug(pkg.name);
  return (
    <div
      key={pkg._key}
      ...
```

(everything inside unchanged), close with `);` and `})`. Then change the Button:

```tsx
<Button
  href={slug ? `/book?package=${slug}` : '/book'}
  variant={pkg.popular ? 'ink' : 'outline'}
  size="sm"
  aria-label={`Book now: ${pkg.name}`}
>
  Book now
</Button>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test src/components/sections/Services/Services.test.tsx`
Expected: PASS (including the untouched vehicle-size rates test).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/sections/Services/Services.tsx apps/web/src/components/sections/Services/Services.test.tsx
git commit -m "feat: link Services cards to /book with package slug"
```

---

### Task 4: BookingFlow four-step flow with package picker

**Files:**
- Modify: `apps/web/src/components/sections/BookingFlow/BookingFlow.tsx` (full rewrite shown below)
- Test: `apps/web/src/components/sections/BookingFlow/BookingFlow.test.tsx` (full rewrite shown below)

**Interfaces:**
- Consumes: `PACKAGES`, `PackageSlug`, `isServiceableZip` from `@/lib/booking/packages` (Task 1); unchanged `buildCalendlyUrl`, `buildStripeUrl`, `isValidEmail` from `@/lib/booking/urls`.
- Produces (used by Task 5): `BookingFlow` props become

```ts
type BookingFlowProps = {
  calendlyUrls: Record<PackageSlug, string>;
  stripeDepositLink: string;
  initialPackage?: PackageSlug;
};
```

- [ ] **Step 1: Rewrite the test file with the new flow**

Replace the entire contents of `apps/web/src/components/sections/BookingFlow/BookingFlow.test.tsx` with:

```tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CORE_ZIPS } from '@/lib/booking/packages';
import { BookingFlow } from './BookingFlow';

const PROPS = {
  calendlyUrls: {
    bronze: 'https://calendly.com/ar-detailing/bronze-detail',
    silver: 'https://calendly.com/ar-detailing/silver-detail',
    gold: 'https://calendly.com/ar-detailing/gold-detail',
  },
  stripeDepositLink: 'https://buy.stripe.com/test_abc123',
};

const GOOD_ZIP = [...CORE_ZIPS][0] as string;

async function pickPackage(name = /silver/i) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name }));
}

async function fillContact(overrides: { email?: string; zip?: string } = {}) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/name/i), 'Sam Jones');
  await user.type(screen.getByLabelText(/email/i), overrides.email ?? 'sam@example.com');
  await user.type(screen.getByLabelText(/zip/i), overrides.zip ?? GOOD_ZIP);
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

function scheduleViaCalendlyMessage() {
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://calendly.com',
        data: { event: 'calendly.event_scheduled' },
      }),
    );
  });
}

describe('BookingFlow package step', () => {
  it('starts on the package step with all three options', () => {
    render(<BookingFlow {...PROPS} />);
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bronze/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /silver/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gold/i })).toBeInTheDocument();
  });

  it('advances to the contact step after picking a package', async () => {
    render(<BookingFlow {...PROPS} />);
    await pickPackage();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
  });

  it('skips straight to contact when a package is preselected', () => {
    render(<BookingFlow {...PROPS} initialPackage="gold" />);
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/gold/i)).toBeInTheDocument();
  });

  it('returns to the package step via the change affordance', async () => {
    render(<BookingFlow {...PROPS} initialPackage="gold" />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /change/i }));
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
  });
});

describe('BookingFlow contact step', () => {
  it('blocks progress on an invalid email', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact({ email: 'not-an-email' });
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
  });

  it('blocks progress on an unserviceable ZIP', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact({ zip: '00000' });
    expect(screen.getByText(/don't cover that zip/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
  });

  it('marks the invalid field and announces the contact error to assistive tech', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact({ email: 'not-an-email' });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/valid email/i);
    const emailInput = screen.getByLabelText(/email/i);
    const zipInput = screen.getByLabelText(/zip/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', alert.id);
    expect(zipInput).toHaveAttribute('aria-invalid', 'false');
    expect(zipInput).toHaveAttribute('aria-describedby', alert.id);
  });
});

describe('BookingFlow schedule step', () => {
  it("advances to the schedule step with the selected package's prefilled Calendly iframe", async () => {
    render(<BookingFlow {...PROPS} />);
    await pickPackage(/silver/i);
    await fillContact();
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
    const iframe = screen.getByTitle(/pick a time/i) as HTMLIFrameElement;
    const src = new URL(iframe.src);
    expect(src.origin + src.pathname).toBe(PROPS.calendlyUrls.silver);
    expect(src.searchParams.get('email')).toBe('sam@example.com');
    expect(src.searchParams.get('name')).toBe('Sam Jones');
  });

  it('uses the bronze URL when bronze is selected', async () => {
    render(<BookingFlow {...PROPS} initialPackage="bronze" />);
    await fillContact();
    const iframe = screen.getByTitle(/pick a time/i) as HTMLIFrameElement;
    const src = new URL(iframe.src);
    expect(src.origin + src.pathname).toBe(PROPS.calendlyUrls.bronze);
  });

  it('offers a fallback Stripe deposit link alongside the Calendly fallback', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
    const calendlyLink = screen.getByRole('link', { name: /book directly on calendly/i });
    const calendlyHref = new URL((calendlyLink as HTMLAnchorElement).href);
    expect(calendlyHref.origin + calendlyHref.pathname).toBe(PROPS.calendlyUrls.silver);
    const payLink = screen.getByRole('link', { name: /pay your deposit here/i });
    const href = new URL((payLink as HTMLAnchorElement).href);
    expect(href.origin + href.pathname).toBe(PROPS.stripeDepositLink);
    expect(href.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });

  it('advances to the pay step when Calendly reports event_scheduled', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    scheduleViaCalendlyMessage();
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
    const payLink = screen.getByRole('link', { name: /pay .*deposit/i });
    const href = new URL((payLink as HTMLAnchorElement).href);
    expect(href.origin + href.pathname).toBe(PROPS.stripeDepositLink);
    expect(href.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });

  it('ignores scheduled messages from non-Calendly origins', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://evil.example.com',
          data: { event: 'calendly.event_scheduled' },
        }),
      );
    });
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
  });
});

describe('auto-redirect on the pay step', () => {
  let hrefSpy: ReturnType<typeof vi.fn<(value: string) => void>>;

  beforeEach(() => {
    hrefSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return 'https://example.com/book';
        },
        set href(value: string) {
          hrefSpy(value);
        },
        hostname: 'example.com',
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('automatically navigates to the Stripe deposit link after reaching the pay step', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();

    // userEvent's internal delays rely on real timers, so fake timers are
    // enabled only after all user interaction is done.
    vi.useFakeTimers();

    scheduleViaCalendlyMessage();
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
    expect(hrefSpy).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(hrefSpy).toHaveBeenCalledTimes(1);
    const [redirectUrl] = hrefSpy.mock.calls[0] as [string];
    const url = new URL(redirectUrl);
    expect(url.origin + url.pathname).toBe(PROPS.stripeDepositLink);
    expect(url.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });
});
```

Note the mocked `window.location` now includes `hostname: 'example.com'` because the schedule step reads it; the original only stubbed `href`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test src/components/sections/BookingFlow/BookingFlow.test.tsx`
Expected: FAIL — `BookingFlow` has no `calendlyUrls`/`initialPackage` props; "step 1 of 4" not found.

- [ ] **Step 3: Rewrite the component**

Replace the entire contents of `apps/web/src/components/sections/BookingFlow/BookingFlow.tsx` with:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { PACKAGES, isServiceableZip, type PackageSlug } from '@/lib/booking/packages';
import { buildCalendlyUrl, buildStripeUrl, isValidEmail } from '@/lib/booking/urls';

type Step = 'package' | 'contact' | 'schedule' | 'pay';

type BookingFlowProps = {
  calendlyUrls: Record<PackageSlug, string>;
  stripeDepositLink: string;
  initialPackage?: PackageSlug;
};

const STEP_NUMBER: Record<Step, number> = { package: 1, contact: 2, schedule: 3, pay: 4 };

const AUTO_REDIRECT_DELAY_MS = 1500;

const INPUT_CLASSES =
  'w-full h-12 px-[14px] font-sans text-[15px] rounded-input text-platinum focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)] focus-visible:border-[var(--color-accent-d)]';

const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.07)',
  border: '1.5px solid rgba(255,255,255,0.15)',
} as const;

export function BookingFlow({ calendlyUrls, stripeDepositLink, initialPackage }: BookingFlowProps) {
  const [step, setStep] = useState<Step>(initialPackage ? 'contact' : 'package');
  const [selected, setSelected] = useState<PackageSlug | null>(initialPackage ?? null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'email' | 'zip' | null>(null);
  const errorId = 'contact-form-error';

  const selectedPackage = PACKAGES.find((p) => p.slug === selected) ?? null;
  const calendlyUrl = selected ? calendlyUrls[selected] : '';

  useEffect(() => {
    if (step !== 'schedule') return;
    function onMessage(e: MessageEvent) {
      const fromCalendly =
        e.origin === 'https://calendly.com' || e.origin.endsWith('.calendly.com');
      if (fromCalendly && e.data?.event === 'calendly.event_scheduled') {
        setStep('pay');
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [step]);

  useEffect(() => {
    if (step !== 'pay') return;
    const timer = setTimeout(() => {
      window.location.href = buildStripeUrl(stripeDepositLink, email.trim());
    }, AUTO_REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step, stripeDepositLink, email]);

  function submitContact() {
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.');
      setErrorField('email');
      return;
    }
    if (!isServiceableZip(zip.trim().slice(0, 5))) {
      setError("Sorry, we don't cover that ZIP yet.");
      setErrorField('zip');
      return;
    }
    setError(null);
    setErrorField(null);
    setStep('schedule');
  }

  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-panel py-8 px-7 backdrop-blur-[8px]">
      <p className="m-0 mb-[6px] text-[12px] font-semibold tracking-[0.12em] uppercase text-steel">
        Step {STEP_NUMBER[step]} of 4
      </p>

      {step === 'package' && (
        <>
          <h2 className="m-0 mb-5 font-sans font-semibold text-[22px] text-platinum">
            Choose your package
          </h2>
          <div className="flex flex-col gap-3">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.slug}
                type="button"
                onClick={() => {
                  setSelected(pkg.slug);
                  setStep('contact');
                }}
                className="w-full text-left p-[16px_18px] rounded-input cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)]"
                style={INPUT_STYLE}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-sans font-semibold text-[16px] text-platinum">
                    {pkg.name}
                  </span>
                  <span className="text-[13px] text-steel">{pkg.duration}</span>
                </span>
                <span className="mt-1 block text-[13px] text-steel">
                  Sedan ${pkg.priceSedan} · Truck or SUV ${pkg.priceTruckSuv}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'contact' && (
        <>
          <h2 className="m-0 mb-2 font-sans font-semibold text-[22px] text-platinum">
            Tell us where to find you
          </h2>
          {selectedPackage && (
            <p className="m-0 mb-5 text-[13px] text-steel">
              Package: <span className="text-platinum">{selectedPackage.name}</span> (
              {selectedPackage.duration}){' '}
              <button
                type="button"
                onClick={() => setStep('package')}
                className="underline text-platinum cursor-pointer bg-transparent border-0 p-0 text-[13px]"
              >
                Change
              </button>
            </p>
          )}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitContact();
            }}
          >
            <label className="flex flex-col gap-1 text-[13px] text-steel">
              Name
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] text-steel">
              Email
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
                aria-invalid={errorField === 'email'}
                aria-describedby={error ? errorId : undefined}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] text-steel">
              ZIP code
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                autoComplete="postal-code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
                aria-invalid={errorField === 'zip'}
                aria-describedby={error ? errorId : undefined}
              />
            </label>

            {error && (
              <div
                id={errorId}
                role="alert"
                className="p-[12px_14px] rounded-input flex items-center gap-2"
                style={{
                  background: 'rgba(240,68,56,0.10)',
                  border: '1px solid rgba(240,68,56,0.25)',
                }}
              >
                <Icon name="x" size={16} className="text-error shrink-0" />
                <span className="text-[14px] text-error">{error}</span>
              </div>
            )}

            <Button type="submit" variant="metal" size="lg" fullWidth iconRight="arrow-right">
              Continue
            </Button>
          </form>
        </>
      )}

      {step === 'schedule' && (
        <>
          <h2 className="m-0 mb-5 font-sans font-semibold text-[22px] text-platinum">
            Pick a time that works
          </h2>
          <iframe
            title="Pick a time"
            src={buildCalendlyUrl(
              calendlyUrl,
              { name: name.trim(), email: email.trim() },
              typeof window !== 'undefined' ? window.location.hostname : undefined,
            )}
            className="w-full rounded-input border-0"
            style={{ minHeight: 640, background: 'rgba(255,255,255,0.04)' }}
          />
          <p className="mt-3 mb-0 text-[13px] text-steel">
            Having trouble with the calendar?{' '}
            <a
              href={buildCalendlyUrl(calendlyUrl, { name: name.trim(), email: email.trim() })}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-platinum"
            >
              Book directly on Calendly
            </a>
            {' '}in a new tab.
          </p>
          <p className="mt-2 mb-0 text-[13px] text-steel">
            Booked through Calendly directly?{' '}
            <a
              href={buildStripeUrl(stripeDepositLink, email.trim())}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-platinum"
            >
              Pay your deposit here
            </a>
            .
          </p>
        </>
      )}

      {step === 'pay' && (
        <>
          <h2 className="m-0 mb-3 font-sans font-semibold text-[22px] text-platinum">
            You&apos;re booked! One last step.
          </h2>
          <p className="m-0 mb-5 text-[15px] text-steel">
            Redirecting you to secure payment. Use the same email (
            <span className="text-platinum">{email.trim()}</span>) so we can match your
            payment to your booking. Not redirected automatically?
          </p>
          <a href={buildStripeUrl(stripeDepositLink, email.trim())} className="block">
            <Button variant="metal" size="lg" fullWidth iconRight="arrow-right">
              Pay your deposit
            </Button>
          </a>
        </>
      )}
    </div>
  );
}
```

The schedule step can only be reached after a package is chosen (the contact step is only reachable from the picker or a valid `initialPackage`), so `calendlyUrl` is never `''` when the iframe renders.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test src/components/sections/BookingFlow/BookingFlow.test.tsx`
Expected: PASS, all tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/sections/BookingFlow/BookingFlow.tsx apps/web/src/components/sections/BookingFlow/BookingFlow.test.tsx
git commit -m "feat: add package picker step to BookingFlow with per-package Calendly URLs"
```

---

### Task 5: Book page wiring and final gates

**Files:**
- Modify: `apps/web/src/app/book/page.tsx` (full rewrite shown below)

**Interfaces:**
- Consumes: `resolvePackageSlug` (Task 1); `SiteSettingsQueryResult.calendlyUrlBronze/Silver/Gold` (Task 2); `BookingFlow` props `{ calendlyUrls, stripeDepositLink, initialPackage? }` (Task 4).
- Produces: working `/book` and `/book?package=<slug>` routes; the whole feature is done after this task.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `apps/web/src/app/book/page.tsx` with:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/components/sections/BookingFlow';
import { resolvePackageSlug } from '@/lib/booking/packages';
import { getSiteSettings } from '@/lib/sanity/queries/global';

export const metadata: Metadata = {
  title: 'Book Your Detail',
  description:
    'Pick a package, check your ZIP, choose a time, and reserve your mobile detail with a deposit.',
};

type BookPageProps = {
  searchParams: Promise<{ package?: string }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);

  if (
    !settings?.calendlyUrlBronze ||
    !settings?.calendlyUrlSilver ||
    !settings?.calendlyUrlGold ||
    !settings?.stripeDepositLink
  ) {
    notFound();
  }

  // Invalid or missing ?package= values fall back to the in-flow picker.
  const initialPackage = resolvePackageSlug(params.package) ?? undefined;

  return (
    <main className="min-h-screen bg-ink1 px-6 py-16">
      <div className="mx-auto w-full max-w-[560px]">
        <h1 className="m-0 mb-2 font-sans font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.03em] text-platinum">
          Book your detail
        </h1>
        <p className="m-0 mb-8 text-[16px] text-steel">
          Four quick steps: your package, your info, a time that works, and a deposit to lock
          it in.
        </p>
        <BookingFlow
          calendlyUrls={{
            bronze: settings.calendlyUrlBronze,
            silver: settings.calendlyUrlSilver,
            gold: settings.calendlyUrlGold,
          }}
          stripeDepositLink={settings.stripeDepositLink}
          initialPackage={initialPackage}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck (the gate Task 2 left red)**

Run: `pnpm --filter web check-types`
Expected: PASS with no errors.

- [ ] **Step 3: Run the full web test suite**

Run: `pnpm --filter web test`
Expected: PASS — packages, urls, Services, BookingFlow, and any other existing suites all green.

- [ ] **Step 4: Manual smoke test (optional but recommended)**

Run `pnpm dev:web`, then:
- `/book` shows the picker as step 1 of 4.
- `/book?package=gold` starts on contact (step 2 of 4) with "Package: Gold" and a working Change button.
- `/book?package=banana` starts on the picker with nothing selected.
- Homepage Services cards' Book now buttons carry `?package=bronze|silver|gold`.
- (404 on `/book` only reproduces once the old `calendlyUrl` is unset in Sanity and the new fields are still empty — expected until the manual Studio step is done.)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/book/page.tsx
git commit -m "feat: wire per-package Calendly URLs and preselection into book page"
```
