# Accessibility & Mobile Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 10 confirmed accessibility and mobile usability issues found in the RoadReady landing page code review.

**Architecture:** Changes are self-contained per file group: layout landmarks (layout.tsx), mobile nav (new MobileMenu client component + SiteHeader), footer responsive grid (SiteFooter + globals.css), and QuoteForm accessibility (QuoteForm + field molecules). No new dependencies needed — the existing Icon atom already has `menu` and `x` glyphs.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind v4 (via globals.css `@theme`), inline styles with CSS custom properties

## Global Constraints

- All new components are in `apps/web/src/components/<layer>/<Name>/`; each needs a `ComponentName.tsx` + `index.ts` barrel
- No `Co-Authored-By` lines in commits
- No em dashes in commit messages
- Do not upgrade Next.js; do not edit `sanity.types.ts` by hand
- SiteHeader is a Server Component — any interactive state must live in a 'use client' child

---

## Task 1: Layout Landmarks — Skip Link + `<main>`

**Fixes:** #7 (no `<main>` landmark), #8 (no skip-to-content link)

**Files:**
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/app/globals.css` (add `.rr-skip-link` rule)

**Interfaces:**
- Produces: `id="main-content"` anchor consumed by the skip link href

- [ ] **Step 1: Add skip-link CSS to globals.css**

  Append at the end of `apps/web/src/app/globals.css` (before the final closing brace, or just after the last `@media` block at line 332):

  ```css
  /* Skip-to-content link — visible on keyboard focus, hidden otherwise */
  .rr-skip-link {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -60px;
    z-index: 9999;
    padding: 10px 24px;
    background: var(--signal-orange);
    color: var(--off-white);
    font-family: var(--font-condensed);
    font-weight: 700;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-decoration: none;
    border-radius: var(--radius-md);
    transition: top var(--dur-fast) var(--ease-out);
  }
  .rr-skip-link:focus {
    top: 8px;
  }
  ```

- [ ] **Step 2: Update layout.tsx — add skip link + `<main>`**

  Replace the `<body>` block in `apps/web/src/app/layout.tsx` (lines 60-67):

  ```tsx
  <body>
    <a href="#main-content" className="rr-skip-link">
      Skip to main content
    </a>
    <SiteHeader navigation={headerNavigation} />
    <main id="main-content">
      {children}
    </main>
    <SiteFooter navigation={footerNavigation} />
    <SanityLive />
    {isDraftMode && <VisualEditing />}
  </body>
  ```

- [ ] **Step 3: Verify manually**

  Run `pnpm dev` from the repo root. Open `http://localhost:3000`, press Tab once — the skip link should become visible at the top center of the page. Press Enter — focus should jump past the header into the hero content. In browser DevTools → Accessibility tree, confirm a `main` landmark wraps the page content.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/app/layout.tsx apps/web/src/app/globals.css
  git commit -m "feat: add skip-to-content link and main landmark to layout"
  ```

---

## Task 2: SiteHeader — Mobile Nav + Functional Phone Button

**Fixes:** #1 (no mobile hamburger nav), #6 (phone button does nothing on mobile)

**Files:**
- Create: `apps/web/src/components/organisms/SiteHeader/MobileMenu.tsx`
- Modify: `apps/web/src/components/organisms/SiteHeader/SiteHeader.tsx`
- Modify: `apps/web/src/app/globals.css` (add mobile menu styles)

**Interfaces:**
- `MobileMenu` takes no props; self-contained with internal open/close state
- Produces: `id="mobile-nav"` anchor consumed by `aria-controls` on the hamburger button

- [ ] **Step 1: Create MobileMenu client component**

  Create `apps/web/src/components/organisms/SiteHeader/MobileMenu.tsx`:

  ```tsx
  'use client';

  import { useState } from 'react';
  import { Icon } from '@/components/atoms/Icon';

  const NAV_LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Coverage', href: '#coverage' },
    { label: 'Reviews', href: '#reviews' },
  ];

  export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rr-mobile-menu-btn"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            background: 'transparent',
            border: 'none',
            color: 'var(--off-white)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Icon name={open ? 'x' : 'menu'} size={24} />
        </button>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(18,19,22,0.97)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 20px 20px',
              gap: 4,
              zIndex: 19,
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'var(--steel-300)',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="tel:+12035550148"
              style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                color: 'var(--signal-orange)',
                textDecoration: 'none',
              }}
            >
              <Icon name="phone" size={20} />
              (203) 555-0148
            </a>
          </nav>
        )}
      </>
    );
  }
  ```

- [ ] **Step 2: Update SiteHeader to include MobileMenu and fix phone button**

  Replace `apps/web/src/components/organisms/SiteHeader/SiteHeader.tsx` with:

  ```tsx
  import { Badge } from '@/components/atoms/Badge';
  import { Icon } from '@/components/atoms/Icon';
  import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
  import type { HeaderNavigationQueryResult } from '@/sanity.types';
  import { MobileMenu } from './MobileMenu';

  type SiteHeaderProps = {
    navigation: HeaderNavigationQueryResult;
  };

  export function SiteHeader({ navigation }: SiteHeaderProps) {
    return (
      <header
        data-component="site-header"
        data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 20px',
          background: 'rgba(18,19,22,0.86)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span
            style={{
              width: 12,
              height: 28,
              background: 'var(--signal-orange)',
              clipPath: 'polygon(30% 0,100% 0,70% 100%,0 100%)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--off-white)',
            }}
          >
            Road<span style={{ color: 'var(--signal-orange)' }}>Ready</span>
          </span>
        </a>

        <nav
          className="rr-desktop-nav"
          aria-label="Main navigation"
          style={{ display: 'flex', gap: 22, marginLeft: 20 }}
        >
          {['Services', 'How it works', 'Coverage', 'Reviews'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: 'var(--steel-300)' }}
            >
              {l}
            </a>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="tel:+12035550148"
            className="rr-desktop-phone"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          >
            <Badge tone="caution">24/7</Badge>
            <span
              className="rr-numeric"
              style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--off-white)' }}
            >
              (203) 555-0148
            </span>
          </a>

          {/* Mobile-only phone link rendered as icon button */}
          <a
            href="tel:+12035550148"
            aria-label="Call dispatch"
            className="rr-mobile-phone"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--signal-orange)',
              color: 'var(--off-white)',
            }}
          >
            <Icon name="phone" size={20} />
          </a>

          <div className="rr-mobile-menu-wrapper" style={{ display: 'none' }}>
            <MobileMenu />
          </div>
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 3: Add mobile header CSS to globals.css**

  Append inside the `@media (max-width: 860px)` block in globals.css (after the `.rr-desktop-nav, .rr-desktop-phone { display: none !important; }` line):

  ```css
  .rr-mobile-phone {
    display: flex !important;
  }
  .rr-mobile-menu-wrapper {
    display: block !important;
  }
  ```

