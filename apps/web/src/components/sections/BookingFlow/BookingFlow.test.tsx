import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CORE_ZIPS } from '@/lib/booking/packages';
import { BookingFlow } from './BookingFlow';

const PROPS = {
  calendlyUrl: 'https://calendly.com/ar-detailing/mobile-detail',
  stripeDepositLink: 'https://buy.stripe.com/test_abc123',
};

const GOOD_ZIP = [...CORE_ZIPS][0] as string;

async function fillContact(overrides: { email?: string; zip?: string } = {}) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/name/i), 'Sam Jones');
  await user.type(screen.getByLabelText(/email/i), overrides.email ?? 'sam@example.com');
  await user.type(screen.getByLabelText(/zip/i), overrides.zip ?? GOOD_ZIP);
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

describe('BookingFlow', () => {
  it('starts on the contact step', () => {
    render(<BookingFlow {...PROPS} />);
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
  });

  it('blocks progress on an invalid email', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact({ email: 'not-an-email' });
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it('blocks progress on an unserviceable ZIP', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact({ zip: '00000' });
    expect(screen.getByText(/don't cover that zip/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it('advances to the schedule step with prefilled Calendly iframe', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact();
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    const iframe = screen.getByTitle(/pick a time/i) as HTMLIFrameElement;
    const src = new URL(iframe.src);
    expect(src.origin + src.pathname).toBe(PROPS.calendlyUrl);
    expect(src.searchParams.get('email')).toBe('sam@example.com');
    expect(src.searchParams.get('name')).toBe('Sam Jones');
  });

  it('advances to the pay step when Calendly reports event_scheduled', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://calendly.com',
          data: { event: 'calendly.event_scheduled' },
        }),
      );
    });
    expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
    const payLink = screen.getByRole('link', { name: /pay .*deposit/i });
    const href = new URL((payLink as HTMLAnchorElement).href);
    expect(href.origin + href.pathname).toBe(PROPS.stripeDepositLink);
    expect(href.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });

  it('ignores scheduled messages from non-Calendly origins', async () => {
    render(<BookingFlow {...PROPS} />);
    await fillContact();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://evil.example.com',
          data: { event: 'calendly.event_scheduled' },
        }),
      );
    });
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
  });
});
