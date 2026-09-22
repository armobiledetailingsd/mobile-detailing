import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CORE_ZIPS } from '@/lib/booking/packages';
import { BookingFlow } from './BookingFlow';

const PROPS = {
  calendlyUrls: {
    bronze: 'https://calendly.com/ar-detailing/bronze-detail',
    silver: 'https://calendly.com/ar-detailing/silver-detail',
    gold: 'https://calendly.com/ar-detailing/gold-detail',
  },
  stripeDepositLink: 'https://buy.stripe.com/test_abc123',
};

const GOOD_ZIP = [...CORE_ZIPS][0] as string;

async function pickPackage(name = /silver/i) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name }));
}

async function fillContact(overrides: { email?: string; zip?: string } = {}) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/name/i), 'Sam Jones');
  await user.type(screen.getByLabelText(/email/i), overrides.email ?? 'sam@example.com');
  await user.type(screen.getByLabelText(/zip/i), overrides.zip ?? GOOD_ZIP);
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

function scheduleViaCalendlyMessage() {
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://calendly.com',
        data: { event: 'calendly.event_scheduled' },
      }),
    );
  });
}

describe('BookingFlow package step', () => {
  it('starts on the package step with all three options', () => {
    render(<BookingFlow {...PROPS} />);
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bronze/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /silver/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gold/i })).toBeInTheDocument();
  });

  it('advances to the contact step after picking a package', async () => {
    render(<BookingFlow {...PROPS} />);
    await pickPackage();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
  });

  it('skips straight to contact when a package is preselected', () => {
    render(<BookingFlow {...PROPS} initialPackage="gold" />);
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/gold/i)).toBeInTheDocument();
  });

  it('returns to the package step via the change affordance', async () => {
    render(<BookingFlow {...PROPS} initialPackage="gold" />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /change/i }));
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
  });
});

describe('BookingFlow contact step', () => {
  it('blocks progress on an invalid email', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact({ email: 'not-an-email' });
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
  });

  it('blocks progress on an unserviceable ZIP', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact({ zip: '00000' });
    expect(screen.getByText(/don't cover that zip/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
  });

  it('marks the invalid field and announces the contact error to assistive tech', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact({ email: 'not-an-email' });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/valid email/i);
    const emailInput = screen.getByLabelText(/email/i);
    const zipInput = screen.getByLabelText(/zip/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', alert.id);
    expect(zipInput).toHaveAttribute('aria-invalid', 'false');
    expect(zipInput).toHaveAttribute('aria-describedby', alert.id);
  });
});

describe('BookingFlow schedule step', () => {
  it("advances to the schedule step with the selected package's prefilled Calendly iframe", async () => {
    render(<BookingFlow {...PROPS} />);
    await pickPackage(/silver/i);
    await fillContact();
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
    const iframe = screen.getByTitle(/pick a time/i) as HTMLIFrameElement;
    const src = new URL(iframe.src);
    expect(src.origin + src.pathname).toBe(PROPS.calendlyUrls.silver);
    expect(src.searchParams.get('email')).toBe('sam@example.com');
    expect(src.searchParams.get('name')).toBe('Sam Jones');
  });

  it('uses the bronze URL when bronze is selected', async () => {
    render(<BookingFlow {...PROPS} initialPackage="bronze" />);
    await fillContact();
    const iframe = screen.getByTitle(/pick a time/i) as HTMLIFrameElement;
    const src = new URL(iframe.src);
    expect(src.origin + src.pathname).toBe(PROPS.calendlyUrls.bronze);
  });

  it('offers a fallback Stripe deposit link alongside the Calendly fallback', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
    const calendlyLink = screen.getByRole('link', { name: /book directly on calendly/i });
    const calendlyHref = new URL((calendlyLink as HTMLAnchorElement).href);
    expect(calendlyHref.origin + calendlyHref.pathname).toBe(PROPS.calendlyUrls.silver);
    const payLink = screen.getByRole('link', { name: /pay your deposit here/i });
    const href = new URL((payLink as HTMLAnchorElement).href);
    expect(href.origin + href.pathname).toBe(PROPS.stripeDepositLink);
    expect(href.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });

  it('advances to the pay step when Calendly reports event_scheduled', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    scheduleViaCalendlyMessage();
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
    const payLink = screen.getByRole('link', { name: /pay .*deposit/i });
    const href = new URL((payLink as HTMLAnchorElement).href);
    expect(href.origin + href.pathname).toBe(PROPS.stripeDepositLink);
    expect(href.searchParams.get('prefilled_email')).toBe('sam@example.com');
  });

  it('ignores scheduled messages from non-Calendly origins', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://evil.example.com',
          data: { event: 'calendly.event_scheduled' },
        }),
      );
    });
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
  });
});

describe('pay step', () => {
  it('does not auto-navigate away from the pay step on its own', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    scheduleViaCalendlyMessage();
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();

    // Regression guard for the mobile bug: nothing should navigate or reset
    // the step on a timer. If it did, this would no longer be step 4.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
    expect(screen.queryByText(/redirecting/i)).not.toBeInTheDocument();
  });

  it('shows a redirecting state only after the deposit button is tapped', async () => {
    render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    scheduleViaCalendlyMessage();

    const user = userEvent.setup();
    const payLink = screen.getByRole('link', { name: /pay your deposit/i });
    await user.click(payLink);

    expect(screen.getByRole('link', { name: /redirecting/i })).toBeInTheDocument();
  });
});

describe('resuming an in-progress booking', () => {
  it('restores step, package, and contact info after a remount', async () => {
    const { unmount } = render(<BookingFlow {...PROPS} initialPackage="silver" />);
    await fillContact();
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
    unmount();

    render(<BookingFlow {...PROPS} />);
    expect(await screen.findByText(/step 3 of 4/i)).toBeInTheDocument();
    expect(screen.getByTitle(/pick a time/i)).toBeInTheDocument();
  });

  it('ignores saved state older than the max age', async () => {
    sessionStorage.setItem(
      'booking-flow-state',
      JSON.stringify({
        step: 'pay',
        selected: 'gold',
        name: 'Stale Person',
        email: 'stale@example.com',
        zip: '00000',
        savedAt: Date.now() - 3 * 60 * 60 * 1000,
      }),
    );

    render(<BookingFlow {...PROPS} />);
    expect(await screen.findByText(/step 1 of 4/i)).toBeInTheDocument();
  });
});
