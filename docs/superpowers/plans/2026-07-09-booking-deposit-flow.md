# Booking & Deposit Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/book` page that walks a customer through contact info + ZIP check → Calendly scheduling → Stripe deposit payment, with the Calendly/Stripe URLs editable in Sanity `siteSettings`.

**Architecture:** No custom backend. A client-side step machine (`BookingFlow`) embeds Calendly in an iframe (advancing on its `calendly.event_scheduled` postMessage) and hands off to a Stripe Payment Link. The customer's email is prefilled into both systems so bookings and payments can be matched by email in the two dashboards.

**Tech Stack:** Next.js 15 App Router, React 19, Sanity Studio v5, Tailwind v4, Vitest + React Testing Library (new — added in Task 1).

**Spec:** `docs/superpowers/specs/2026-07-09-booking-deposit-flow-design.md`

## Global Constraints

- Do NOT upgrade Next.js to 16 (repo lock, see CLAUDE.md).
- After any Sanity schema or GROQ query change, run `pnpm --filter studio typegen:all` and commit the regenerated `apps/web/src/sanity.types.ts`. Never edit that file by hand.
- Work on a `feat/` branch; never commit to `main`. Conventional commits (`feat:`, `fix:`, `test:`, `chore:`). No `Co-Authored-By` lines. No em dashes in commit messages.
- `sanityFetch` only in request context (page components); this feature never needs raw `client.fetch`.
- Components follow atomic layers: `BookingFlow` goes in `apps/web/src/components/sections/BookingFlow/` with an `index.ts` barrel.
- All commands run from repo root: `/Users/davidnaimi/Code/mobile-detailing`.

---

### Task 1: Vitest + React Testing Library infrastructure

The repo has no test runner. Add Vitest (jsdom) + RTL to `apps/web`, scoped minimally: config, setup file, `test` script, and one smoke test against existing code to prove the harness works.

**Files:**
- Modify: `apps/web/package.json` (devDependencies + `test` script)
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/vitest.setup.ts`
- Test: `apps/web/src/lib/booking/packages.test.ts`

**Interfaces:**
- Consumes: `isServiceableZip(zip: string): boolean` and `CORE_ZIPS: Set<string>` from `apps/web/src/lib/booking/packages.ts` (already exist).
- Produces: working `pnpm --filter web test` command that later tasks' test steps rely on.

- [ ] **Step 1: Install dev dependencies**

```bash
pnpm --filter web add -D vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Add the test script**

In `apps/web/package.json`, add to `"scripts"` (after `"check-types"`):

```json
"test": "vitest run",
```

- [ ] **Step 3: Create vitest config and setup**

Create `apps/web/vitest.config.ts`:

```ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

Create `apps/web/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Write a smoke test against existing ZIP logic**

Create `apps/web/src/lib/booking/packages.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CORE_ZIPS, isServiceableZip } from './packages';

describe('isServiceableZip', () => {
  it('accepts a known core ZIP', () => {
    const goodZip = [...CORE_ZIPS][0];
    expect(isServiceableZip(goodZip)).toBe(true);
  });

  it('rejects an unserviceable ZIP', () => {
    expect(isServiceableZip('00000')).toBe(false);
  });
});
```

Note: if `packages.ts` does not export `CORE_ZIPS`, add `export` to its declaration — do not duplicate the ZIP list in the test.

- [ ] **Step 5: Run the test to verify the harness works**

Run: `pnpm --filter web test`
Expected: 2 tests PASS. If module-resolution errors appear, fix the config (not the test) until this passes.

- [ ] **Step 6: Verify type-checking still passes**

Run: `pnpm --filter web check-types`
Expected: exit 0. If test files leak into the Next build types, add `"vitest.config.ts"` handling or exclusions as needed — but only if it actually fails.

- [ ] **Step 7: Commit**

```bash
git add apps/web/package.json apps/web/vitest.config.ts apps/web/vitest.setup.ts apps/web/src/lib/booking/packages.test.ts pnpm-lock.yaml
git commit -m "test: add vitest and react testing library setup for web"
```

---

### Task 2: `siteSettings` booking fields + query + typegen

Add a `booking` field group with `calendlyUrl` and `stripeDepositLink` to the `siteSettings` singleton, project them in the GROQ query, and regenerate types.

**Files:**
- Modify: `apps/studio/schemas/documents/siteSettings/index.ts`
- Modify: `apps/web/src/lib/sanity/queries/global.ts` (the `siteSettingsQuery` projection, lines 25-34)
- Modify (generated): `apps/web/src/sanity.types.ts` via typegen

