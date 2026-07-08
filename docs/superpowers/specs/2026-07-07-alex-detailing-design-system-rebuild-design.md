# Design Spec: Alex Detailing — Full Design System Rebuild

**Date:** 2026-07-07
**Status:** Approved

## Overview

Replace the existing RoadReady Tire Co. visual system (orange/graphite, tire tread, corner brackets) with the Alex Mobile Detailing design system from the handoff at `/Users/davidnaimi/Desktop/design_handoff_alex_detailing/`. Every component is rewritten in place — preserving Sanity data integration and file structure — to achieve pixel-close fidelity to the handoff screenshots.

The handoff declares **high-fidelity**: every hex, size, weight, copy string, and interaction is authoritative. Screenshots in `/screenshots/` are the reference for each screen.

---

## Approach

Rewrite all components in place within the existing monorepo structure. One pass — no phased/broken intermediate state. Sanity data bindings, prop interfaces, and query files are preserved; only markup and styles change. New sections (Gallery, FinalCTA, BookingModal) are added as new files.

---

## Layer 1 — Foundations

### `apps/web/src/app/globals.css`
Replace entire file content. New content:

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
  --radius-input:    6px;
  --radius-btn:      10px;
  --radius-card:     16px;
  --radius-panel:    22px;
  --font-sans:       "Outfit", ui-sans-serif, system-ui, sans-serif;
}

@utility bg-metal {
  background: linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%);
}
```

Plus base resets (`box-sizing`, `html/body` bg to `ink`, body font/size/smoothing), a `.ad-eyebrow` utility (12px/600/0.16em/uppercase), and `@keyframes fadeUp` for entrance animation.

Dark surface hairline color (not a theme token): `rgba(255,255,255,0.09)` — use inline.

### `apps/web/src/app/layout.tsx`
- Remove existing `next/font/google` font imports (display/condensed/body fonts from RoadReady)
- Add `Outfit` with `subsets: ['latin']`, `weight: ['300','400','500','600','700']`, `display: 'swap'`
- Apply as `--font-sans` CSS variable on `<html>` or as `className` on `<body>`

---

## Layer 2 — Atoms

### `Button`
Three variants via a `variant` prop:

| Variant | Style |
|---|---|
| `metal` (default) | `bg-metal`, text `#16181b`/weight 600, `rounded-[10px]`, pad `13px 26px` (sm) / `16px 34px` (lg), shadow: `inset 0 1px 0 rgba(255,255,255,.55), 0 6px 18px rgba(0,0,0,.28)`, hover: `translateY(-2px)` + brightness 1.05 |
| `ink` | bg `ink1`, text `platinum`, same radius/padding |
| `outline` | 1.5px `line` border, bg `surface`, text `ink1` |
| `disabled` | bg `#E4E7EC`, text `#98A2B3`, `cursor-not-allowed` (applies to any variant when `disabled`) |

Size prop: `sm` (13–16px pad) / `md` (default) / `lg`.

### `Badge` / status pills
Fully rounded (999px), 13px/600, pad `6px 13px`. Four tones:
- `success`: bg `#E9F7EF` text `#087443`
- `warning`: bg `#FFF7E6` text `#8A5A00`
- `error`: bg `#FDECEA` text `#A3231A`
- `default` / "Most popular": bg `ink1` text `platinum`

### `Icon`
Keep current SVG system. Standardize stroke to 1.5–2px, `currentColor`. Add icons needed: `calendar`, `truck`, `sparkles`, `check-circle`, `clock`, `check`, `map-pin`, `lock`, `chevron-left`, `chevron-right`, `x`, `star`.

### `Input`
Border `1.5px solid var(--color-line)`, `border-radius: var(--radius-input)` (6px, but 9px inside booking flow — pass via prop or override), padding `12px 14px`, font `14.5px`. Focus: border `accent` + `box-shadow: 0 0 0 4px rgba(63,78,98,.12)`. Label (via `FieldLabel`): 12.5px/600/`ink2`.

### `Select` / `Textarea`
Same border/focus treatment as Input.

---

## Layer 3 — Molecules

