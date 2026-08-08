import { sendGAEvent } from '@next/third-parties/google';

// Thin wrapper so call sites don't need to guard against SSR/pre-hydration —
// sendGAEvent no-ops safely client-side once gtag is loaded, but this keeps
// the guard in one place instead of repeated at every call site.
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  sendGAEvent('event', name, params);
}