**Interfaces:**
- Produces: `SiteSettingsQueryResult` (regenerated) gains `calendlyUrl: string | null` and `stripeDepositLink: string | null`. Task 5's page reads `settings?.calendlyUrl` / `settings?.stripeDepositLink` via the existing `getSiteSettings()` from `@/lib/sanity/queries/global`.

- [ ] **Step 1: Add the schema group and fields**

In `apps/studio/schemas/documents/siteSettings/index.ts`, add to the `groups` array:

```ts
    { name: 'booking', title: 'Booking' },
```

Add to the `fields` array (after the `blogEnabled` field):

```ts
    defineField({
      name: 'calendlyUrl',
      title: 'Calendly scheduling URL',
      type: 'url',
      description:
        'Public Calendly event link customers book on, e.g. https://calendly.com/your-team/mobile-detail',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
      group: 'booking',
    }),
    defineField({
      name: 'stripeDepositLink',
      title: 'Stripe deposit Payment Link',
      type: 'url',
      description:
        'Stripe Payment Link for the flat booking deposit, e.g. https://buy.stripe.com/xxxx',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
      group: 'booking',
    }),
```

- [ ] **Step 2: Add the fields to the GROQ projection**

In `apps/web/src/lib/sanity/queries/global.ts`, update `siteSettingsQuery`:

```ts
const siteSettingsQuery = groq`*[_id == $id && _type == "siteSettings"][0]{
  _id,
  _type,
  siteName,
  siteDescription,
  defaultOpenGraphImage,
  organizationLegalName,
  organizationUrl,
  blogEnabled,
  calendlyUrl,
  stripeDepositLink
}`;
```

- [ ] **Step 3: Regenerate types**

Run: `pnpm --filter studio typegen:all`
Expected: succeeds; `apps/web/src/sanity.types.ts` diff shows `calendlyUrl` and `stripeDepositLink` on the siteSettings document type and on `SiteSettingsQueryResult`.

- [ ] **Step 4: Type-check**

Run: `pnpm --filter web check-types`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/schemas/documents/siteSettings/index.ts apps/web/src/lib/sanity/queries/global.ts apps/web/src/sanity.types.ts
git commit -m "feat: add calendly and stripe deposit link fields to site settings"
```

---

### Task 3: Booking URL helpers (TDD)

Pure functions for email validation and building the prefilled Calendly/Stripe URLs. Keeping these out of the component makes the email-threading logic trivially testable.

**Files:**
- Create: `apps/web/src/lib/booking/urls.ts`
- Test: `apps/web/src/lib/booking/urls.test.ts`

**Interfaces:**
- Produces (consumed by Task 4's `BookingFlow`):
  - `isValidEmail(email: string): boolean`
  - `buildCalendlyUrl(base: string, prefill: { name: string; email: string }): string` — appends `name`, `email`, and `hide_gdpr_banner=1` query params
  - `buildStripeUrl(base: string, email: string): string` — appends `prefilled_email`

- [ ] **Step 1: Write the failing tests**

Create `apps/web/src/lib/booking/urls.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildCalendlyUrl, buildStripeUrl, isValidEmail } from './urls';

