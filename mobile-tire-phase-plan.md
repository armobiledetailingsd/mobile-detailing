# Mobile Tire & Roadside Service — Implementation Phase Plan

Prepared against the existing TechBridge platform (`techBridge-front` Next.js 16 app, `techBridge-back` Express 5 + Postgres/Supabase API).

## Key architectural fact

TechBridge is already a **multi-tenant SaaS platform** for local service businesses. This client should be onboarded as a **new tenant with a new business vertical** (call it `mobile_service` / "roadside"), not a greenfield build. A large share of the requirements is already solved by the platform's tenant, lead, booking, reservation, payment-config, AI-agent, image-upload, and admin-dashboard infrastructure. The work is mostly (a) a new public intake flow, (b) a service-request management model, and (c) three genuinely new integrations: SMS, maps/ETA, and Zelle-email matching.

Note: the existing `/intake` flow is for onboarding **businesses onto the platform**, not end customers. The tire customer form is new, but it can reuse the same form/validation/S3-upload patterns.

---

## What is READY to reuse (already in the codebase)

| Capability | Where | Reuse for |
|---|---|---|
| Multi-tenant model, modules, entitlements | `routes/tenants.js`, `middleware/tenantContext.js`, `tenantAccess.js` | Onboard client as a tenant; gate features by module |
| Admin auth + RBAC (`tenant_owner`, `tenant_manager`) | `middleware/authMiddleware.js`, `tenantAccess.js` | Dashboard login, role-based permissions (Req #2) |
| Lead capture + leads admin | `migrations/..._add-ai-leads-table.js` (`ai_leads`: name/email/phone/status), front `admin/ai-leads` | Base pattern for customer requests + status (Req #2) |
| Reservation model w/ **deposit + status workflow** | `routes/reservations.js` (status: pending/confirmed/canceled/completed/no-show; `POST /:id/deposit`) | Closest analog to the service-request lifecycle + deposit (Req #2, #7) |
| Bookings + calendar | `routes/bookings.js` (`calendar_appointments` module), front `components/calendar/Calendar.tsx` (FullCalendar) | Scheduling / appointment calendar (Req #9) |
| Public, rate-limited, no-auth endpoints | `routes/publicBookings.js`, `publicSite.js`, `aiAgentPublic.js` | Public customer intake submit (Req #1) |
| AI agent **public chat** (per-website, rate-limited, session history) | `routes/aiAgentPublic.js`, front `components/ai-agent` | In-app chat MVP (Req #4) — request/response, not yet realtime |
| Image / file upload to S3 | front `api/s3-upload`, `api/intake/upload`, `lib/intake-storage.ts` | Customer photo upload + Zelle screenshot (Req #1, #7) |
| Transactional email (Resend) | front `lib/resend-client.ts`, `api/email` | Business + customer email notifications |
| Google OAuth tokens stored per tenant | `routes/google.js`, `googleTokens.js`, `agencyGoogleToken.js` | Foundation for Gmail API Zelle monitoring (Req #8) |
| Payment config + Stripe Connect | `routes/paymentConfig.js`, `connect.js`, `lib/stripeConnect.js` | Deposit infra (note: client wants Zelle, not Stripe — see #7) |
| Admin dashboard shell + charts (ApexCharts) | front `src/app/(admin)`, `components/charts` | Reporting dashboard (Req #12) |
| Background job / worker pattern | `lib/providerJobs.js`, `workflowExecutor.js`, `scripts/run-*-worker.js` | Zelle email polling, ETA jobs, notification queue |

---

## What is MISSING (must be built)

| Gap | Notes |
|---|---|
| **SMS provider integration** | Only a `sms_leads_and_comms` *module flag* exists — no Twilio/Vonage code. Sending, receiving, message history all new. (Req #3) |
| **Two-way texting / inbound webhook** | No inbound message handling, no conversation thread model. (Req #3) |
| **Maps / Distance Matrix / travel-time ETA** | No Google Maps or Mapbox integration anywhere. Core to the 35-min deposit rule. (Req #5) |
| **Business-hours / after-hours rules engine** | No business-hours config or time-window logic. (Req #6) |
| **Deposit trigger logic** (`travel>35min OR after-hours → require $70`) | New business rule wiring ETA + hours into request state. |
| **Zelle flow + Gmail email parsing/matching** | Stripe exists but no Zelle; Gmail tokens exist but no payment-email parser/matcher. (Req #7, #8) |
| **reCAPTCHA / spam protection** | Not present on public endpoints (relies on rate-limiting only). (Req #1) |
| **Customer service-request model** | `reservation`/`ai_leads` are close but lack tire-specific fields (tire size, vehicle, service-type enum, GPS location) and the exact status set. New `service_request` table recommended. |
| **GPS location capture** | Browser geolocation on the public form is new. (Req #1) |
| **Realtime chat (WebSockets)** | No WebSocket server; current chat is HTTP request/response. (Req #4 — optional) |
| **Technician dispatch + live status / GPS directions** | No technician entity, assignment, or live tracking. (Req #10) |
| **Service-area restrictions** | Not modeled. (Req #9, #12) |
| **Automated notification sequence** | Templated multi-step lifecycle messages (received → deposit → dispatched → arriving → complete) not built. (Req #11) |

---

## Phased plan

### Phase 0 — Foundation & decisions (0.5–1 wk)
- Onboard client as a tenant; define a `mobile_service` business type and enable modules: `lead_capture`, `calendar_appointments`, `sms_leads_and_comms`, `custom_ai_agent`.
- Lock vendor choices: **Twilio vs Vonage** (recommend Twilio — programmable Messaging + two-way webhooks), **Google Distance Matrix vs Mapbox** (recommend Google for traffic-aware ETA), confirm Gmail as the Zelle inbox.
- Design the `service_request` table (fields below) and status enum: `new → awaiting_deposit → deposit_received → en_route → completed / cancelled`.
- Provision API keys/secrets via existing `.env.local` + encryption pattern (`lib/encryption.js`).

`service_request` core fields: `customer_name, phone, location_text, lat, lng, tire_size, vehicle_info?, service_type, notes?, photo_urls[], status, deposit_required(bool), deposit_amount, deposit_status, eta_minutes, assigned_technician_id?, created_at`.

### Phase 1 — Customer intake form + request storage (1–1.5 wk) — *Req #1, #2 (storage)*
- Public mobile-friendly form (reuse `/intake` + S3 upload patterns) with the required fields, service-type selector, GPS-or-manual location, optional photo upload.
- Add **reCAPTCHA** + server validation on a new public `POST /api/public/service-requests`.
- Persist to `service_request`; default status `new`.
- **Deliverable:** working form that stores requests. Ready-to-go pieces: validation, S3 upload, public endpoint pattern, rate limiting.

### Phase 2 — Management dashboard (1 wk) — *Req #2, #11 (manual)*
- Admin list/search/filter of service requests; status update UI; activity log (reuse `securityAudit.js` pattern).
- Reuse RBAC + `ai-leads` admin page as the template.
- **Deliverable:** dispatcher can triage and update every request.

### Phase 3 — SMS notifications + two-way texting (1.5–2 wk) — *Req #3, #11*
- Integrate Twilio: outbound confirmation to customer + new-request alert to business.
- Inbound webhook → conversation thread model + message history.
- Dispatcher reply UI in the dashboard.
- Wire automated lifecycle messages (received, deposit required/confirmed, dispatched, arriving, completed).
- **Deliverable:** full SMS comms loop. (Biggest net-new integration.)

### Phase 4 — Travel-time ETA + deposit rules (1–1.5 wk) — *Req #5, #6, #7 (trigger)*
- Distance Matrix call (technician/base origin → customer) with traffic; store `eta_minutes`.
- Business-hours config + after-hours check.
- Rule: `eta > 35min OR after_hours ⇒ deposit_required = true`, auto-move status to `awaiting_deposit` and fire deposit SMS.
- **Deliverable:** automatic deposit determination.

### Phase 5 — Zelle deposit collection + email matching (1.5–2 wk) — *Req #7, #8*
- **MVP:** display Zelle email + $70, customer uploads payment screenshot, dispatcher marks "deposit received" → confirmation SMS.
- **Better:** Gmail API background worker (reuse Google token infra + worker pattern) polls for Zelle notifications, parses amount/sender, suggests a match to a request; dispatcher confirms (manual verification kept due to non-standard Zelle emails).
- **Deliverable:** deposit tracking tied to requests, semi-automated.

### Phase 6 — Scheduling & technician dispatch (1.5–2 wk) — *Req #9, #10*
- Appointment calendar via existing FullCalendar + bookings; rescheduling; service-area restriction config.
- Technician entity + job assignment; status updates; map deep-link for directions; mark complete.
- **Deliverable:** scheduled jobs and basic dispatch (live GPS tracking deferred).

### Phase 7 — Reporting (0.5–1 wk) — *Req #12*
- Dashboard metrics (total requests, revenue, deposits collected, avg response time, common services, service areas) using existing ApexCharts components.

### Phase 8 (optional) — Realtime in-app chat (1.5–2 wk) — *Req #4*
- Only if preferred over SMS. Add WebSocket server, read receipts, file uploads, push. The existing AI-agent chat UI is a starting point but is not realtime.

**Rough total:** ~9–13 weeks for Phases 0–7; +2 wks if in-app realtime chat (Phase 8) is added.

---

## Recommended sequencing rationale
SMS (Phase 3) is the client's primary communication channel, so it precedes the deposit/ETA logic that depends on it for notifications. Zelle (Phase 5) ships as a manual MVP first because the email-parsing "better" solution is inherently unreliable (non-standard Zelle emails) and shouldn't block go-live. In-app chat is treated as an optional alternative to SMS, not an addition, to avoid building two messaging stacks.

## Open questions for the client
1. Twilio or Vonage? Google Maps or Mapbox?
2. Single dedicated Gmail for Zelle, or monitor an existing inbox?
3. ETA origin: a fixed shop address, or live technician location?
4. How many technicians at launch (affects dispatch scope)?
5. SMS *or* in-app chat — or both?
