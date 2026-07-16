# Vehicle-size pricing for service packages

Date: 2026-07-12
Status: Approved

## Problem

AR Mobile Detailing prices every package two ways: a Sedan rate and a Truck or
SUV rate (see the business rate card: Bronze $99.99/$120, Silver $180/$249.99,
Gold $275/$300). The `servicesSection` schema and the web `Services` section
only support a single `price` per package, so the site cannot show real
pricing.

## Decision

Replace the single package `price` with two required fields and render both
rates on each package card. Chosen over (a) keeping `price` and adding an
optional truck field, which leaves a confusing legacy field in the Studio, and
(b) a flexible `{vehicleType, price}` rates array, which adds editor friction
for a distinction the business does not have (YAGNI).

## Changes

### Studio schema (`apps/studio/schemas/sections/servicesSection/index.ts`)

- In the `servicePackage` object: remove `price`; add `priceSedan`
  ("Sedan price ($)") and `priceTruckSuv` ("Truck or SUV price ($)"), both
  `number`, required, positive.
- Package preview subtitle becomes `$<sedan> / $<truckSuv>`.
- Add-ons keep their single `price` (they are flat-rate).

### Web (`apps/web/src/components/sections/Services/Services.tsx`)

- Card footer replaces the single `${price}` figure with a two-row rate list:
  "Sedan — $180" and "Truck or SUV — $249.99", with the existing Book now
  button. Rates are formatted as entered (e.g. 99.99 renders as $99.99).
- Update `Services.test.tsx` for the new fields.

### Types

- Run `pnpm --filter studio typegen:all`; commit the regenerated
  `apps/web/src/sanity.types.ts` with the schema change.

### Content (Sanity dataset mutation)

Replace the placeholder packages (Express/Signature/Ceramic/Correction) in the
homepage services section with the real rate card:

- **Bronze Package** — Sedan $99.99, Truck/SUV $120. Includes: Hand Washing;
  Spray Waxing; Trim and Tire Dressing; Interior and Plastic Wiping;
  Vacuuming; Cleaning: pedals, steering wheel, door panels, windows, small
  spot stains on upholstery, carpets.
- **Silver Package** — Sedan $180, Truck/SUV $249.99. Most popular. Includes:
  Machine Waxing or Sealant Application; Trim and Tire Dressing; Steam
  Cleaning (interior plastics, door panels, air vents); Deep Cleaning;
  Vacuuming; Leather Conditioning; Carpet and/or Upholstery Extraction;
  Shampooing; Cleaning: pedals, steering wheel, door jambs, windows (inside
  and outside).
- **Gold Package** — Sedan $275, Truck/SUV $300. Includes: Hand Washing; Clay
  Bar Treatment; Waxing; Sealant Application; Trim Restoration; Tire
  Dressing; Wheel Cleaning; Interior Plastic and Vent Steam Cleaning;
  Vacuuming; Leather Conditioning; Carpet, Floor Mats, and Upholstery
  Shampooing and Extraction; Cleaning: pedals, roof, trunk, steering wheel,
  door jambs, windows (inside and outside); Light Scratch and Swirl Removal;
  Engine Bay Work.

Add-ons (assumption: rate card screenshot was cropped; these three were
visible — confirm the full list with the owner): Headlights Restoration $50,
Dog Hair Removal $50, Rock Chip Touch-Ups $100.

Durations are not on the rate card; the schema requires them, so use
estimates (Bronze ~1.5 hr, Silver ~3 hr, Gold ~4.5 hr) and let the owner
adjust in the Studio.

## Out of scope

- `apps/web/src/lib/booking/packages.ts` hardcoded `PACKAGES`/`ADDONS`: unused
  by the booking flow (only ZIP helpers are imported). Leave as-is; cleanup
  candidate later.
- No vehicle-type selection in the booking flow.

## Testing

- Unit: `Services.test.tsx` renders both rates per package.
- Typegen output compiles; `pnpm --filter web` build/type-check passes.
- Manual: homepage services section shows Bronze/Silver/Gold with both rates
  after the content mutation.
