# Alex Detailing Design System Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all RoadReady Tire Co. / Medina's branding and design tokens with the Alex Mobile Detailing near-monochrome luxury design system from `/Users/davidnaimi/Desktop/design_handoff_alex_detailing`.

**Architecture:** Rewrite all components in-place (same file paths) so Sanity integration and prop interfaces are preserved. Hardcode package/add-on data in a shared `packages.ts` file used by both the Services section and BookingModal. Gallery and FinalCTA rendered as static components directly in page.tsx.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4 (CSS-first @theme tokens), Sanity Studio v5, pnpm + Turborepo, `next/font/google` for Outfit font.

## Global Constraints

- Never edit `apps/web/src/sanity.types.ts` by hand — only via `pnpm --filter studio typegen:all`
- Outfit font only (weights 300/400/500/600/700), loaded via `next/font/google` as CSS variable `--font-sans`
- All component styles use inline `style={{}}` props (not Tailwind utility classes) — existing codebase convention
- Design tokens live in `@theme` block in `globals.css` — no `tailwind.config.js`
- `bg-metal` gradient utility: `linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)`
- Section padding: `py-24` (96px), max-width 1200px, `px-6` (24px gutter)
- Button border-radius: `var(--radius-btn)` = 10px; Card: `var(--radius-card)` = 16px
- No `Co-Authored-By` lines in commits; no em dashes in commit messages
- Do NOT commit directly to main — work on feat/ branch once new repo is created (for now commits go to local main since no remote)
- Line color on dark surfaces: `rgba(255,255,255,0.09)`

---

### Task 1: Foundation — globals.css + layout.tsx

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/layout.tsx`

**Interfaces:**
- Produces: CSS custom properties `--color-ink`, `--color-charcoal`, `--color-surf-d`, `--color-elev-d`, `--color-platinum`, `--color-silver`, `--color-steel`, `--color-paper`, `--color-surface`, `--color-ink1`, `--color-ink2`, `--color-muted`, `--color-line`, `--color-accent`, `--color-accent-d`, `--color-success`, `--color-warning`, `--color-error`, `--color-info`, `--radius-input`, `--radius-btn`, `--radius-card`, `--radius-panel`, `--font-sans`
- Produces: `bg-metal` utility class
- Produces: `<html>` with `className={outfit.variable}` applying `--font-sans`

- [ ] **Step 1: Replace globals.css**

Replace entire file content:

```css
@import "tailwindcss";

@theme {
  --color-ink:       #0C0E10;
  --color-charcoal:  #141619;
  --color-surf-d:    #1B1E22;
  --color-elev-d:    #23272C;
  --color-platinum:  #EDEFF1;
  --color-silver:    #C4C9D0;
  --color-steel:     #828A94;
  --color-paper:     #F4F5F6;
  --color-surface:   #FFFFFF;
  --color-ink1:      #14171A;
  --color-ink2:      #4A525C;
  --color-muted:     #727B85;
  --color-line:      #E6E8EB;
  --color-accent:    #3F4E62;
  --color-accent-d:  #AEBAC8;
  --color-success:   #12B76A;
  --color-warning:   #F79009;
  --color-error:     #F04438;
  --color-info:      #0BA5EC;
  --radius-input:  6px;
  --radius-btn:    10px;
  --radius-card:   16px;
  --radius-panel:  22px;
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif;
}

@utility bg-metal {
  background: linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%);
}

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--color-surface);
  color: var(--color-ink1);
  -webkit-font-smoothing: antialiased;
}
img, video { max-width: 100%; display: block; }
a { color: inherit; }
```

- [ ] **Step 2: Update layout.tsx font loading**

Replace existing three-font import with single Outfit import:

```tsx
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
```

And update `<html>` tag: `<html lang="en" className={outfit.variable}>` — remove any `rr-skip-link` or old font variable class references.

- [ ] **Step 3: Verify build**

```bash
pnpm --filter web build 2>&1 | tail -20
```

Expected: no TypeScript errors related to fonts or CSS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx
git commit -m "feat: replace design tokens with alex detailing palette and outfit font"
```

---

### Task 2: Button atom rewrite

**Files:**
- Modify: `apps/web/src/components/atoms/Button/Button.tsx`

**Interfaces:**
- Produces: `ButtonVariant = 'metal' | 'ink' | 'outline'`; `ButtonSize = 'sm' | 'md' | 'lg'`
- Consumers: SiteHeader (metal), BookingModal (metal + ink), Hero (metal + outline), FinalCTA (metal)