### `PackageCard`
White card, `border-radius: 18px`, `1px solid line` border (popular = `2px solid ink1`), `shadow-md`. Hover: `translateY(-6px)` + `shadow-xl` + border → `accent`. Contents (top to bottom):
1. Optional "MOST POPULAR" pill (ink1 bg)
2. Package name — 20–21px/600
3. Tagline — 13.5px/muted
4. Price — 34px/700/-0.03em
5. Duration row — clock icon + duration string, 13.5px/steel
6. Hairline `line`
7. Feature list — check icon in `accent` color, 13.5px/ink2
8. Full-width select button: popular → ink variant, others → outline variant

Props: `name`, `price`, `duration`, `tagline`, `features: string[]`, `isPopular?: boolean`, `isSelected?: boolean`, `onSelect: () => void`.

### `AddonToggle`
Checkbox tile (2-col grid in Services section). Unchecked: 1.5px line border, bg surface. Checked: bg ink1, text platinum, white ✓ icon. Contents: addon name + price + duration.

Props: `name`, `price`, `duration`, `checked: boolean`, `onChange: () => void`.

### `OrderSummary`
Dark card (bg `ink1`, `radius-panel`). Sections: "ORDER SUMMARY" eyebrow, package line item, each addon, optional travel fee row, hairline, Total/Deposit today/Balance rows. `Deposit today` = accent-d color.

Props: `package: {name, price}`, `addons: {name, price}[]`, `travelFee: number`, `depositAmount: number`.

### `Stepper`
5 equal segments. Each: 3px bar + label below (12px). Completed/active bars = `bg-metal`, future = dark gray `#D1D5DB`. Labels: Package / Date & time / Details / Deposit / Done.

Props: `currentStep: 1 | 2 | 3 | 4 | 5`.

### `DatePicker`
Month calendar. Header: `‹ Month YYYY ›` nav buttons. 7-col grid (S M T W T F S). Rules:
- Past dates: disabled, muted text
- Sundays: disabled
- Dates where no slot fits given `serviceDuration`: disabled
- Available: `bg-paper` hover
- Selected: `bg-ink1` text `platinum`

Props: `value: string | null` (YYYY-MM-DD), `onChange: (date: string) => void`, `serviceDuration: number` (minutes), `bookedRanges: {date: string, start: number, end: number}[]`.

### `SlotGrid`
2-col grid of time buttons. Slots every 30 min from 8:00 AM to `(18:00 - serviceDuration)`. Booked/overlapping: struck-through text, `cursor-not-allowed`, muted. Available: outline style. Selected: `bg-ink1`.

Props: `date: string`, `serviceDuration: number`, `bookedRanges`, `value: number | null` (minutes from midnight), `onChange: (minutes: number) => void`.

### `ZipField`
`Input` + live status message below. Three states (per zip lookup):
- Core ZIPs (78701–78705, 78745, 78746, 78748, 78749, 78751, 78756, 78757, 78758): green pill "In range — no travel fee."
- Travel ZIPs (78610, 78613, 78620, 78641, 78660, 78664, 78681, 78737, 78738): amber pill "Covered — a flat $25 travel fee applies."
- Anything else: red pill "Sorry, that ZIP is outside our area."

Props: `value: string`, `onChange: (v: string) => void`, `onZipState: (state: 'core' | 'travel' | 'out' | null) => void`.

---

## Layer 4 — Organisms

### `SiteHeader`
- **Height:** 72px, sticky top-0, z-20
- **Background:** `rgba(12,14,16,.86)` + `backdrop-blur(14px)` + `1px solid rgba(255,255,255,0.09)` bottom border
- **Left:** Metal "A" mark (34px square, `rounded-[9px]`, `bg-metal`, letter "A" in `#16181b`/700) + wordmark `ALEX·DETAILING` (600, 0.22em tracking, uppercase, platinum)
- **Center nav:** Services / How it works / Gallery / Reviews / Coverage — silver, 14px, `margin: 0 auto`
- **Right:** "Book now" metal Button (`sm` size) — opens BookingModal
- **Mobile:** hamburger menu, nav collapses