- [ ] **Step 4: Verify manually**

  Run `pnpm dev`. On desktop (>860px): nav links visible, phone number visible, hamburger hidden. Resize to <860px: nav and phone number hidden, orange phone icon and hamburger appear. Click hamburger: nav drawer slides down with all 4 links + phone number. Click a link or phone: drawer closes. Tab to hamburger, press Enter: drawer opens. Check `aria-expanded` toggles in DevTools.

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/components/organisms/SiteHeader/MobileMenu.tsx \
          apps/web/src/components/organisms/SiteHeader/SiteHeader.tsx \
          apps/web/src/app/globals.css
  git commit -m "feat: add mobile hamburger nav and wire phone button in SiteHeader"
  ```

---

## Task 3: SiteFooter — Responsive Grid

**Fixes:** #9 (4-column inline grid overflows on mobile)

**Note:** The CSS already has `.rr-footer-grid { grid-template-columns: 1fr !important; }` inside `@media (max-width: 860px)`, and `!important` does override inline styles. The actual fix is belt-and-suspenders: move the column definition out of the inline style into the CSS class so the responsive breakpoint controls it cleanly.

**Files:**
- Modify: `apps/web/src/components/organisms/SiteFooter/SiteFooter.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Add rr-footer-grid base columns to globals.css**

  Add a base (non-media-query) `.rr-footer-grid` rule in globals.css, just before the `@media (max-width: 860px)` block:

  ```css
  .rr-footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 32px;
  }
  ```