- [ ] **Step 1: Rewrite Button.tsx**

```tsx
'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type ButtonVariant = 'metal' | 'ink' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZES: Record<ButtonSize, { height: number; padding: string; font: number }> = {
  sm: { height: 38, padding: '0 16px', font: 14 },
  md: { height: 48, padding: '0 22px', font: 15 },
  lg: { height: 56, padding: '0 28px', font: 16 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  metal: {
    background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
    color: '#16181b',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.10)',
  },
  ink: {
    background: 'var(--color-ink1)',
    color: 'var(--color-platinum)',
    border: 'none',
    boxShadow: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-ink1)',
    border: '1.5px solid var(--color-line)',
    boxShadow: 'none',
  },
};

export function Button({
  children,
  variant = 'metal',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  style,
  ...rest
}: ButtonProps) {
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.metal;
  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: s.font,
        lineHeight: 1,
        borderRadius: 'var(--radius-btn)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: disabled ? 'var(--color-line)' : v.background,
        color: disabled ? 'var(--color-muted)' : v.color,
        border: disabled ? 'none' : v.border,
        boxShadow: disabled ? 'none' : v.boxShadow,
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'metal') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,.20), 0 8px 20px rgba(0,0,0,.12)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = disabled ? 'none' : (v.boxShadow as string ?? '');
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 17} />}
    </button>
  );
}
```

- [ ] **Step 2: Check TypeScript**

```bash
pnpm --filter web tsc --noEmit 2>&1 | grep -i "button\|error" | head -20
```

Expected: no errors about Button.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/atoms/Button/Button.tsx
git commit -m "feat: rewrite button atom with metal/ink/outline variants"
```

---

### Task 3: Shared data — packages.ts

**Files:**
- Create: `apps/web/src/lib/booking/packages.ts`

**Interfaces:**
- Produces: `Package`, `Addon`, `PACKAGES`, `ADDONS`, `CORE_ZIPS`, `TRAVEL_ZIPS`
- Consumers: Services section (display cards), BookingModal (pricing/step 1)

- [ ] **Step 1: Create packages.ts**

```bash
mkdir -p apps/web/src/lib/booking
```

```ts
export type Package = {
  id: string;
  name: string;
  price: number;
  duration: string;
  durationMin: number;
  description: string;
  includes: string[];
  popular?: boolean;
};

export type Addon = {
  id: string;
  label: string;
  price: number;
  durationMin: number;
};

export const PACKAGES: Package[] = [
  {
    id: 'express',
    name: 'Express Refresh',
    price: 89,
    duration: '~45 min',
    durationMin: 45,
    description: 'Quick refresh for a clean, polished look between full details.',
    includes: ['Exterior hand wash', 'Wheel & tire clean', 'Interior vacuum', 'Window wipe-down'],
  },
  {
    id: 'signature',
    name: 'Signature Detail',
    price: 249,
    duration: '~3 hr',
    durationMin: 180,
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
    id: 'ceramic',
    name: 'Ceramic Coating',
    price: 699,
    duration: '~5 hr',
    durationMin: 300,
    description: 'Professional-grade ceramic protection that lasts years, not weeks.',
    includes: [
      'Paint decontamination & prep',
      'Single-stage machine polish',
      '9H ceramic coating application',
      '24-hr cure time guidance',
    ],
  },
  {
    id: 'correction',
    name: 'Paint Correction',
    price: 549,
    duration: '~6 hr',
    durationMin: 360,
    description: 'Eliminate swirls, scratches, and oxidation for showroom-grade clarity.',
    includes: [
      'Multi-stage machine polishing',
      'Swirl & scratch removal',
      'Paint depth measurement',
      'Sealant finish coat',
    ],
  },
];

export const ADDONS: Addon[] = [
  { id: 'pet-hair',   label: 'Pet Hair Removal',    price: 40, durationMin: 30 },
  { id: 'engine',     label: 'Engine Bay Detail',    price: 45, durationMin: 30 },
  { id: 'headlight',  label: 'Headlight Restoration', price: 60, durationMin: 45 },
  { id: 'odor',       label: 'Odor Elimination',     price: 50, durationMin: 30 },
];

export const CORE_ZIPS = new Set([
  '78701','78702','78703','78704','78705',
  '78745','78746','78748','78749',
  '78751','78756','78757','78758',
]);

