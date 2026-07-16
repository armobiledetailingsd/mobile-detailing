'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { PACKAGES, isServiceableZip, type PackageSlug } from '@/lib/booking/packages';
import { buildCalendlyUrl, buildStripeUrl, isTrustedCalendlyUrl, isValidEmail } from '@/lib/booking/urls';

type Step = 'package' | 'contact' | 'schedule' | 'pay';

type BookingFlowProps = {
  calendlyUrls: Partial<Record<PackageSlug, string>>;
  stripeDepositLink: string;
  initialPackage?: PackageSlug;
};

const STEP_NUMBER: Record<Step, number> = { package: 1, contact: 2, schedule: 3, pay: 4 };

const AUTO_REDIRECT_DELAY_MS = 5000;

const INPUT_CLASSES =
  'w-full h-12 px-[14px] font-sans text-[15px] rounded-input text-platinum focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)] focus-visible:border-[var(--color-accent-d)]';

const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.07)',
  border: '1.5px solid rgba(255,255,255,0.15)',
} as const;

export function BookingFlow({ calendlyUrls, stripeDepositLink, initialPackage }: BookingFlowProps) {
  const [step, setStep] = useState<Step>(initialPackage ? 'contact' : 'package');
  const [selected, setSelected] = useState<PackageSlug | null>(initialPackage ?? null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'email' | 'zip' | null>(null);
  const [autoRedirectCancelled, setAutoRedirectCancelled] = useState(false);
  const [redirectSecondsLeft, setRedirectSecondsLeft] = useState(
    Math.ceil(AUTO_REDIRECT_DELAY_MS / 1000),
  );
  const errorId = 'contact-form-error';

  const selectedPackage = PACKAGES.find((p) => p.slug === selected) ?? null;
  const calendlyUrl = selected ? (calendlyUrls[selected] ?? '') : '';

  useEffect(() => {
    if (step !== 'schedule') return;
    function onMessage(e: MessageEvent) {
      const fromCalendly =
        e.origin === 'https://calendly.com' || e.origin.endsWith('.calendly.com');
      if (fromCalendly && e.data?.event === 'calendly.event_scheduled') {
        setStep('pay');
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [step]);

  useEffect(() => {
    if (step !== 'pay' || autoRedirectCancelled) return;
    setRedirectSecondsLeft(Math.ceil(AUTO_REDIRECT_DELAY_MS / 1000));
    const interval = setInterval(() => {
      setRedirectSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const timer = setTimeout(() => {
      window.location.href = buildStripeUrl(stripeDepositLink, email.trim());
    }, AUTO_REDIRECT_DELAY_MS);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [step, stripeDepositLink, email, autoRedirectCancelled]);

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
            {autoRedirectCancelled ? null : ` Redirecting you to secure payment in ${redirectSecondsLeft}s.`}
          </p>
          {!autoRedirectCancelled && (
            <button
              type="button"
              onClick={() => setAutoRedirectCancelled(true)}
              className="mb-4 underline text-platinum cursor-pointer bg-transparent border-0 p-0 text-[13px]"
            >
              Cancel auto-redirect
            </button>
          )}
          <Button
            href={buildStripeUrl(stripeDepositLink, email.trim())}
            variant="metal"
            size="lg"
            fullWidth
            iconRight="arrow-right"
          >
            Pay your deposit
          </Button>
        </>
      )}
    </div>
  );
}
