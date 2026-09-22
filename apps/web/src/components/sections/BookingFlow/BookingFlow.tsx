'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { PACKAGES, isServiceableZip, type PackageSlug } from '@/lib/booking/packages';
import { buildCalendlyUrl, buildStripeUrl, isTrustedCalendlyUrl, isValidEmail } from '@/lib/booking/urls';
import { trackEvent } from '@/lib/analytics/events';

type Step = 'package' | 'contact' | 'schedule' | 'pay';

type BookingFlowProps = {
  calendlyUrls: Partial<Record<PackageSlug, string>>;
  stripeDepositLink: string;
  initialPackage?: PackageSlug;
};

const STEP_NUMBER: Record<Step, number> = { package: 1, contact: 2, schedule: 3, pay: 4 };

// Resuming an in-progress booking (accidental reload, tab switch, backgrounding
// on mobile) is fine; resuming one from days ago against a stale package/price
// isn't, so restored state older than this is discarded.
const STORAGE_KEY = 'booking-flow-state';
const STORAGE_MAX_AGE_MS = 2 * 60 * 60 * 1000;
const PERSIST_DEBOUNCE_MS = 300;
const REDIRECT_RESET_MS = 5000;
const VALID_STEPS: readonly Step[] = ['package', 'contact', 'schedule', 'pay'];

type PersistedState = {
  step: Step;
  selected: PackageSlug | null;
  name: string;
  email: string;
  zip: string;
  savedAt: number;
};

function clearPersistedState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Best-effort cleanup; storage may be unavailable (private browsing, sandboxed iframe).
  }
}

// Reads and validates saved progress. Returns null (rather than throwing) for
// any shape that can't be trusted: missing storage, unparsable JSON, an
// unrecognized step (stale schema), data older than the max age, or a
// package that doesn't match what this page load was asked to preselect.
function readPersistedState(initialPackage?: PackageSlug): PersistedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as PersistedState;
    if (!VALID_STEPS.includes(saved.step)) {
      clearPersistedState();
      return null;
    }
    if (Date.now() - saved.savedAt > STORAGE_MAX_AGE_MS) {
      clearPersistedState();
      return null;
    }
    if (initialPackage && saved.selected !== initialPackage) return null;
    return saved;
  } catch {
    clearPersistedState();
    return null;
  }
}

const INPUT_CLASSES =
  'w-full h-12 px-[14px] font-sans text-[15px] rounded-input text-platinum focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)] focus-visible:border-[var(--color-accent-d)]';

const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.07)',
  border: '1.5px solid rgba(255,255,255,0.15)',
} as const;

