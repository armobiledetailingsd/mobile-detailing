# Booking & Deposit Flow

**Date:** 2026-07-09
**Status:** Approved

## Goal

Give customers a working path from "check my ZIP" to "I have a scheduled appointment and paid my deposit." Today the "Book your detail" button in `BookingCTA.tsx` is a dead end (no `onClick`/`href`), the `depositCallout` section is marketing copy only, and there is no scheduling or payment integration anywhere in the codebase.

## Scope

Build a dedicated `/book` page that chains three third-party-backed steps — contact info, scheduling (Calendly), deposit payment (Stripe Payment Link) — reusing the existing ZIP-serviceability logic in `apps/web/src/lib/booking/packages.ts`. No custom backend, database, or webhook infrastructure.

---

## 1. Architecture

**Approach: third-party tools, no custom backend.** Calendly (free tier, embeddable, `postMessage` events) handles scheduling. A Stripe Payment Link (static hosted checkout page, no Stripe account code needed beyond creating the link in the dashboard) handles the deposit charge. Both are stitched together client-side only.

Rejected alternatives:
- **Build scheduling/payment natively** (custom calendar UI + Stripe Checkout Sessions via a serverless function) — more control and tighter integration, but this is a starter site with no backend today; adding one (API routes, Stripe webhook handling, a database for appointments) is disproportionate to the current stage of the project.
- **Webhook reconciler** (Vercel function listening to both Calendly's and Stripe's webhooks, matching by email, notifying via Slack/email) — considered and rejected in favor of the simpler shared-email approach below; revisit if manual matching becomes a real operational burden.

**Flow order:** contact info → ZIP check → schedule (Calendly) → pay deposit (Stripe). Collecting name + email first gives us the value we thread through the rest of the flow as a matching key.

**Route:** static Next.js route at `apps/web/src/app/book/page.tsx`, following the same pattern as `apps/web/src/app/blog/` — a hardcoded app route outside the Sanity catch-all (`[[...slug]]`), since this page is app plumbing/UI rather than editor-authored marketing content. It's a real page other CTAs can `Link` to, not a modal.

## 2. Components

- **`BookingFlow.tsx`** (new, `apps/web/src/components/sections/BookingFlow/`) — client component, owns the step state machine: `contact → schedule → pay`. Renders one step at a time.
- **Step 1 — Contact + ZIP.** Reuses the existing input pattern from `BookingCTA.tsx` (ZIP input, `isServiceableZip` check, success/error banner) plus new `name` and `email` fields. Blocks progress until ZIP is serviceable and email is present and looks like an email (basic client-side check, no verification).
- **Step 2 — Schedule.** Embeds Calendly's inline widget (`react-calendly` or a hand-rolled iframe — implementation detail for the plan) pointed at the `calendlyUrl` from `siteSettings`, passing `prefill: { email, name }`. Listens for the `calendly.event_scheduled` `postMessage` event to advance to step 3.
- **Step 3 — Pay deposit.** Renders a link/button to the Stripe Payment Link from `siteSettings.stripeDepositLink`, with `?prefilled_email=<email>` appended. This is an outbound link to Stripe's hosted page — the flow's job ends here, there's no return trip to confirm payment.
- **`BookingCTA.tsx`** — the "Book your detail" button (currently dead-end) becomes a `Link` to `/book`. Existing ZIP check stays as a lightweight teaser; the real check happens again in step 1 of `/book` (acceptable duplication — it's cheap, local, and keeps `/book` usable as a standalone entry point from other CTAs like `FinalCTA` or `depositCallout`).
- **`Sections.tsx`** — no new dispatcher case needed if `/book` is a standalone route rather than a `websitePage` section; revisit if the design calls for it to be composable into arbitrary pages.

## 3. Data flow — Calendly ↔ Stripe handoff

There is no backend, so there is no automatic link between a Calendly booking and its Stripe payment. Instead: step 1 collects **name + email**, which flows into both downstream systems as their native "who is this" field.

- Calendly embed receives `prefill.email` (and `name`) → the booking shows up in the Calendly dashboard tagged with that email.
- Stripe Payment Link receives `?prefilled_email=<email>` → the payment shows up in the Stripe dashboard tagged with the same email.

Reconciling a booking with its payment is a manual step: search both dashboards by email. This trades real-time automation for zero infrastructure. If volume grows to the point where manual matching is painful, the documented fallback is a small Vercel function reconciling both systems' webhooks — deliberately out of scope for this pass.

**Config:** `apps/studio/schemas/documents/siteSettings/index.ts` gets a new `booking` field group:

```
calendlyUrl        url  required
stripeDepositLink  url  required
```

Mirrored in the GROQ query for `siteSettings` and in `apps/web/src/sanity.types.ts` after typegen.

## 4. Error handling

- **ZIP not serviceable:** same treatment as today's `BookingCTA` — inline error banner, flow does not advance past step 1.
- **Missing/invalid email:** inline validation message under the field, flow does not advance.
- **Calendly embed fails to load** (network issue, ad blocker): show a fallback text link ("having trouble? book directly at [calendlyUrl]") so the flow isn't a hard dead end.
- **Stripe Payment Link:** no client-side error handling needed — it's an outbound link to a Stripe-hosted page; failures there are Stripe's problem to surface, not ours.
- **`siteSettings` missing `calendlyUrl`/`stripeDepositLink`:** both fields are `Rule.required()` in the schema, so this is a Studio-side validation error, not a runtime one — the page can assume they're present once published.

## 5. Testing

- **Component-level:** test `BookingFlow.tsx`'s step transitions with React Testing Library — bad ZIP blocks progress and shows the right message; good ZIP + valid email reveals the Calendly embed with correct `prefill.email`; a mocked `calendly.event_scheduled` postMessage event advances to the pay step with the correct `prefilled_email` param on the Stripe link.
- **Schema:** no automated test needed; Studio's built-in `Rule.required()` validation covers the new `siteSettings` fields, verified manually in Studio.
- **Manual verification (required before calling this done, per repo convention for UI changes):** run `/book` end-to-end in a browser — bad ZIP, good ZIP, a real Calendly test booking, confirm the email carries through to the Stripe checkout page.
- No new GROQ query complexity beyond two fields on the existing `siteSettings` projection, so the only typegen risk is the standard `pnpm --filter studio typegen:all` step after the schema change.

---

## Implementation Order

1. `siteSettings` schema: add `booking` field group (`calendlyUrl`, `stripeDepositLink`)
2. Run typegen, commit regenerated types
3. Update `siteSettings` GROQ query/projection to include the new fields
4. Build `BookingFlow.tsx` (contact/ZIP step, Calendly step, Stripe handoff step)
5. Add `/book` route rendering `BookingFlow`
6. Wire `BookingCTA.tsx`'s "Book your detail" button to `Link href="/book"`
7. Audit other dead-end CTAs (`FinalCTA.tsx`, `depositCallout` rendering) and point them at `/book` where appropriate
8. Manual end-to-end verification in browser
9. Commit on a feat/ branch

---

## Out of Scope

- Custom backend, database, or webhook infrastructure for booking/payment
- Automatic real-time reconciliation between Calendly and Stripe (manual email-matching only)
- Variable/tiered deposit amounts by package (flat deposit for all bookings)
- Return-trip payment confirmation UI (the flow ends at the outbound Stripe link)
- Editing the deposit amount shown in `depositCallout` copy to link to live payment (that section remains CMS copy; the live payment link lives in `siteSettings` and is surfaced via the new `/book` flow instead)