Remove old phone number and dispatch badge. Remove logo image (`/medinas/logo.png`).

### `SiteFooter`
4-column grid (`1.4fr 1fr 1fr 1fr`), collapses to 1 col on mobile. Ink bg.
- Col 1: Brand — "A" mark + wordmark + 1-line brand description + social icons
- Col 2: Contact — phone, email, address
- Col 3: Hours — Mon–Sat 8 AM–6 PM, Sundays closed
- Col 4: SMS opt-in — phone input + "Opt in" button + "Msg & data rates apply. Reply STOP to unsubscribe." disclaimer

Bottom bar: © 2026 Alex Detailing · Privacy · Terms · Service area.

### `BookingModal` (new)
Overlay: `rgba(8,9,11,.72)` + `blur(6px)`. Dialog: max-width 720px, `radius-panel` 22px, bg white, slide-up entrance (`@keyframes slideUp`). Full-height sheet on mobile.

**Structure:**
```
[Dark header: "A" mark + "Book your detail" + ✕]
[Stepper — 5 segments]
[Scrollable body — step content]
[Footer nav — Back | hint text | Next/Pay/Done]
```

State (flat object, managed by `useReducer`):
```ts
{
  open: boolean, step: 1|2|3|4|5,
  pkgId: string, addons: Record<string, boolean>,
  viewYear: number, viewMonth: number,
  date: string | null, time: number | null,
  name: string, phone: string, email: string,
  address: string, zip: string, notes: string,
  vYear: string, vMake: string, vModel: string, vColor: string,
  cardNum: string, cardExp: string, cardCvc: string, cardZip: string,
  bookingId: string | null,
}
```

Derived helpers: `duration()`, `total()`, `travelFee()`, `balance()`, `slotsFor(date)`, `canAdvance(step)`.

**Step 1 — Package + add-ons:**
Radio-style package rows (selected = 2px ink1 border, paper bg, filled radio). 2-col add-on toggles. Selecting package or toggling addon resets `date` and `time`. Footer hint: `{duration} · ${total}`.

**Step 2 — Date & time:**
Two-col: DatePicker | SlotGrid. Hint: `{start} – {start+duration}`.

**Step 3 — Details:**
Fields: Full name, Mobile phone, Email, Service address, ZIP (ZipField — blocks Next if out-of-range), then Year / Make / Model / Color, Notes (optional). `canAdvance`: name + phone + address filled AND zip is core or travel.

**Step 4 — Deposit:**
Two-col (collapses on mobile: summary above form). Left: card number (auto-format 4-digit groups), Expiry MM/YY, CVC, ZIP. Lock icon + "Encrypted & secure" line. Reschedule/cancel policy box. Right: OrderSummary (sticky). Next label: "Pay $25 & confirm". On submit: generate `bookingId = "AD-" + random 5 digits`, advance to step 5.

**Step 5 — Confirmation:**
Green check (success color), "You're booked, {firstName}." heading, booking id `AD-#####`, "A text & email are on their way." Summary card: package + duration, date, time range, address, vehicle, Deposit paid $25 (success), Balance due on completion. **Done** closes modal and resets state.

---

## Layer 5 — Sections

### `Hero` (rewrite)
- **Background:** `radial-gradient(1200px 620px at 72% -8%, #20242a, #0C0E10 60%)`
- **Two-col grid** (`1.05fr / .95fr`), collapses to 1 col mobile, max-width 1200px, `py-24 px-6`
- **Left:**
  - Eyebrow pill: green live dot + "Now booking across the metro · Mon–Sat"
  - H1 (64px/700/-0.03em): "A flawless finish, delivered to your **driveway**." — "driveway" uses `bg-metal` clipped text (`-webkit-background-clip: text; color: transparent`)
  - Lead body: 19px/300/silver
  - CTA row: metal "Book now" button + outline "View packages" button (href `#services`)
  - Trust row: 3 stats — "4.9/5 Rating" · "2,400+ Details" · "Fully insured"
