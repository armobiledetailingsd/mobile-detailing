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
