import { describe, expect, it } from 'vitest';
import { buildCalendlyUrl, buildStripeUrl, isValidEmail } from './urls';

describe('isValidEmail', () => {
  it('accepts a normal email', () => {
    expect(isValidEmail('sam@example.com')).toBe(true);
  });

  it('rejects strings without @ or domain dot', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('sam@nodot')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('buildCalendlyUrl', () => {
  it('prefills name and email as query params', () => {
    const url = new URL(
      buildCalendlyUrl('https://calendly.com/ar-detailing/mobile-detail', {
        name: 'Sam Jones',
        email: 'sam@example.com',
      }),
    );
    expect(url.searchParams.get('name')).toBe('Sam Jones');
    expect(url.searchParams.get('email')).toBe('sam@example.com');
    expect(url.searchParams.get('hide_gdpr_banner')).toBe('1');
    expect(url.origin + url.pathname).toBe('https://calendly.com/ar-detailing/mobile-detail');
  });

  it('preserves existing query params on the base URL', () => {
    const url = new URL(
      buildCalendlyUrl('https://calendly.com/x/y?month=2026-08', {
        name: 'Sam',
        email: 'sam@example.com',
      }),
    );
    expect(url.searchParams.get('month')).toBe('2026-08');
    expect(url.searchParams.get('email')).toBe('sam@example.com');
  });
});

describe('buildStripeUrl', () => {
  it('appends prefilled_email', () => {
    const url = new URL(buildStripeUrl('https://buy.stripe.com/test_abc123', 'sam@example.com'));
    expect(url.searchParams.get('prefilled_email')).toBe('sam@example.com');
    expect(url.origin + url.pathname).toBe('https://buy.stripe.com/test_abc123');
  });
});
