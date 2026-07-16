# Per-Package Calendly Scheduling — Design

Date: 2026-07-15
Status: Approved

## Problem

The booking flow uses a single Calendly event type for every package, so a Bronze (1.5 hr), Silver (2.5 hr), and Gold (4 hr) detail all block the same fixed duration on the detailer's calendar. Bookings can overlap the detailer's real working time.

## Solution overview

Create one Calendly event type per package with the correct duration baked in. Calendly's availability engine blocks the detailer's connected calendar for the full event duration regardless of which event type booked it, so overlap prevention is automatic — no custom scheduling logic. The site changes are plumbing: store three Calendly URLs, let the customer pick a package, and load the matching event type.

## Calendly setup (manual, outside this repo)

Under the existing Calendly account, create three event types, all bound to the same detailer calendar:

| Event type | Duration | Buffer after |
|---|---|---|
| Bronze Detail | 1 hr 30 min | 30 min |
| Silver Detail | 2 hr 30 min | 30 min |
| Gold Detail | 4 hr | 30 min |

The 30-minute "after event" buffer leaves drive time between jobs. Because all three share one calendar, any booking blocks availability across all event types.

Paste each event type's public URL into Sanity Site Settings (below).

## Sanity schema (`apps/studio/schemas/documents/siteSettings/index.ts`)

Replace the single `calendlyUrl` field with three required `url` fields in the `booking` group:

- `calendlyUrlBronze` — "Calendly URL — Bronze (1.5 hr)"
- `calendlyUrlSilver` — "Calendly URL — Silver (2.5 hr)"
- `calendlyUrlGold` — "Calendly URL — Gold (4 hr)"

Same validation as today (`required`, https). No data migration script: the old `calendlyUrl` value is re-entered into the Bronze/Silver/Gold fields by hand in Studio, and Studio's "unknown field" affordance removes the stale value.

After the schema change: `pnpm --filter studio typegen:all`, commit the regenerated `sanity.types.ts`.

Update the site-settings GROQ projection in `apps/web/src/lib/sanity/queries/global.ts` to select the three new fields.

## Web app

### Package slugs (`apps/web/src/lib/booking/packages.ts`)

- Replace the stale `PACKAGES` array (old Express/Signature/Ceramic/Correction lineup, unused by live pages) with the current Bronze/Silver/Gold data matching `apps/studio/scripts/update-services-pricing.ts` (name, durations, sedan/truck pricing).
- Add `type PackageSlug = 'bronze' | 'silver' | 'gold'`.
- Add `resolvePackageSlug(name: string): PackageSlug | null` — lowercases and trims the Sanity package name and matches it against the known slugs. Sanity items have no stable key, so the name is the join key; unknown names return `null`.

### Services section (`apps/web/src/components/sections/Services/Services.tsx`)

Each package card's "Book now" button links to `/book?package=<slug>` via `resolvePackageSlug(pkg.name)`. If the slug can't be resolved, fall back to plain `/book`.

### Book page (`apps/web/src/app/book/page.tsx`)

- Read `searchParams.package`; validate against `PackageSlug`. Invalid or missing values are treated as "no preselection", never an error.
- `notFound()` if any of the three Calendly URLs or the Stripe link is missing from settings.
- Pass `{ bronze, silver, gold }` Calendly URLs and the optional preselected slug into `BookingFlow`.

### BookingFlow (`apps/web/src/components/sections/BookingFlow/BookingFlow.tsx`)

Steps become **1 Package → 2 Contact → 3 Schedule → 4 Pay**.

- New first step "Choose your package": three compact options showing name, duration, and sedan/truck prices, sourced from `PACKAGES`.
- If a valid `?package=` slug was passed in, it's preselected and the flow starts on the Contact step; the chosen package is shown with a "change" affordance that returns to step 1.
- The Schedule step builds the iframe URL (and the "book directly" fallback link) from the selected package's Calendly URL. The `calendly.event_scheduled` postMessage listener, name/email prefill, `embed_domain` handling, and Stripe deposit redirect are unchanged.

## Error handling

- Invalid `?package=` → ignored; picker renders unselected.
- Unresolvable package name on a Services card → link to plain `/book`.
- Missing Calendly URL in Sanity → `/book` returns 404 (same behavior as today, now across three fields).

## Testing

- `packages.test.ts` (new or extended): `resolvePackageSlug` accepts "Bronze"/"silver "/"GOLD", rejects unknown names.
- `BookingFlow.test.tsx`: package step renders three options; preselected slug skips to Contact; schedule iframe src uses the selected package's URL; existing contact/schedule/pay assertions updated for step renumbering.
- `Services.test.tsx`: card hrefs carry `?package=<slug>`; unknown name falls back to `/book`.
- `book/page` behavior: 404 when any Calendly URL missing (covered at whatever level existing page tests live).

## Out of scope

- Vehicle-size-dependent durations (one duration per package regardless of sedan vs truck/SUV).
- Add-on time extending the Calendly slot.
- Any backend or webhook work; the flow stays client-side, matching the existing booking-deposit design.
