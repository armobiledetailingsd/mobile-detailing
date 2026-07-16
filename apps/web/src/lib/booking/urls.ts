// Client-side helpers threading the customer's identity into Calendly and
// Stripe so a booking and its deposit can be matched by email in both
// dashboards (no backend — see the design spec).

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function buildCalendlyUrl(
  base: string,
  prefill: { name: string; email: string },
  embedDomain?: string,
): string {
  const url = new URL(base);
  if (prefill.name) url.searchParams.set('name', prefill.name);
  if (prefill.email) url.searchParams.set('email', prefill.email);
  url.searchParams.set('hide_gdpr_banner', '1');
  // Calendly only posts window.postMessage() events (e.g. calendly.event_scheduled)
  // to the parent window when embed_domain is present — normally added by Calendly's
  // widget.js, but this is a hand-rolled iframe so it has to be set explicitly.
  if (embedDomain) {
    url.searchParams.set('embed_domain', embedDomain);
    url.searchParams.set('embed_type', 'Inline');
  }
  return url.toString();
}

export function isTrustedCalendlyUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    return protocol === 'https:' && (hostname === 'calendly.com' || hostname.endsWith('.calendly.com'));
  } catch {
    return false;
  }
}

export function buildStripeUrl(base: string, email: string): string {
  const url = new URL(base);
  if (email) url.searchParams.set('prefilled_email', email);
  return url.toString();
}