export const TRAVEL_ZIPS = new Set([
  '78610','78613','78620','78641','78660',
  '78664','78681','78737','78738',
]);

export function getTravelFee(zip: string): number {
  return TRAVEL_ZIPS.has(zip) ? 25 : 0;
}

export function isServiceableZip(zip: string): boolean {
  return CORE_ZIPS.has(zip) || TRAVEL_ZIPS.has(zip);
}
```

- [ ] **Step 2: Verify no TS errors**

```bash
pnpm --filter web tsc --noEmit 2>&1 | grep "packages" | head -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/booking/packages.ts
git commit -m "feat: add shared packages/addons data and zip zone helpers"
```

---

### Task 4: SiteHeader rewrite

**Files:**
- Modify: `apps/web/src/components/organisms/SiteHeader/SiteHeader.tsx`
- Modify: `apps/web/src/components/organisms/SiteHeader/MobileMenu.tsx` (if exists)

**Interfaces:**
- Consumes: `HeaderNavigationQueryResult` (unchanged prop type)
- Produces: 72px sticky header, Alex brand mark, platinum nav links, "Book now" metal button

- [ ] **Step 1: Rewrite SiteHeader.tsx**

```tsx
'use client';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { HeaderNavigationQueryResult } from '@/sanity.types';
import Link from 'next/link';
import { useState } from 'react';

const PHONE_HREF  = 'tel:+15124567890';
const PHONE_LABEL = '(512) 456-7890';

const FALLBACK_LINKS = [
  { label: 'Services',     href: '/#services',     openInNewTab: false },
  { label: 'How it works', href: '/#how-it-works', openInNewTab: false },
  { label: 'Coverage',     href: '/#coverage',     openInNewTab: false },
  { label: 'Reviews',      href: '/#reviews',      openInNewTab: false },
];

type SiteHeaderProps = { navigation: HeaderNavigationQueryResult };

export function SiteHeader({ navigation }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sanityLinks = navigation?.links ?? [];
  const navLinks = sanityLinks.length > 0 ? sanityLinks : FALLBACK_LINKS;

  return (
    <>
      <header
        data-component="site-header"
        data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(12,14,16,.86)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        {/* Brand mark */}
        <Link href="/" aria-label="Alex Detailing" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
            borderRadius: 9,
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: '#16181b',
            flexShrink: 0,
          }}>
            A
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-platinum)', letterSpacing: '0.06em' }}>
            ALEX·DETAILING
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <nav
          aria-label="Main navigation"
          style={{ display: 'flex', gap: 28, margin: '0 auto', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        >
          {navLinks.map((link) =>
            link.href ? (
              <a
                key={link.href}
                href={resolveNavHref(link.href)}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 400, color: 'var(--color-silver)', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ) : (
              <span key={link.label} style={{ fontSize: 14, color: 'var(--color-steel)' }}>{link.label}</span>
            )
          )}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <a href={PHONE_HREF} style={{ fontSize: 13, color: 'var(--color-silver)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
            {PHONE_LABEL}
          </a>
          <Button variant="metal" size="sm" style={{ display: 'none' }} id="header-book-btn">
            Book now
          </Button>
          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-silver)', padding: 4 }}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(12,14,16,.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column', padding: 24,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-platinum)', letterSpacing: '0.06em' }}>ALEX·DETAILING</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-silver)' }}>
              <Icon name="x" size={22} />
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.href}
                  href={resolveNavHref(link.href)}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-platinum)', textDecoration: 'none', padding: '8px 0' }}
                >
                  {link.label}
                </a>
              ) : (
                <span key={link.label} style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-steel)', padding: '8px 0' }}>{link.label}</span>
              )
            )}
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href={PHONE_HREF} style={{ fontSize: 16, color: 'var(--color-silver)', textDecoration: 'none' }}>{PHONE_LABEL}</a>
            <Button variant="metal" size="lg" fullWidth>Book now</Button>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Check TypeScript**

```bash
pnpm --filter web tsc --noEmit 2>&1 | grep -i "SiteHeader\|error" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/organisms/SiteHeader/
git commit -m "feat: rewrite SiteHeader with alex detailing brand and mobile drawer"
```

---

### Task 5: SiteFooter rewrite

**Files:**
- Modify: `apps/web/src/components/organisms/SiteFooter/SiteFooter.tsx`