export function BookingFlow({ calendlyUrls, stripeDepositLink, initialPackage }: BookingFlowProps) {
  // Read once, synchronously, before the first render — no restore effect,
  // so there's no window where a later effect could clobber pending state.
  const restoredRef = useRef<PersistedState | null | undefined>(undefined);
  if (restoredRef.current === undefined) {
    restoredRef.current = readPersistedState(initialPackage);
  }
  const restored = restoredRef.current;

  const [step, setStep] = useState<Step>(restored?.step ?? (initialPackage ? 'contact' : 'package'));
  const [selected, setSelected] = useState<PackageSlug | null>(
    restored?.selected ?? initialPackage ?? null,
  );
  const [name, setName] = useState(restored?.name ?? '');
  const [email, setEmail] = useState(restored?.email ?? '');
  const [zip, setZip] = useState(restored?.zip ?? '');
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'email' | 'zip' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const errorId = 'contact-form-error';
  const hasTrackedScheduleRef = useRef(false);
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPayingRef = useRef(false);
  const redirectResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPackage = PACKAGES.find((p) => p.slug === selected) ?? null;
  const calendlyUrl = selected ? (calendlyUrls[selected] ?? '') : '';

  useEffect(() => {
    if (step !== 'schedule') return;
    hasTrackedScheduleRef.current = false;
    function onMessage(e: MessageEvent) {
      const fromCalendly =
        e.origin === 'https://calendly.com' || e.origin.endsWith('.calendly.com');
      if (fromCalendly && e.data?.event === 'calendly.event_scheduled') {
        // Calendly can dispatch this message more than once for a single
        // booking before the listener tears down; only count it once.
        if (!hasTrackedScheduleRef.current) {
          hasTrackedScheduleRef.current = true;
          trackEvent('schedule_appointment', { package: selected ?? 'unknown' });
        }
        setStep('pay');
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [step, selected]);

  // Persist progress as she moves through the flow, so a reload or the app
  // backgrounding on mobile doesn't silently drop her back to step 1.
  // Debounced so typing in the contact fields doesn't hit sessionStorage on
  // every keystroke, and wrapped in try/catch since writes can throw
  // (private browsing, sandboxed iframes, quota limits).
  useEffect(() => {
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    persistTimeoutRef.current = setTimeout(() => {
      try {
        const state: PersistedState = { step, selected, name, email, zip, savedAt: Date.now() };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Best-effort persistence; losing it just means no resume-on-reload.
      }
    }, PERSIST_DEBOUNCE_MS);
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    };
  }, [step, selected, name, email, zip]);

  useEffect(() => {
    return () => {
      if (redirectResetTimeoutRef.current) clearTimeout(redirectResetTimeoutRef.current);
    };
  }, []);

  function submitContact() {
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.');
      setErrorField('email');
      return;
    }
    if (!isServiceableZip(zip.trim().slice(0, 5))) {
      setError("Sorry, we don't cover that ZIP yet.");
      setErrorField('zip');
      return;
    }
    setError(null);
    setErrorField(null);
    trackEvent('generate_lead', { package: selected ?? 'unknown' });
    setStep('schedule');
  }

  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-panel py-8 px-7 backdrop-blur-[8px]">
      <p className="m-0 mb-[6px] text-[12px] font-semibold tracking-[0.12em] uppercase text-steel">
        Step {STEP_NUMBER[step]} of 4
      </p>

      {step === 'package' && (
        <>
          <h2 className="m-0 mb-5 font-sans font-semibold text-[22px] text-platinum">
            Choose your package
          </h2>
          <div className="flex flex-col gap-3">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.slug}
                type="button"
                onClick={() => {
                  trackEvent('select_package', { package: pkg.slug });
                  setSelected(pkg.slug);
                  setStep('contact');
                }}
                className="w-full text-left p-[16px_18px] rounded-input cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)]"
                style={INPUT_STYLE}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-sans font-semibold text-[16px] text-platinum">
                    {pkg.name}
                  </span>
                  <span className="text-[13px] text-steel">{pkg.duration}</span>
                </span>
                <span className="mt-1 block text-[13px] text-steel">
                  Sedan ${pkg.priceSedan} · Truck or SUV ${pkg.priceTruckSuv}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'contact' && (
        <>
          <h2 className="m-0 mb-2 font-sans font-semibold text-[22px] text-platinum">
            Tell us where to find you
          </h2>
          {selectedPackage && (
            <p className="m-0 mb-5 text-[13px] text-steel">
              Package: <span className="text-platinum">{selectedPackage.name}</span> (
              {selectedPackage.duration}){' '}
              <button
                type="button"
                onClick={() => setStep('package')}
                className="underline text-platinum cursor-pointer bg-transparent border-0 p-0 text-[13px]"
              >
                Change
              </button>
            </p>
          )}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitContact();
            }}
          >
            <label className="flex flex-col gap-1 text-[13px] text-steel">
              Name
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] text-steel">
              Email
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
                aria-invalid={errorField === 'email'}
                aria-describedby={error ? errorId : undefined}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] text-steel">
              ZIP code
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                autoComplete="postal-code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={INPUT_CLASSES}
                style={INPUT_STYLE}
                aria-invalid={errorField === 'zip'}
                aria-describedby={error ? errorId : undefined}
              />
            </label>

            {error && (
              <div
                id={errorId}
                role="alert"
                className="p-[12px_14px] rounded-input flex items-center gap-2"
                style={{
                  background: 'rgba(240,68,56,0.10)',
                  border: '1px solid rgba(240,68,56,0.25)',
                }}
              >
                <Icon name="x" size={16} className="text-error shrink-0" />
                <span className="text-[14px] text-error">{error}</span>
              </div>
            )}

            <Button type="submit" variant="metal" size="lg" fullWidth iconRight="arrow-right">
              Continue
            </Button>
          </form>
        </>
      )}

      {step === 'schedule' &&
        (isTrustedCalendlyUrl(calendlyUrl) ? (
          <>
            <h2 className="m-0 mb-5 font-sans font-semibold text-[22px] text-platinum">
              Pick a time that works
            </h2>
            <iframe
              title="Pick a time"
              src={buildCalendlyUrl(
                calendlyUrl,
                { name: name.trim(), email: email.trim() },
                typeof window !== 'undefined' ? window.location.hostname : undefined,
              )}
              className="w-full rounded-input border-0"
              style={{ minHeight: 640, background: 'rgba(255,255,255,0.04)' }}
            />
            <p className="mt-3 mb-0 text-[13px] text-steel">
              Having trouble with the calendar?{' '}
              <a
                href={buildCalendlyUrl(calendlyUrl, { name: name.trim(), email: email.trim() })}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-platinum"
              >
                Book directly on Calendly
              </a>{' '}
              in a new tab.
            </p>
            <p className="mt-2 mb-0 text-[13px] text-steel">
              Booked through Calendly directly?{' '}
              <a
                href={buildStripeUrl(stripeDepositLink, email.trim())}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-platinum"
                onClick={() =>
                  trackEvent('begin_checkout', {
                    package: selected ?? 'unknown',
                    value: selectedPackage?.priceSedan ?? 0,
                    currency: 'USD',
                    trigger: 'calendly_fallback_link',
                  })
                }
              >
                Pay your deposit here
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2 className="m-0 mb-3 font-sans font-semibold text-[22px] text-platinum">
              Scheduling is temporarily unavailable
            </h2>
            <p className="m-0 text-[15px] text-steel">
              We couldn&apos;t load the booking calendar for this package. Please contact us
              directly to pick a time.
            </p>
          </>
        ))}

      {step === 'pay' && (
        <>
          <h2 className="m-0 mb-3 font-sans font-semibold text-[22px] text-platinum">
            You&apos;re booked! One last step.
          </h2>
          <p className="m-0 mb-5 text-[15px] text-steel">
            Use the same email (<span className="text-platinum">{email.trim()}</span>) so we can
            match your payment to your booking.
          </p>
          <Button
            href={buildStripeUrl(stripeDepositLink, email.trim())}
            variant="metal"
            size="lg"
            fullWidth
            iconRight={isRedirecting ? undefined : 'arrow-right'}
            aria-disabled={isRedirecting}
            className={isRedirecting ? 'pointer-events-none opacity-70' : ''}
            onClick={() => {
              // Guard with a ref, not just the isRedirecting state: aria-disabled
              // and pointer-events-none don't stop a keyboard Enter or a fast
              // double-tap from re-firing this handler before the re-render lands.
              if (isPayingRef.current) return;
              isPayingRef.current = true;
              setIsRedirecting(true);
              clearPersistedState();
              trackEvent('begin_checkout', {
                package: selected ?? 'unknown',
                value: selectedPackage?.priceSedan ?? 0,
                currency: 'USD',
                trigger: 'manual_button',
              });
              // If the navigation is silently blocked (the mobile-Safari failure
              // this flow was built around), don't leave the button stuck forever.
              redirectResetTimeoutRef.current = setTimeout(() => {
                isPayingRef.current = false;
                setIsRedirecting(false);
              }, REDIRECT_RESET_MS);
            }}
          >
            {isRedirecting ? 'Redirecting…' : 'Pay your deposit'}
          </Button>
        </>
      )}
    </div>
  );
}