- [ ] **Step 2: Remove gridTemplateColumns, display, and gap from inline style in SiteFooter.tsx**

  In `apps/web/src/components/organisms/SiteFooter/SiteFooter.tsx` line 28, change:

  ```tsx
  // Before
  <div
    className="rr-footer-grid"
    style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32 }}
  >
  ```

  To:

  ```tsx
  // After
  <div className="rr-footer-grid">
  ```

- [ ] **Step 3: Verify manually**

  Dev server running — open the footer on desktop: 4-column layout. Resize to <860px: collapses to 1 column. Logo/badge in first row, then Contact, Hours, Company each on their own row.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/components/organisms/SiteFooter/SiteFooter.tsx \
          apps/web/src/app/globals.css
  git commit -m "fix: move footer grid columns to CSS class for responsive control"
  ```

---

## Task 4: QuoteForm — Form Element, Validation, Required Fields, aria-live

**Fixes:** #2 (no `<form>` element), #4 (submit without validation), #10 (required fields not marked)

**Files:**
- Modify: `apps/web/src/components/sections/Hero/QuoteForm.tsx`
- Modify: `apps/web/src/app/globals.css` (add `.rr-form-2col` responsive rule)

- [ ] **Step 1: Add responsive 2-column form grid to globals.css**

  Append before the skip-link CSS added in Task 1:

  ```css
  /* QuoteForm 2-col grid — collapses to 1 col on small phones */
  .rr-form-2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  @media (max-width: 480px) {
    .rr-form-2col {
      grid-template-columns: 1fr;
    }
  }
  ```

- [ ] **Step 2: Rewrite QuoteForm.tsx**

  Replace the full contents of `apps/web/src/components/sections/Hero/QuoteForm.tsx`:

  ```tsx
  'use client';

  import { useRef, useState } from 'react';
  import { Button } from '@/components/atoms/Button';
  import { Card } from '@/components/atoms/Card';
  import { Icon } from '@/components/atoms/Icon';
  import { FieldLabel } from '@/components/molecules/FieldLabel';
  import { Input } from '@/components/molecules/Input';
  import { LocationButton } from '@/components/molecules/LocationButton';
  import { PhotoUpload } from '@/components/molecules/PhotoUpload';
  import { Select } from '@/components/molecules/Select';
  import { StatusPill } from '@/components/molecules/StatusPill';
  import { Textarea } from '@/components/molecules/Textarea';

  /* RoadReady landing — the intake quote form. Mirrors the service_request
     model from mobile-tire-phase-plan.md. Front-end demo only for now: no
     backend call yet (the real service-request API lives in the separate
     TechBridge platform per the phase plan) — submit shows a placeholder
     confirmation with a fixed ETA/deposit outcome. Swap in a real
     `POST /api/service-requests` call when the backend is ready. */
  export function QuoteForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [located, setLocated] = useState(false);
    const [service, setService] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; phone?: string; service?: string }>({});
    const successRef = useRef<HTMLDivElement>(null);

    // Phase 4 deposit rule: ETA > 35 min OR after-hours → $70 deposit.
    const etaMin = 24;
    const afterHours = false;
    const depositApplies = etaMin > 35 || afterHours;

    function validate() {
      const next: typeof errors = {};
      if (!name.trim()) next.name = 'Name is required';
      if (!phone.trim()) next.phone = 'Phone number is required';
      if (!service) next.service = 'Please select a service type';
      setErrors(next);
      return Object.keys(next).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;
      setSubmitted(true);
      // Focus the success announcement after React re-renders
      setTimeout(() => successRef.current?.focus(), 50);
    }

    if (submitted) {
      return (
        <Card brackets padding={28} raised style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* aria-live so screen readers announce the state change */}
          <div
            ref={successRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
            style={{ outline: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <StatusPill status="success" icon="check-circle">
              Request received
            </StatusPill>
            <div>
              <h3
                style={{
                  margin: '0 0 6px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  color: 'var(--off-white)',
                }}
              >
                A tech is being dispatched
              </h3>
              <p style={{ margin: 0, color: 'var(--steel-300)', fontSize: 15 }}>
                We&apos;ve got your location. You&apos;ll get an SMS with your technician&apos;s name and a live
                ETA.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                }}
              >
                <div className="rr-eyebrow" style={{ color: 'var(--steel-300)' }}>
                  Est. arrival
                </div>
                <div
                  className="rr-numeric"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--signal-orange)' }}
                >
                  {etaMin} min
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                }}
              >
                <div className="rr-eyebrow" style={{ color: 'var(--steel-300)' }}>
                  Deposit
                </div>
                <div
                  className="rr-numeric"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 30,
                    color: depositApplies ? 'var(--caution-yellow)' : 'var(--signal-green)',
                  }}
                >
                  {depositApplies ? '$70' : '$0'}
                </div>
              </div>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: 'var(--steel-300)',
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: 'var(--signal-green)', flex: 'none', marginTop: 1 }}>
                <Icon name="check" size={16} strokeWidth={2.5} />
              </span>
              Under 35 min and within hours — no deposit. You pay the balance on-site when the job&apos;s done.
            </p>
          </div>
          <Button variant="secondary" fullWidth onClick={() => setSubmitted(false)}>
            Start another request
          </Button>
        </Card>
      );
    }

    return (
      <Card brackets padding={26} raised style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="rr-eyebrow">Get a technician</div>
          <h2
            style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--off-white)' }}
          >
            Request service
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rr-form-2col">
            <div>
              <FieldLabel htmlFor="qf-name">Name</FieldLabel>
              <Input
                id="qf-name"
                placeholder="Your name"
                aria-required="true"
                aria-describedby={errors.name ? 'qf-name-err' : undefined}
                invalid={Boolean(errors.name)}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <span id="qf-name-err" role="alert" style={{ fontSize: 13, color: 'var(--signal-red)', marginTop: 4, display: 'block' }}>
                  {errors.name}
                </span>
              )}
            </div>
            <div>
              <FieldLabel htmlFor="qf-phone">Phone</FieldLabel>
              <Input
                id="qf-phone"
                placeholder="(555) 000-0000"
                icon="phone"
                numeric
                inputMode="tel"
                aria-required="true"
                aria-describedby={errors.phone ? 'qf-phone-err' : undefined}
                invalid={Boolean(errors.phone)}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <span id="qf-phone-err" role="alert" style={{ fontSize: 13, color: 'var(--signal-red)', marginTop: 4, display: 'block' }}>
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div>
            <FieldLabel>Location</FieldLabel>
            <LocationButton
              located={located}
              address="I-84 W, Exit 17 · Waterbury, CT"
              onClick={() => setLocated(!located)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
              <span style={{ height: 1, flex: 1, background: 'var(--border-default)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--steel-500)',
                }}
              >
                or enter address
              </span>
              <span style={{ height: 1, flex: 1, background: 'var(--border-default)' }} />
            </div>
            <Input id="qf-address" placeholder="Street, city or nearest exit" icon="map-pin" />
          </div>

          <div className="rr-form-2col">
            <div>
              <FieldLabel htmlFor="qf-vehicle" optional>Vehicle</FieldLabel>
              <Input id="qf-vehicle" placeholder="Make / model" />
            </div>
            <div>
              <FieldLabel htmlFor="qf-tiresize" optional hint="Not sure? Leave blank">
                Tire size
              </FieldLabel>
              <Input id="qf-tiresize" placeholder="225/65R17" numeric />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="qf-service">Service type</FieldLabel>
            <Select
              id="qf-service"
              placeholder="What do you need?"
              aria-required="true"
              aria-describedby={errors.service ? 'qf-service-err' : undefined}
              invalid={Boolean(errors.service)}
              value={service}
              onChange={(e) => setService(e.target.value)}
              options={[
                'Flat repair',
                'Tire replacement / mount',
                'Roadside assistance (jump / lockout / fuel)',
                'Fleet / commercial',
              ]}
            />
            {errors.service && (
              <span id="qf-service-err" role="alert" style={{ fontSize: 13, color: 'var(--signal-red)', marginTop: 4, display: 'block' }}>
                {errors.service}
              </span>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="qf-notes" optional>Notes</FieldLabel>
            <Textarea
              id="qf-notes"
              rows={2}
              placeholder="Gate code, exit number, anything the tech should know…"
            />
          </div>

          <div>
            <FieldLabel optional>Photo of the tire</FieldLabel>
            <PhotoUpload />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth iconRight="arrow-right">
            Request a technician
          </Button>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: 'var(--steel-300)',
              lineHeight: 1.45,
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ color: 'var(--caution-yellow)', flex: 'none', marginTop: 1 }}>
              <Icon name="alert-triangle" size={16} />
            </span>
            Typical response is under 35 min. A{' '}
            <span className="rr-numeric" style={{ color: 'var(--caution-yellow)' }}>
              &nbsp;$70&nbsp;
            </span>{' '}
            deposit may apply if the ETA runs over 35 min or it&apos;s after hours — it goes toward your total.
          </p>
        </form>
      </Card>
    );
  }
  ```

  **Key changes from original:**
  - `<form onSubmit={handleSubmit} noValidate>` wraps all fields
  - `name` and `phone` are controlled state
  - `validate()` runs before `setSubmitted(true)`; returns early on error
  - Required fields get `aria-required="true"` and `aria-describedby` pointing to error spans
  - Error spans use `role="alert"` so screen readers announce them immediately
  - Success state has `role="status"` + `aria-live="polite"` and receives programmatic focus
  - All FieldLabel/Input pairs wired with matching `htmlFor`/`id`
  - `Button` gets `type="submit"` (removes `onClick`)
  - Both 2-column grids use `className="rr-form-2col"` (responsive, from Task 4 Step 1)

- [ ] **Step 3: Ensure Button accepts `type` prop**

  Check `apps/web/src/components/atoms/Button/Button.tsx` — if `type` is not in the prop types, add it. Open the file and look for the props interface. The Button should spread `...rest` onto the underlying `<button>` element, which already carries `type`. If `ButtonHTMLAttributes<HTMLButtonElement>` is in the spread, no change is needed. If `type` is explicitly omitted, add it:

  ```tsx
  // In Button props type, if not already present:
  type?: 'button' | 'submit' | 'reset';
  ```

- [ ] **Step 4: Verify manually**

  Load the form. Click "Request a technician" with all fields empty: three error messages appear (Name required, Phone required, Service required). Fill Name and Phone, leave Service empty, click again: only service error. Fill all three required fields, click: success confirmation appears and VoiceOver/screen reader announces the status change. Press Tab on page load with keyboard: all form fields receive visible focus rings. Test on 375px viewport: 2-column grids collapse to single column.

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/components/sections/Hero/QuoteForm.tsx \
          apps/web/src/app/globals.css
  git commit -m "fix: wrap QuoteForm in form element, add validation and aria accessibility"
  ```