**Interfaces:**
- Consumes: `FooterNavigationQueryResult` (unchanged prop type)

- [ ] **Step 1: Rewrite SiteFooter.tsx**

```tsx
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { FooterNavigationQueryResult } from '@/sanity.types';

type SiteFooterProps = { navigation: FooterNavigationQueryResult };

const FALLBACK_COLUMNS = [
  {
    _key: 'contact',
    heading: 'Contact',
    links: [
      { label: '(512) 456-7890', href: 'tel:+15124567890', openInNewTab: false },
      { label: 'Text to book', href: 'sms:+15124567890', openInNewTab: false },
      { label: 'alexdetailing.com', href: 'https://alexdetailing.com', openInNewTab: true },
    ],
  },
  {
    _key: 'hours',
    heading: 'Hours',
    links: [
      { label: 'Mon–Sat  8 am – 6 pm', href: null, openInNewTab: false },
      { label: 'Sun  9 am – 4 pm', href: null, openInNewTab: false },
    ],
  },
  {
    _key: 'nav',
    heading: 'Services',
    links: [
      { label: 'Express Refresh', href: '/#services', openInNewTab: false },
      { label: 'Signature Detail', href: '/#services', openInNewTab: false },
      { label: 'Ceramic Coating', href: '/#services', openInNewTab: false },
      { label: 'Paint Correction', href: '/#services', openInNewTab: false },
    ],
  },
];

export function SiteFooter({ navigation }: SiteFooterProps) {
  const sanityColumns = navigation?.columns ?? [];
  const columns = sanityColumns.length > 0 ? sanityColumns : FALLBACK_COLUMNS;
  const year = new Date().getFullYear();

  return (
    <footer
      data-component="site-footer"
      data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
      style={{ background: 'var(--color-ink)', borderTop: '1px solid rgba(255,255,255,0.09)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr)', gap: 48, marginBottom: 48 }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
                borderRadius: 9,
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: '#16181b',
              }}>A</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-platinum)', letterSpacing: '0.06em' }}>
                ALEX·DETAILING
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--color-steel)', maxWidth: 240 }}>
              Premium mobile detailing serving Austin and surrounding areas. We come to you.
            </p>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col._key}>
              <h3 style={{
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--color-steel)', margin: '0 0 14px',
              }}>
                {col.heading}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(col.links ?? []).map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      href={resolveNavHref(link.href)}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      style={{ fontSize: 14, color: 'var(--color-silver)', textDecoration: 'none' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.label} style={{ fontSize: 14, color: 'var(--color-silver)' }}>{link.label}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.09)',
          display: 'flex', flexWrap: 'wrap', gap: 12,
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-steel)' }}>
            &copy; {year} Alex Mobile Detailing LLC. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Service area'].map((l) => (
              <a key={l} href="#" style={{ fontSize: 13, color: 'var(--color-steel)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/organisms/SiteFooter/SiteFooter.tsx
git commit -m "feat: rewrite SiteFooter with alex detailing brand"
```

---

### Task 6: Services section rewrite

**Files:**
- Modify: `apps/web/src/components/sections/Services/Services.tsx`
- Delete: `apps/web/src/components/molecules/ServiceCard/` (replaced by inline PackageCard)

**Interfaces:**
- Consumes: `ServicesSectionProps` (Sanity type — prop interface unchanged)
- Produces: 4 package cards from `PACKAGES`, add-ons strip below

- [ ] **Step 1: Rewrite Services.tsx**

