'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { isServiceableZip } from '@/lib/booking/packages';

export function BookingCTA() {
  const [zip, setZip] = useState('');
  const [checked, setChecked] = useState(false);
  const [serviceable, setServiceable] = useState<boolean | null>(null);

  function checkZip() {
    const clean = zip.trim().slice(0, 5);
    setChecked(true);
    setServiceable(isServiceableZip(clean));
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-panel)',
      padding: '32px 28px',
      backdropFilter: 'blur(8px)',
    }}>
      <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
        Step 1 of 3
      </p>
      <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 22, color: 'var(--color-platinum)' }}>
        Do we cover your area?
      </h3>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="ZIP code"
          value={zip}
          onChange={(e) => { setZip(e.target.value); setChecked(false); setServiceable(null); }}
          onKeyDown={(e) => e.key === 'Enter' && checkZip()}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)] focus-visible:border-[var(--color-accent-d)]"
          style={{
            flex: 1,
            height: 48,
            padding: '0 14px',
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-input)',
            color: 'var(--color-platinum)',
          }}
          aria-label="Enter your ZIP code"
        />
        <Button variant="metal" size="md" onClick={checkZip}>Check</Button>
      </div>

      {checked && serviceable !== null && (
        <div style={{
          padding: '12px 14px',
          borderRadius: 'var(--radius-input)',
          background: serviceable ? 'rgba(18,183,106,0.12)' : 'rgba(240,68,56,0.10)',
          border: `1px solid ${serviceable ? 'rgba(18,183,106,0.25)' : 'rgba(240,68,56,0.25)'}`,
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
        }}>
          <Icon name={serviceable ? 'check-circle' : 'x'} size={16} style={{ color: serviceable ? 'var(--color-success)' : 'var(--color-error)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: serviceable ? 'var(--color-success)' : 'var(--color-error)' }}>
            {serviceable
              ? "Great news — we service your area!"
              : "Sorry, we don't cover that ZIP yet."}
          </span>
        </div>
      )}

      {serviceable && (
        <Button variant="metal" size="lg" fullWidth iconRight="arrow-right">
          Book your detail
        </Button>
      )}

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: 'map-pin' as const, text: 'We come to you — home, office, anywhere' },
          { icon: 'check-circle' as const, text: 'No deposit required to book' },
          { icon: 'clock' as const, text: 'Same-day appointments available' },
        ].map((item) => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name={item.icon} size={14} style={{ color: 'var(--color-steel)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--color-steel)' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
