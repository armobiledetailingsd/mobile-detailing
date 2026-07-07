# Mobile Tire Landing Page — Design Brief & Prompt

Placeholder brand: **RoadReady Tire Co.** — "Mobile tire service that comes to you." Swap the name once you've picked one; nothing else in this brief depends on it.

Grounded in `mobile-tire-phase-plan.md`: the landing page's job is to feed the Phase 1 public intake flow (`POST /api/public/service-requests`) and set correct expectations for the Phase 4 deposit rule (ETA > 35 min OR after-hours → $70 deposit).

---

## 1. Visual direction — Rugged & Industrial

Mood: roadside signage meets a modern SaaS dashboard. Dark, high-contrast, built for a phone screen in bad light on the side of a highway. Nothing precious — big touch targets, heavy type, tire-tread and diagonal-cut motifs instead of soft gradients or rounded illustration.

**Color palette**

| Token | Hex | Usage |
|---|---|---|
| `graphite-950` | `#121316` | Page background |
| `graphite-900` | `#1B1D22` | Section/card background |
| `graphite-700` | `#2C2F36` | Borders, dividers |
| `signal-orange` | `#FF5A1F` | Primary CTA, links, active states |
| `caution-yellow` | `#FFC627` | Secondary accent, badges ("Same-day", "24/7"), status highlights |
| `off-white` | `#F4F3EF` | Primary text on dark |
| `steel-300` | `#9CA3AF` | Secondary/muted text |
| `signal-green` | `#37D67A` | Success states ("Deposit received", "Technician en route") |

Orange and yellow never sit on the same element — orange is the action color, yellow is the attention/badge color. Keep large surfaces graphite; let accent colors stay accents.

**Typography**

- Display/headlines: a heavy grotesk — Archivo Black or Barlow Condensed (Bold/Black), tight tracking, uppercase for short labels/eyebrows only.
- Body/UI: Inter or Barlow, Regular/Medium. Never lighter than Regular on dark backgrounds — contrast matters at roadside brightness.
- Numerals (ETA, deposit amount, phone number) get their own visual weight — tabular figures, slightly larger, often paired with the orange accent.

**Motifs**

- Tire-tread pattern as a subtle background texture or divider (SVG, low-opacity, never behind body text)
- Diagonal-cut section transitions (asymmetric clip-path edges) instead of straight horizontal bands
- Corner-bracket framing on cards/photos (like a viewfinder) — reinforces "we're precise, not fussy"
- Photography over illustration: real tires, real trucks, real technicians. If no photography exists yet, use bold flat-color placeholders with the tread motif rather than generic stock-illustration people.

---

## 2. Voice & tone

Direct, competent, no fluff — a technician talking to someone stranded on the shoulder, not a marketing department talking to a persona. Short sentences. Lead with time and price, not adjectives. "We'll be there in under 35 minutes or your deposit's waived" beats "Experience unparalleled roadside convenience."

---

## 3. Page structure

### Hero — embedded quote form
Headline + one-line subhead on the left (or above, on mobile), the intake form on the right/below as the visual anchor of the page — not a secondary element. Trust markers directly under the headline: service area, avg response time, "24/7" badge.