describe('isValidEmail', () => {
  it('accepts a normal email', () => {
    expect(isValidEmail('sam@example.com')).toBe(true);
  });

  it('rejects strings without @ or domain dot', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('sam@nodot')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('buildCalendlyUrl', () => {
  it('prefills name and email as query params', () => {
    const url = new URL(
      buildCalendlyUrl('https://calendly.com/ar-detailing/mobile-detail', {
        name: 'Sam Jones',
        email: 'sam@example.com',
      }),
    );
    expect(url.searchParams.get('name')).toBe('Sam Jones');
    expect(url.searchParams.get('email')).toBe('sam@example.com');
    expect(url.searchParams.get('hide_gdpr_banner')).toBe('1');
    expect(url.origin + url.pathname).toBe('https://calendly.com/ar-detailing/mobile-detail');
  });

  it('preserves existing query params on the base URL', () => {
    const url = new URL(
      buildCalendlyUrl('https://calendly.com/x/y?month=2026-08', {
        name: 'Sam',
        email: 'sam@example.com',
      }),
    );
    expect(url.searchParams.get('month')).toBe('2026-08');
    expect(url.searchParams.get('email')).toBe('sam@example.com');
  });
});

describe('buildStripeUrl', () => {
  it('appends prefilled_email', () => {
    const url = new URL(buildStripeUrl('https://buy.stripe.com/test_abc123', 'sam@example.com'));
    expect(url.searchParams.get('prefilled_email')).toBe('sam@example.com');
    expect(url.origin + url.pathname).toBe('https://buy.stripe.com/test_abc123');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test -- src/lib/booking/urls.test.ts`
Expected: FAIL — cannot resolve `./urls`.

- [ ] **Step 3: Implement the helpers**

Create `apps/web/src/lib/booking/urls.ts`:

```ts
// Client-side helpers threading the customer's identity into Calendly and
// Stripe so a booking and its deposit can be matched by email in both
// dashboards (no backend — see the design spec).

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function buildCalendlyUrl(
  base: string,
  prefill: { name: string; email: string },
): string {
  const url = new URL(base);
  if (prefill.name) url.searchParams.set('name', prefill.name);
  if (prefill.email) url.searchParams.set('email', prefill.email);
  url.searchParams.set('hide_gdpr_banner', '1');
  return url.toString();
}

export function buildStripeUrl(base: string, email: string): string {
  const url = new URL(base);
  if (email) url.searchParams.set('prefilled_email', email);
  return url.toString();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test -- src/lib/booking/urls.test.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/booking/urls.ts apps/web/src/lib/booking/urls.test.ts
git commit -m "feat: add booking url helpers for calendly and stripe prefill"
```

---

### Task 4: `BookingFlow` component (TDD)

Client component owning the 3-step state machine: contact/ZIP → Calendly iframe → Stripe payment link. Advances from schedule to pay on Calendly's `calendly.event_scheduled` postMessage.

**Files:**
- Create: `apps/web/src/components/sections/BookingFlow/BookingFlow.tsx`
- Create: `apps/web/src/components/sections/BookingFlow/index.ts`
- Test: `apps/web/src/components/sections/BookingFlow/BookingFlow.test.tsx`

**Interfaces:**
- Consumes: `isServiceableZip`, `CORE_ZIPS` from `@/lib/booking/packages`; `isValidEmail`, `buildCalendlyUrl`, `buildStripeUrl` from `@/lib/booking/urls` (Task 3); `Button`, `Icon` atoms.
- Produces: `BookingFlow({ calendlyUrl, stripeDepositLink }: { calendlyUrl: string; stripeDepositLink: string })` — a `'use client'` component, exported from the barrel, used by Task 5's page.

- [ ] **Step 1: Write the failing tests**

Create `apps/web/src/components/sections/BookingFlow/BookingFlow.test.tsx`:

```tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CORE_ZIPS } from '@/lib/booking/packages';
import { BookingFlow } from './BookingFlow';

const PROPS = {
  calendlyUrl: 'https://calendly.com/ar-detailing/mobile-detail',
  stripeDepositLink: 'https://buy.stripe.com/test_abc123',
};

const GOOD_ZIP = [...CORE_ZIPS][0];

async function fillContact(overrides: { email?: string; zip?: string } = {}) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/name/i), 'Sam Jones');
  await user.type(screen.getByLabelText(/email/i), overrides.email ?? 'sam@example.com');
  await user.type(screen.getByLabelText(/zip/i), overrides.zip ?? GOOD_ZIP);
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

describe('BookingFlow', () => {
  it('starts on the contact step', () => {
    render(<BookingFlow {...PROPS} />);
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
  });

  it('blocks progress on an invalid email', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact({ email: 'not-an-email' });
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it('blocks progress on an unserviceable ZIP', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact({ zip: '00000' });
    expect(screen.getByText(/don't cover that zip/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it('advances to the schedule step with prefilled Calendly iframe', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact();
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    const iframe = screen.getByTitle(/pick a time/i) as HTMLIFrameElement;
    const src = new URL(iframe.src);
    expect(src.origin + src.pathname).toBe(PROPS.calendlyUrl);
    expect(src.searchParams.get('email')).toBe('sam@example.com');
    expect(src.searchParams.get('name')).toBe('Sam Jones');
  });

  it('advances to the pay step when Calendly reports event_scheduled', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://calendly.com',
          data: { event: 'calendly.event_scheduled' },
        }),
      );
    });
    expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
    const payLink = screen.getByRole('link', { name: /pay .*deposit/i });
    const href = new URL((payLink as HTMLAnchorElement).href);
    expect(href.origin + href.pathname).toBe(PROPS.stripeDepositLink);
    expect(href.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });

  it('ignores scheduled messages from non-Calendly origins', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://evil.example.com',
          data: { event: 'calendly.event_scheduled' },
        }),
      );
    });
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test -- src/components/sections/BookingFlow/BookingFlow.test.tsx`
Expected: FAIL — cannot resolve `./BookingFlow`.

- [ ] **Step 3: Implement the component**

Create `apps/web/src/components/sections/BookingFlow/BookingFlow.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { isServiceableZip } from '@/lib/booking/packages';
import { buildCalendlyUrl, buildStripeUrl, isValidEmail } from '@/lib/booking/urls';