- **Right:**
  - 4:5 aspect ratio image slot (placeholder state: dark card with camera icon + "Drop a detailing / clean car photo")
  - Floating glass card (bottom-left of image): "100% satisfaction guarantee" — `backdrop-blur`, `rgba(255,255,255,0.08)` bg

### `TrustBar` (rewrite)
Ink bg. Centered row: `TRUSTED FOR` label (eyebrow style) + diamond `◆` separators + capabilities: Ceramic coatings · Paint correction · Fleet & luxury vehicles · Pre-sale reconditioning · Eco-friendly products.

### `Services` (rewrite)
Light bg (`paper`). Section header: eyebrow "SERVICES & PRICING", H1 "Choose your **level of shine**" (italic/bold accent on those words), 2-line subhead. 4-col PackageCard grid (collapses to 2-col tablet, 1-col mobile). Below cards: add-ons strip (2×2 AddonToggle grid with "Add-ons" subheading).

Package data is hardcoded in the component (matching the exact handoff pricing/features). This is correct since the booking flow also references package data directly via the reducer — keeping a single source of truth in code avoids a Sanity fetch dependency inside the modal.

### `HowItWorks` (rewrite)
Ink bg. Eyebrow "HOW IT WORKS". H1 "Four steps to a showroom finish". 4-col card grid (collapses to 2-col/1-col). Each card: step number (01–04, steel), `bg-elev-d` raised icon tile (40px, metal icon), title, body copy.

Steps:
1. Book online — Choose a package, add-ons, and a time that fits your schedule.
2. We come to you — A certified tech arrives with their own water and power — home or office.
3. We detail — Meticulous, uninterrupted work while you carry on with your day.
4. Pay & enjoy — Approve the finish and pay the balance. Backed by our guarantee.

### `Gallery` (new section)
Light bg. Eyebrow "BEFORE & AFTER". H2 "The difference, side by side." 3-col card grid (collapses to 1-col). Each card: split 4:3 aspect-ratio container — left half labeled "BEFORE", right half labeled "AFTER" (corner labels in ink pill). Caption row below: vehicle type + service name.

Gallery images are placeholder slots in initial implementation (dark bg with label). Sanity schema for `gallerySection` with `items: {beforeImage, afterImage, vehicleLabel, serviceLabel}[]`.

### `Reviews` (rewrite)
Light bg. Eyebrow "REVIEWS". H2 centered. 3-col card grid (collapses to 1-col). Each card: 5 gold stars (`#C9A24B`), blockquote text, avatar initials circle (ink1 bg), name + vehicle + package meta (13.5px/muted).

### `Coverage` (rewrite)
Ink bg. Two-col (collapses to 1-col). Left: H2 + body copy + ZipField + live result message + city pills row. Right: stylized radius "map" — dotted grid background, dashed circle, center dot, "≈ 25-mile core radius" caption.

### `FinalCTA` (new section)
Light bg (`paper`) wrapper, `py-24`. Contains a centered rounded ink panel (`radius-panel`, `bg-ink1`, `py-16 px-12`). Inside: H2 (platinum) + subhead (silver) + centered metal "Book now" button.

Sanity schema: `finalCtaSection` with `headline`, `subhead` fields.

### `SmsBanner`
Remove — the SMS opt-in is now in the footer. Remove section type from `Sections.tsx` dispatcher.

---

## Sanity schema additions

Add two new section types to the studio:
1. `gallerySection` — document in `schemas/sections/gallerySection/index.ts` with `items: array of {beforeImage, afterImage, vehicleLabel, serviceLabel}`
2. `finalCtaSection` — `schemas/sections/finalCtaSection/index.ts` with `headline`, `subhead` string fields

Register both in `schemas/sections/index.ts`, add to `websitePage.sections[]` array, add cases to `apps/web/src/components/sections/Sections.tsx`. Run `pnpm --filter studio typegen:all` after schema changes.

---

## Responsive breakpoints

- `≤ 860px`: header nav collapses → hamburger; hero 2-col → 1-col; 4-up grids → 2-col; booking modal → full-height bottom sheet (calendar above slot grid, order summary stacked above card form)
- `≤ 560px`: 4-up grids → 1-col; footer → 1-col

