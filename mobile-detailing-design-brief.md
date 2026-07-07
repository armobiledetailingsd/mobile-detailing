# Prompt for Claude Design — Mobile Detailing Website

Copy everything below into Claude Design.

---

Design a fresh design system and marketing site for a mobile auto detailing business — a service that comes to the customer's home, office, or driveway to detail their vehicle. This is a new brand with no existing visual identity; do not reuse or reference any tire/roadside/industrial styling. Design something distinct: premium, clean, automotive-luxury, trustworthy.

## Business model

- On-demand mobile detailing: customer books a time slot, tech arrives at their location with water/power self-sufficient equipment.
- Tiered service packages (e.g. Express Wash, Full Interior/Exterior Detail, Ceramic Coating, Paint Correction), each with a price and duration.
- Bookings require a deposit at time of scheduling to hold the slot; balance due on completion.

## Required functionality (site should be designed around these flows)

1. **Service & package selection** — customer picks a package (with pricing and estimated duration) and any add-ons (pet hair removal, engine bay clean, headlight restoration, etc.).
2. **Appointment scheduling** — real calendar/time-slot picker showing actual availability (not an instant-dispatch ETA model), with service-duration-aware slot blocking so back-to-back bookings don't overlap.
3. **Location capture** — address/zip entry with service-area validation (some zips may be out of range or carry a travel fee).
4. **Deposit collection** — a deposit (flat fee or % of package price) is charged at booking to confirm the slot; clearly disclosed reschedule/cancellation policy tied to the deposit.
5. **Confirmation** — booking summary (service, date/time, address, deposit paid, balance due) with SMS/email confirmation and reminder messaging.
6. **Trust content** — reviews/testimonials, before/after gallery, service-area coverage, "how it works" steps, guarantees.

## Key pages/sections to design

- Hero with primary booking CTA
- Services & pricing (package cards)
- How it works (3–4 step process)
- Multi-step booking flow: package → date/time → location/vehicle details → deposit payment → confirmation
- Service area / coverage
- Reviews / trust bar
- Before/after gallery
- Footer with contact, service hours, SMS opt-in

## Technical constraints for the design system

- Must translate cleanly to: Next.js 15 (App Router) + React 19, Tailwind CSS v4 using CSS-first `@theme` tokens (no `tailwind.config.js`), TypeScript.
- Component structure follows atomic design: atoms (Button, Input, Icon) → molecules (FieldLabel, Select, DatePicker, Card) → organisms (SiteHeader, SiteFooter) → sections (Hero, Services, Booking, Reviews).
- Mobile-first, fully responsive — most bookings will happen on a phone.
- Deliver: color palette, typography scale, spacing/radius tokens, and a component library (buttons, inputs, cards, calendar/slot picker, status pills, form fields), plus full-page mockups for the homepage and the booking flow.

## What to avoid

- Do not carry over any orange/yellow "roadside hazard" or industrial/utility styling from prior automotive-service projects — this needs its own distinct identity (consider a cleaner, premium palette: deep charcoal/navy, brushed metal accents, or a fresh color direction of your choice).
- Don't design an instant-dispatch/ETA experience — this is scheduled, calendar-based booking.