---

## Task 5: PhotoUpload — Keyboard Accessibility

**Fixes:** #5 (PhotoUpload not reachable by keyboard)

**Files:**
- Modify: `apps/web/src/components/molecules/PhotoUpload/PhotoUpload.tsx`

**Problem:** The `<label>` wrapping the hidden `<input type="file">` is not in the tab order because `<label>` is not natively focusable. Adding `tabIndex={0}` makes it focusable; adding `onKeyDown` allows Enter/Space activation.

- [ ] **Step 1: Update PhotoUpload.tsx**

  Replace `apps/web/src/components/molecules/PhotoUpload/PhotoUpload.tsx` with:

  ```tsx
  import type { ChangeEventHandler, CSSProperties, HTMLAttributes, KeyboardEvent } from 'react';
  import { Icon } from '@/components/atoms/Icon';

  /* PhotoUpload — dashed drop target for the optional "snap a photo of the tire"
     triage field. Shows a thumbnail preview once a file is chosen. */
  type PhotoUploadProps = {
    fileName?: string;
    previewUrl?: string;
    onPick?: ChangeEventHandler<HTMLInputElement>;
    style?: CSSProperties;
  } & Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'>;

  export function PhotoUpload({ fileName, previewUrl, onPick, style, ...rest }: PhotoUploadProps) {
    const hasFile = Boolean(fileName || previewUrl);

    function handleKeyDown(e: KeyboardEvent<HTMLLabelElement>) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Trigger the hidden file input via the label's implicit association
        (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null)?.click();
      }
    }

    return (
      <label
        tabIndex={0}
        role="button"
        aria-label={hasFile ? `Photo attached: ${fileName ?? 'image'}. Press Enter to change` : 'Upload a photo of the tire. Press Enter to browse files'}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          minHeight: 72,
          padding: 12,
          background: 'var(--bg-input)',
          border: `2px dashed ${hasFile ? 'var(--signal-green)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'border-color var(--dur-fast) var(--ease-out)',
          outline: 'none',
          boxShadow: undefined,
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = 'var(--focus-ring)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...rest}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            flex: 'none',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            background: hasFile ? 'transparent' : 'var(--graphite-700)',
            color: hasFile ? 'var(--signal-green)' : 'var(--steel-300)',
          }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- ephemeral client-side object URL preview, not an optimizable asset
            <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Icon name={hasFile ? 'check-circle' : 'camera'} size={24} />
          )}
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-condensed)',
              fontWeight: 700,
              fontSize: 15,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--off-white)',
            }}
          >
            {hasFile ? 'Photo attached' : 'Snap a photo of the tire'}
          </span>
          <span
            style={{
              fontSize: 13,
              color: 'var(--steel-300)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {hasFile ? fileName : 'Helps us triage before we roll — optional'}
          </span>
        </span>
        <input type="file" accept="image/*" capture="environment" onChange={onPick} style={{ display: 'none' }} />
      </label>
    );
  }
  ```

  **Key changes:**
  - `tabIndex={0}` makes the label reachable by Tab
  - `role="button"` tells screen readers this is interactive
  - `aria-label` describes the action and current state
  - `onKeyDown` handles Enter/Space to trigger the hidden input's click
  - `onFocus`/`onBlur` add a visible focus ring matching other controls

- [ ] **Step 2: Verify manually**

  Tab through the full QuoteForm: the PhotoUpload zone should receive focus after the Notes textarea. A focus ring (orange box-shadow) should appear. Press Enter or Space: the native file picker should open. With VoiceOver/screen reader: the element should be announced as "Upload a photo of the tire. Press Enter to browse files, button".

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web/src/components/molecules/PhotoUpload/PhotoUpload.tsx
  git commit -m "fix: make PhotoUpload keyboard accessible with tabIndex and onKeyDown"
  ```