```tsx
'use client';

import { PACKAGES, ADDONS } from '@/lib/booking/packages';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ServicesSectionProps = Extract<PageSection, { _type: 'servicesSection' }>;

export function Services(_props: ServicesSectionProps) {
  return (
    <section id="services" aria-labelledby="services-heading" style={{ background: 'var(--color-paper)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        {/* Eyebrow + heading */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-steel)', marginBottom: 12 }}>
            Packages
          </span>
          <h2 id="services-heading" style={{ margin: 0, fontSize: 'clamp(32px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-ink1)' }}>
            Choose your detail
          </h2>
        </div>

        {/* Package cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                position: 'relative',
                background: 'var(--color-surface)',
                border: pkg.popular ? '2px solid var(--color-accent)' : '1.5px solid var(--color-line)',
                borderRadius: 'var(--radius-card)',
                padding: 28,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              {pkg.popular && (
                <span style={{
                  position: 'absolute', top: -12, left: 24,
                  background: 'var(--color-accent)', color: 'var(--color-platinum)',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 99,
                }}>
                  Most popular
                </span>
              )}
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, color: 'var(--color-ink1)' }}>{pkg.name}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-steel)' }}>{pkg.duration}</p>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-ink2)', lineHeight: 1.6 }}>{pkg.description}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pkg.includes.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--color-ink2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--color-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-ink1)' }}>${pkg.price}</span>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
                    color: '#16181b', border: 'none', borderRadius: 'var(--radius-btn)',
                    padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Book now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons strip */}
        <div style={{ marginTop: 48, padding: '28px 32px', background: 'var(--color-surface)', border: '1.5px solid var(--color-line)', borderRadius: 'var(--radius-panel)' }}>
          <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
            Add-ons
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {ADDONS.map((addon) => (
              <div
                key={addon.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  border: '1.5px solid var(--color-line)', borderRadius: 10,
                  padding: '10px 16px',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink1)' }}>{addon.label}</span>
                <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>+${addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Remove unused ServiceCard import warning (if any)**

```bash
pnpm --filter web tsc --noEmit 2>&1 | grep -i "services\|ServiceCard" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/sections/Services/Services.tsx
git commit -m "feat: rewrite Services section with hardcoded alex detailing packages"
```

---

### Task 7: Remaining marketing sections

**Files:**
- Modify: `apps/web/src/components/sections/Hero/Hero.tsx`
- Modify: `apps/web/src/components/sections/HowItWorks/HowItWorks.tsx`
- Modify: `apps/web/src/components/sections/Reviews/Reviews.tsx`
- Create: `apps/web/src/components/sections/Gallery/Gallery.tsx` + `index.ts`
- Create: `apps/web/src/components/sections/FinalCTA/FinalCTA.tsx` + `index.ts`
- Modify: `apps/web/src/components/sections/TrustBar/TrustBar.tsx` (if exists)
- Modify: `apps/web/src/components/sections/Coverage/Coverage.tsx` (if exists)

**Hero.tsx full rewrite:**

```tsx
'use client';

import { Button } from '@/components/atoms/Button';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HeroSectionProps = Extract<PageSection, { _type: 'heroSection' }>;

export function Hero(_props: HeroSectionProps) {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        background: 'var(--color-charcoal)',
        overflow: 'hidden',
        padding: '120px 24px 96px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(174,186,200,.10) 0%, transparent 70%)',
      }} />
      <div style={{ position: 'relative', maxWidth: 760 }}>
        <span style={{
          display: 'inline-block', marginBottom: 20,
          fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--color-accent-d)',
        }}>
          Austin&apos;s premium mobile detailing
        </span>
        <h1 style={{
          margin: '0 0 24px',
          fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.05,
          letterSpacing: '-0.03em', color: 'var(--color-platinum)',
        }}>
          Your car, detailed<br />at your door
        </h1>
        <p style={{
          margin: '0 0 40px', fontSize: 18, fontWeight: 300, lineHeight: 1.7,
          color: 'var(--color-silver)', maxWidth: 520, marginInline: 'auto',
        }}>
          Professional-grade results without leaving home. We bring the detail bay to you.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="metal" size="lg">Book a detail</Button>
          <Button variant="outline" size="lg" style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,.2)' }}>
            See packages
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Gallery/Gallery.tsx:**

```tsx
const GALLERY_ITEMS = [
  { src: '/alex/gallery-1.jpg', alt: 'Signature detail on black sedan' },
  { src: '/alex/gallery-2.jpg', alt: 'Ceramic coating application' },
  { src: '/alex/gallery-3.jpg', alt: 'Paint correction close-up' },
  { src: '/alex/gallery-4.jpg', alt: 'Interior deep clean' },
  { src: '/alex/gallery-5.jpg', alt: 'Wheel and tire detail' },
  { src: '/alex/gallery-6.jpg', alt: 'Glass polish result' },
];

export function Gallery() {
  return (
    <section id="gallery" style={{ background: 'var(--color-surf-d)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-steel)', marginBottom: 12 }}>
            Results
          </span>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-platinum)' }}>
            Before &amp; after
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.src}
              style={{
                aspectRatio: '4/3', background: 'var(--color-elev-d)', borderRadius: 'var(--radius-card)',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{item.alt}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**FinalCTA/FinalCTA.tsx:**

```tsx
'use client';