Minimum tap target: 44×44px throughout.

---

## Motion

- Default transitions: `300ms ease`
- Entrance: `fadeUp` (opacity 0→1, translateY 20px → 0, ~700ms ease)
- Metal buttons: hover `translateY(-2px)` + `filter: brightness(1.05)`
- PackageCards: hover `translateY(-6px)` + shadow escalation
- Respect `prefers-reduced-motion`: wrap all animations in `@media (prefers-reduced-motion: no-preference)`

---

## Assets

- **Font:** Outfit via `next/font/google` (weights 300/400/500/600/700)
- **Icons:** Inline SVGs, `currentColor`, 1.5–2px stroke — use Lucide or Heroicons compatible set
- **Images:** All image slots are placeholders; real photos supplied separately
- **Logo:** Metal "A" mark generated in CSS/SVG (no image file)

---

## Files changed / created

**Modified:**
- `apps/web/src/app/globals.css`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/atoms/Button/Button.tsx`
- `apps/web/src/components/atoms/Badge/Badge.tsx`
- `apps/web/src/components/atoms/Icon/Icon.tsx`
- `apps/web/src/components/molecules/Input/Input.tsx`
- `apps/web/src/components/molecules/Select/Select.tsx`
- `apps/web/src/components/molecules/Textarea/Textarea.tsx`
- `apps/web/src/components/organisms/SiteHeader/SiteHeader.tsx`
- `apps/web/src/components/organisms/SiteHeader/MobileMenu.tsx`
- `apps/web/src/components/organisms/SiteFooter/SiteFooter.tsx`
- `apps/web/src/components/sections/Hero/Hero.tsx`
- `apps/web/src/components/sections/TrustBar/TrustBar.tsx`
- `apps/web/src/components/sections/Services/Services.tsx`
- `apps/web/src/components/sections/HowItWorks/HowItWorks.tsx`
- `apps/web/src/components/sections/Reviews/Reviews.tsx`
- `apps/web/src/components/sections/Coverage/Coverage.tsx`
- `apps/web/src/components/sections/Sections.tsx`
- `apps/studio/schemas/sections/index.ts`
- `apps/studio/schemas/documents/websitePage/index.ts` (add new section types to array)

**Created:**
- `apps/web/src/components/molecules/PackageCard/PackageCard.tsx` + `index.ts`
- `apps/web/src/components/molecules/AddonToggle/AddonToggle.tsx` + `index.ts`
- `apps/web/src/components/molecules/OrderSummary/OrderSummary.tsx` + `index.ts`
- `apps/web/src/components/molecules/Stepper/Stepper.tsx` + `index.ts`
- `apps/web/src/components/molecules/DatePicker/DatePicker.tsx` + `index.ts`
- `apps/web/src/components/molecules/SlotGrid/SlotGrid.tsx` + `index.ts`
- `apps/web/src/components/molecules/ZipField/ZipField.tsx` + `index.ts`
- `apps/web/src/components/organisms/BookingModal/BookingModal.tsx` + `index.ts`
- `apps/web/src/components/organisms/BookingModal/bookingReducer.ts`
- `apps/web/src/components/sections/Gallery/Gallery.tsx` + `index.ts`
- `apps/web/src/components/sections/FinalCTA/FinalCTA.tsx` + `index.ts`
- `apps/studio/schemas/sections/gallerySection/index.ts`
- `apps/studio/schemas/sections/finalCtaSection/index.ts`

**Deleted:**
- `apps/web/src/components/atoms/TreadDivider/` (RoadReady-specific, no equivalent in Alex design)
- `apps/web/src/components/atoms/SectionEdge/` (same)
- `apps/web/src/components/sections/SmsBanner/` (replaced by footer SMS opt-in)
- `apps/web/src/components/sections/Hero/QuoteForm.tsx` (replaced by BookingModal)
- `apps/web/src/components/sections/DepositCallout/` (replaced by FinalCTA)

**Run after all schema changes:**
```bash
pnpm --filter studio typegen:all
```