---

## Self-Review

### Spec Coverage

| Issue | Task | Status |
|-------|------|--------|
| #1 No mobile hamburger nav | Task 2 | Covered |
| #2 No `<form>` element | Task 4 | Covered |
| #3 FieldLabel/Input id disconnection | Task 4 | Covered |
| #4 Submit without validation | Task 4 | Covered |
| #5 PhotoUpload keyboard inaccessible | Task 5 | Covered |
| #6 Phone button non-functional | Task 2 | Covered |
| #7 No `<main>` landmark | Task 1 | Covered |
| #8 No skip-to-content link | Task 1 | Covered |
| #9 Footer 4-column grid overflows | Task 3 | Covered |
| #10 Required fields not marked | Task 4 | Covered |

### Placeholder Scan

No "TBD", "TODO", or "similar to Task N" references. All code blocks are complete. All file paths are exact.

### Type Consistency

- `QuoteForm` uses `handleSubmit(e: React.FormEvent)` — consistent with `<form onSubmit={handleSubmit}>`
- `PhotoUpload` `handleKeyDown` typed as `KeyboardEvent<HTMLLabelElement>` — consistent with `onKeyDown` on `<label>`
- `MobileMenu` has no props — consistent with `<MobileMenu />` call in SiteHeader
- `Button` `type="submit"` — forwarded via `ButtonHTMLAttributes` spread, no interface conflict