Form fields (mirrors the `service_request` model from the phase plan, Phase 0/1):
- Name
- Phone
- Location — "Use my location" (GPS) button as primary, manual address as fallback
- Vehicle info (optional)
- Tire size (optional, with a "not sure" option — don't block submission on it)
- Service type — select: Flat repair, Tire replacement/mount, Roadside assistance (jump/lockout/fuel), Fleet/commercial
- Notes (optional)
- Photo upload (optional) — "Snap a photo of the tire" helps triage
- Submit → "Request a technician"

Set expectations inline, small print under submit: response time and that a deposit may apply outside normal hours or long ETAs — this pre-empts the Phase 4 deposit-surprise problem at the UX level.

### Trust bar
Service area coverage, average dispatch time, count of jobs completed / years operating, licensing or insurance badge if applicable.

### How it works
3–4 numbered steps, tread-pattern dividers between them: Request → We locate & dispatch (ETA shown) → Deposit only if you're far out or it's after hours → Tire fixed on-site, pay the balance.

### Services grid
Cards for: Flat tire repair, Mobile tire replacement, Roadside assistance, Fleet/commercial accounts. Icon + one-line description + starting price if you have one.

### Deposit transparency
A short, plain-English callout explaining the $70 deposit rule (triggers when ETA > 35 min or the request is after business hours) before the customer hits it in the form. Builds trust instead of feeling like a surprise fee.

### Coverage / service area
Simple map or list of covered zip codes/cities.

### Social proof
Review quotes or star rating, ideally tied to Google reviews.

### SMS/urgency banner
Persistent or repeated CTA: "Stuck now? Text us: (xxx) xxx-xxxx" — matches the phase plan's SMS-first comms channel (Phase 3).

### Footer
Phone, hours, service area, legal links.

---

## 4. Build notes for this repo

This starter is Next.js 15 + Sanity Studio v5 + Tailwind v4 (CSS-first tokens, see `apps/web/src/app/globals.css`). Concretely:

- Drop the palette above into the `@theme` block in `globals.css` as `--color-graphite-950`, `--color-signal-orange`, etc. Don't create a `tailwind.config.js`.
- The hero quote form is a good candidate for a new **section** schema (e.g. `sections/quoteForm/`) so editors can toggle copy without a deploy — register it in `apps/studio/schemas/sections/index.ts`, add it to `websitePage.sections[]`, add the dispatcher case in `apps/web/src/components/sections/Sections.tsx`, then re-run `pnpm --filter studio typegen:all`.
- Form submission itself (`POST /api/public/service-requests`) is a Next.js route handler, not a Sanity concern — Sanity only owns the marketing copy/CTA text around the form.
- Build mobile-first: this is a roadside product, most traffic is a phone in bad conditions. Design the single-column mobile layout first, then expand.
- Corner-bracket cards, tread dividers, and diagonal section edges are good candidates for **atoms** (reusable across sections) rather than one-off CSS per section.

---

## 5. Portable design prompt

Paste this into whatever design/generation tool you're using (Claude, v0, Figma AI, etc.):

> Design a landing page for **RoadReady Tire Co.**, a mobile tire and roadside service business ("we come to you" — flat repair, tire replacement, roadside assistance). Style: rugged industrial, not soft or corporate — dark graphite background (#121316/#1B1D22), signal-orange accent (#FF5A1F) for primary actions, caution-yellow (#FFC627) for badges/highlights, off-white (#F4F3EF) text. Heavy grotesk display type (Archivo Black/Barlow Condensed), clean sans body (Inter/Barlow). Use tire-tread texture as a subtle motif, diagonal-cut section dividers, and corner-bracket framing on cards/photos — avoid rounded soft illustration.
>
> Mobile-first, single column on small screens. Hero section leads with a headline, a one-line subhead, trust badges (service area, average response time, 24/7), and a prominent embedded quote-request form (not a link to a form) with fields: name, phone, "use my location" GPS button with manual address fallback, optional vehicle info, optional tire size, service-type dropdown (flat repair / tire replacement / roadside assistance / fleet), optional notes, optional photo upload, submit button labeled "Request a technician." Include small print noting a deposit may apply for long ETAs or after-hours requests.
>
> Below the hero: a trust bar, a 3–4 step "how it works" sequence, a services grid (flat repair, tire replacement, roadside assistance, fleet/commercial), a plain-English deposit-policy callout, a coverage/service-area section, customer review quotes, a persistent "text us now" urgency banner, and a footer with phone/hours/service area. Tone: direct and competent, like a technician talking to someone stranded on the roadside — short sentences, lead with time and price, no marketing fluff.