type Step = 'contact' | 'schedule' | 'pay';

type BookingFlowProps = {
  calendlyUrl: string;
  stripeDepositLink: string;
};

const STEP_NUMBER: Record<Step, number> = { contact: 1, schedule: 2, pay: 3 };

const INPUT_CLASSES =
  'w-full h-12 px-[14px] font-sans text-[15px] rounded-input text-platinum focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)] focus-visible:border-[var(--color-accent-d)]';

const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.07)',
  border: '1.5px solid rgba(255,255,255,0.15)',
} as const;

export function BookingFlow({ calendlyUrl, stripeDepositLink }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  function submitContact() {
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isServiceableZip(zip.trim().slice(0, 5))) {
      setError("Sorry, we don't cover that ZIP yet.");
      return;
    }
    setError(null);
    setStep('schedule');
  }

  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-panel py-8 px-7 backdrop-blur-[8px]">
      <p className="m-0 mb-[6px] text-[12px] font-semibold tracking-[0.12em] uppercase text-steel">
        Step {STEP_NUMBER[step]} of 3
      </p>

      {step === 'contact' && (
        <>
          <h2 className="m-0 mb-5 font-sans font-semibold text-[22px] text-platinum">
            Tell us where to find you
          </h2>
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
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
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
              />
            </label>

            {error && (
              <div
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
            src={buildCalendlyUrl(calendlyUrl, { name: name.trim(), email: email.trim() })}
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
            {' '}— then come back and refresh.
          </p>
        </>
      )}

      {step === 'pay' && (
        <>
          <h2 className="m-0 mb-3 font-sans font-semibold text-[22px] text-platinum">
            You&apos;re booked! One last step.
          </h2>
          <p className="m-0 mb-5 text-[15px] text-steel">
            Secure your appointment with a deposit. Use the same email (
            <span className="text-platinum">{email.trim()}</span>) so we can match your
            payment to your booking.
          </p>
          <a
            href={buildStripeUrl(stripeDepositLink, email.trim())}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
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

Create `apps/web/src/components/sections/BookingFlow/index.ts`:

```ts
export { BookingFlow } from './BookingFlow';
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test`
Expected: all tests PASS (including Tasks 1 and 3 suites).

- [ ] **Step 5: Type-check**

Run: `pnpm --filter web check-types`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/sections/BookingFlow/
git commit -m "feat: add booking flow component with calendly and stripe steps"
```

---

### Task 5: `/book` route

Static app route (same pattern as `apps/web/src/app/blog/`) that fetches `siteSettings` and renders `BookingFlow`. 404s if the booking URLs haven't been configured in Studio yet.

**Files:**
- Create: `apps/web/src/app/book/page.tsx`

**Interfaces:**
- Consumes: `getSiteSettings()` from `@/lib/sanity/queries/global` (returns `SiteSettingsQueryResult` with `calendlyUrl`/`stripeDepositLink` after Task 2); `BookingFlow` from `@/components/sections/BookingFlow` (Task 4).
- Produces: the `/book` URL that Task 6's CTAs link to.

- [ ] **Step 1: Create the page**

Create `apps/web/src/app/book/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/components/sections/BookingFlow';
import { getSiteSettings } from '@/lib/sanity/queries/global';

export const metadata: Metadata = {
  title: 'Book Your Detail',
  description:
    'Check your ZIP, pick a time, and reserve your mobile detail with a deposit.',
};

export default async function BookPage() {
  const settings = await getSiteSettings();
  if (!settings?.calendlyUrl || !settings?.stripeDepositLink) notFound();

  return (
    <main className="min-h-screen bg-ink1 px-6 py-16">
      <div className="mx-auto w-full max-w-[560px]">
        <h1 className="m-0 mb-2 font-sans font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.03em] text-platinum">
          Book your detail
        </h1>
        <p className="m-0 mb-8 text-[16px] text-steel">
          Three quick steps: your info, a time that works, and a deposit to lock it in.
        </p>
        <BookingFlow
          calendlyUrl={settings.calendlyUrl}
          stripeDepositLink={settings.stripeDepositLink}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify the route builds and type-checks**

Run: `pnpm --filter web check-types`
Expected: exit 0.

Then start the dev server (`pnpm --filter web dev`) and load `http://localhost:3000/book`:
- If `siteSettings` in Sanity has the booking URLs set, the contact step renders.
- If not yet set, expect a 404 — fill in the two fields in Studio (Site Settings → Booking tab) with a real Calendly link and Stripe Payment Link (test-mode link is fine), publish, and reload.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/book/page.tsx
git commit -m "feat: add /book route rendering the booking flow"
```

---

### Task 6: Wire dead-end CTAs to `/book`

The hero card's "Book your detail" button (`BookingCTA.tsx:68-72`) and the final CTA's "Book your detail" button (`FinalCTA.tsx:44`) currently do nothing. Point both at `/book` using the same `<a><Button/></a>` pattern `FinalCTA` already uses for its phone button.

**Files:**
- Modify: `apps/web/src/components/sections/Hero/BookingCTA.tsx:68-72`
- Modify: `apps/web/src/components/sections/FinalCTA/FinalCTA.tsx:44`

**Interfaces:**
- Consumes: the `/book` route from Task 5; `Link` from `next/link`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Wire the hero booking card button**

In `apps/web/src/components/sections/Hero/BookingCTA.tsx`, add the import:

```tsx
import Link from 'next/link';
```

Replace:

```tsx
      {serviceable && (
        <Button variant="metal" size="lg" fullWidth iconRight="arrow-right">
          Book your detail
        </Button>
      )}
```

with:

```tsx
      {serviceable && (
        <Link href="/book" className="block">
          <Button variant="metal" size="lg" fullWidth iconRight="arrow-right">
            Book your detail
          </Button>
        </Link>
      )}
```

- [ ] **Step 2: Wire the final CTA button**

In `apps/web/src/components/sections/FinalCTA/FinalCTA.tsx`, add the import:

```tsx
import Link from 'next/link';
```

Replace:

```tsx
          <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
```

with:

```tsx
          <Link href="/book" style={{ textDecoration: 'none' }}>
            <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
          </Link>
```

- [ ] **Step 3: Run tests and type-check**

Run: `pnpm --filter web test && pnpm --filter web check-types`
Expected: all PASS, exit 0.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/sections/Hero/BookingCTA.tsx apps/web/src/components/sections/FinalCTA/FinalCTA.tsx
git commit -m "feat: link book-your-detail ctas to the /book page"
```

---

### Task 7: Manual end-to-end verification

Required by the design spec before calling this done. No code changes expected; fix-forward with small commits if issues surface.

**Files:**
- None (verification only). Prerequisite: real values for Site Settings → Booking in Studio (a live Calendly event link and a Stripe Payment Link — Stripe test mode is fine).

**Interfaces:**
- Consumes: everything from Tasks 2-6.
- Produces: verified feature; findings reported to the user.

- [ ] **Step 1: Start the dev servers**

```bash
pnpm dev
```

Expected: web on `http://localhost:3000`.

- [ ] **Step 2: Verify CTA entry points**

On the homepage: enter a serviceable ZIP in the hero card, click Check, click "Book your detail" — lands on `/book`. Scroll to the final CTA, click its "Book your detail" — lands on `/book`.

- [ ] **Step 3: Verify the contact step gates**

On `/book`: submit with a bad email — inline error, no advance. Submit with a non-serviceable ZIP (e.g. `00000`) — inline error, no advance. Submit with valid name/email/serviceable ZIP — advances to step 2.

- [ ] **Step 4: Verify the Calendly step**

The Calendly iframe loads with name/email prefilled (visible on Calendly's confirmation form). Complete a real test booking. On confirmation, the flow advances to step 3 automatically. Also confirm the "Book directly on Calendly" fallback link opens the same prefilled page in a new tab.

- [ ] **Step 5: Verify the Stripe handoff**

Click "Pay your deposit" — Stripe's hosted page opens in a new tab with the email prefilled. In Stripe test mode, complete payment with card `4242 4242 4242 4242`.

- [ ] **Step 6: Verify dashboard matching**

The booking appears in the Calendly dashboard and the payment in the Stripe dashboard, both under the same email address.

- [ ] **Step 7: Report results**

Tell the user what passed and anything that didn't. Delete the test booking/payment if the user wants.
