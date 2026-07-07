'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Icon } from '@/components/atoms/Icon';
import { FieldLabel } from '@/components/molecules/FieldLabel';
import { Input } from '@/components/molecules/Input';
import { LocationButton } from '@/components/molecules/LocationButton';
import { PhotoUpload } from '@/components/molecules/PhotoUpload';
import { Select } from '@/components/molecules/Select';
import { StatusPill } from '@/components/molecules/StatusPill';
import { Textarea } from '@/components/molecules/Textarea';

/* RoadReady landing — the intake quote form. Mirrors the service_request
   model from mobile-tire-phase-plan.md. Front-end demo only for now: no
   backend call yet (the real service-request API lives in the separate
   TechBridge platform per the phase plan) — submit shows a placeholder
   confirmation with a fixed ETA/deposit outcome. Swap in a real
   `POST /api/service-requests` call when the backend is ready. */
export function QuoteForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [located, setLocated] = useState(false);
  const [service, setService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; service?: string }>({});
  const successRef = useRef<HTMLDivElement>(null);

  // Phase 4 deposit rule: ETA > 35 min OR after-hours → $70 deposit.
  const etaMin = 24;
  const afterHours = false;
  const depositApplies = etaMin > 35 || afterHours;

  function validate() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!phone.trim()) next.phone = 'Phone number is required';
    if (!service) next.service = 'Please select a service type';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    // Focus the success announcement after React re-renders
    setTimeout(() => successRef.current?.focus(), 50);
  }

  if (submitted) {
    return (
      <Card brackets padding={28} raised style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* aria-live so screen readers announce the state change */}
        <div
          ref={successRef}
          role="status"
          aria-live="polite"
          tabIndex={-1}
          style={{ outline: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <StatusPill status="success" icon="check-circle">
            Request received
          </StatusPill>
          <div>
            <h3
              style={{
                margin: '0 0 6px',
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                color: 'var(--off-white)',
              }}
            >
              A tech is being dispatched
            </h3>
            <p style={{ margin: 0, color: 'var(--steel-300)', fontSize: 15 }}>
              We&apos;ve got your location. You&apos;ll get an SMS with your technician&apos;s name and a live
              ETA.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
              }}
            >
              <div className="rr-eyebrow" style={{ color: 'var(--steel-300)' }}>
                Est. arrival
              </div>
              <div
                className="rr-numeric"
                style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--signal-orange)' }}
              >
                {etaMin} min
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
              }}
            >
              <div className="rr-eyebrow" style={{ color: 'var(--steel-300)' }}>
                Deposit
              </div>
              <div
                className="rr-numeric"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 30,
                  color: depositApplies ? 'var(--caution-yellow)' : 'var(--signal-green)',
                }}
              >
                {depositApplies ? '$70' : '$0'}
              </div>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: 'var(--steel-300)',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ color: 'var(--signal-green)', flex: 'none', marginTop: 1 }}>
              <Icon name="check" size={16} strokeWidth={2.5} />
            </span>
            Under 35 min and within hours — no deposit. You pay the balance on-site when the job&apos;s done.
          </p>
        </div>
        <Button variant="secondary" fullWidth onClick={() => setSubmitted(false)}>
          Start another request
        </Button>
      </Card>
    );
  }

  return (
    <Card brackets padding={26} raised style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 16 }}>
        <div className="rr-eyebrow">Get a technician</div>
        <h2
          style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--off-white)' }}
        >
          Request service
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="rr-form-2col">
          <div>
            <FieldLabel htmlFor="qf-name">Name</FieldLabel>
            <Input
              id="qf-name"
              placeholder="Your name"
              aria-required="true"
              aria-describedby={errors.name ? 'qf-name-err' : undefined}
              invalid={Boolean(errors.name)}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <span id="qf-name-err" role="alert" style={{ fontSize: 13, color: 'var(--signal-red)', marginTop: 4, display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>
          <div>
            <FieldLabel htmlFor="qf-phone">Phone</FieldLabel>
            <Input
              id="qf-phone"
              placeholder="(555) 000-0000"
              icon="phone"
              numeric
              inputMode="tel"
              aria-required="true"
              aria-describedby={errors.phone ? 'qf-phone-err' : undefined}
              invalid={Boolean(errors.phone)}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <span id="qf-phone-err" role="alert" style={{ fontSize: 13, color: 'var(--signal-red)', marginTop: 4, display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend
            style={{
              display: 'block',
              marginBottom: 6,
              fontFamily: 'var(--font-condensed)',
              fontWeight: 700,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--steel-300)',
            }}
          >
            Location
          </legend>
          <LocationButton
            located={located}
            address="I-10 E near Hacienda Blvd · La Puente, CA"
            onClick={() => setLocated(!located)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
            <span style={{ height: 1, flex: 1, background: 'var(--border-default)' }} />
            <span
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--steel-500)',
              }}
            >
              or enter address
            </span>
            <span style={{ height: 1, flex: 1, background: 'var(--border-default)' }} />
          </div>
          <Input id="qf-address" placeholder="Street, city or nearest exit" icon="map-pin" aria-label="Street address or nearest exit" />
        </fieldset>

        <div className="rr-form-2col">
          <div>
            <FieldLabel htmlFor="qf-vehicle" optional>Vehicle</FieldLabel>
            <Input id="qf-vehicle" placeholder="Make / model" />
          </div>
          <div>
            <FieldLabel htmlFor="qf-tiresize" optional hint="Not sure? Leave blank">
              Tire size
            </FieldLabel>
            <Input id="qf-tiresize" placeholder="225/65R17" numeric />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="qf-service">Service type</FieldLabel>
          <Select
            id="qf-service"
            placeholder="What do you need?"
            aria-required="true"
            aria-describedby={errors.service ? 'qf-service-err' : undefined}
            invalid={Boolean(errors.service)}
            value={service}
            onChange={(e) => setService(e.target.value)}
            options={[
              'Flat repair',
              'Tire replacement / mount',
              'Roadside assistance (jump / lockout / fuel)',
              'Fleet / commercial',
            ]}
          />
          {errors.service && (
            <span id="qf-service-err" role="alert" style={{ fontSize: 13, color: 'var(--signal-red)', marginTop: 4, display: 'block' }}>
              {errors.service}
            </span>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="qf-notes" optional>Notes</FieldLabel>
          <Textarea
            id="qf-notes"
            rows={2}
            placeholder="Gate code, exit number, anything the tech should know…"
          />
        </div>

        <div>
          <PhotoUpload />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth iconRight="arrow-right">
          Request a technician
        </Button>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: 'var(--steel-300)',
            lineHeight: 1.45,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ color: 'var(--caution-yellow)', flex: 'none', marginTop: 1 }}>
            <Icon name="alert-triangle" size={16} />
          </span>
          Typical response is under 35 min. A{' '}
          <span className="rr-numeric" style={{ color: 'var(--caution-yellow)' }}>
            &nbsp;$70&nbsp;
          </span>{' '}
          deposit may apply if the ETA runs over 35 min or it&apos;s after hours — it goes toward your total.
        </p>
      </form>
    </Card>
  );
}