import { Button } from '@/components/atoms/Button';

export function FinalCTA() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
        padding: '96px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#16181b' }}>
          Ready for a flawless finish?
        </h2>
        <p style={{ margin: '0 0 36px', fontSize: 17, color: '#3a3e45', lineHeight: 1.7 }}>
          Book in under 2 minutes. $25 deposit secures your spot.
        </p>
        <Button variant="ink" size="lg">Book your detail</Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 1: Rewrite Hero.tsx** (content from above)

- [ ] **Step 2: Create Gallery files**

```bash
mkdir -p apps/web/src/components/sections/Gallery
```

Create `Gallery.tsx` (content from above) and `index.ts`:
```ts
export { Gallery } from './Gallery';
```

- [ ] **Step 3: Create FinalCTA files**

```bash
mkdir -p apps/web/src/components/sections/FinalCTA
```

Create `FinalCTA.tsx` (content from above) and `index.ts`:
```ts
export { FinalCTA } from './FinalCTA';
```

- [ ] **Step 4: Update HowItWorks if it exists**

Check `apps/web/src/components/sections/HowItWorks/HowItWorks.tsx` — replace any orange/RR colors with Alex tokens (`var(--color-ink1)`, `var(--color-platinum)`, `var(--color-paper)`, etc.). Replace any `var(--font-display)` or `var(--font-condensed)` with `var(--font-sans)`.

- [ ] **Step 5: TypeScript check**

```bash
pnpm --filter web tsc --noEmit 2>&1 | grep "error" | head -30
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/sections/
git commit -m "feat: rewrite hero and add gallery/finalcta sections"
```

---

### Task 8: Wire-up page.tsx + Sections.tsx dispatcher

**Files:**
- Modify: `apps/web/src/components/sections/Sections.tsx`
- Modify: `apps/web/src/app/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `Gallery`, `FinalCTA` components
- Produces: homepage renders all sections including Gallery and FinalCTA

- [ ] **Step 1: Update Sections.tsx**

Add imports for Gallery and FinalCTA section types if they are Sanity-driven. If they are purely static (no Sanity schema), skip this step — they get added directly in page.tsx.

Check current `Sections.tsx` for the switch/case pattern and add any new Sanity-driven section types.

- [ ] **Step 2: Update page.tsx**

In `apps/web/src/app/[[...slug]]/page.tsx`, for the homepage route (slug is undefined or empty), render `<Gallery />` and `<FinalCTA />` after `<Sections />`:

```tsx
import { Gallery } from '@/components/sections/Gallery';
import { FinalCTA } from '@/components/sections/FinalCTA';

// Inside the JSX, after <Sections sections={page.sections ?? []} />:
{isHomepage && <Gallery />}
{isHomepage && <FinalCTA />}
```

Where `isHomepage` = the page was fetched by HOMEPAGE_ID (check current page.tsx logic).

- [ ] **Step 3: Final TypeScript check**

```bash
pnpm --filter web tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 4: Final commit**

```bash
git add apps/web/src/components/sections/Sections.tsx apps/web/src/app/
git commit -m "feat: wire gallery and finalcta into homepage render"
```

---

### Task 9: Cleanup — remove obsolete RR files

**Files to delete** (verify each exists before deleting):
- `apps/web/src/components/molecules/ServiceCard/` (replaced by inline cards in Services.tsx)
- `apps/web/src/components/molecules/StepItem/` (if exists, replaced)
- `apps/web/src/components/molecules/TrustMarker/` (if exists)
- `apps/web/public/medinas/` — all Medina's images
- Any `rr-*` CSS class references still in layout or component files

- [ ] **Step 1: Audit remaining RR references**

```bash
grep -r "rr-\|medinas\|RoadReady\|Medina\|signal-orange\|graphite-950\|font-condensed\|font-display" apps/web/src --include="*.tsx" --include="*.ts" --include="*.css" -l
```

Fix each file found.

- [ ] **Step 2: Remove obsolete directories**

```bash
rm -rf apps/web/src/components/molecules/ServiceCard
rm -rf apps/web/public/medinas
```

Only delete files confirmed unused.

- [ ] **Step 3: Final build**

```bash
pnpm --filter web build 2>&1 | tail -30
```

Expected: successful build, no TypeScript errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove obsolete roadready components and medinas assets"
```
