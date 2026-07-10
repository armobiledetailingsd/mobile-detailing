'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-panel py-8 px-7 backdrop-blur-[8px]">
      <p className="m-0 mb-[6px] text-[12px] font-semibold tracking-[0.12em] uppercase text-steel">
        Step 1 of 3
      </p>
      <h3 className="m-0 mb-5 font-sans font-semibold text-[22px] text-platinum">
        Do we cover your area?
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="ZIP code"
          value={zip}
          onChange={(e) => { setZip(e.target.value); setChecked(false); setServiceable(null); }}
          onKeyDown={(e) => e.key === 'Enter' && checkZip()}
          className="flex-1 h-12 px-[14px] font-sans text-[15px] rounded-input text-platinum focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-d)] focus-visible:border-[var(--color-accent-d)]"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(255,255,255,0.15)',
          }}
          aria-label="Enter your ZIP code"
        />
        <Button variant="metal" size="md" onClick={checkZip}>Check</Button>
      </div>

      {checked && serviceable !== null && (
        <div
          className="p-[12px_14px] rounded-input flex items-center gap-2 mb-4"
          style={{
            background: serviceable ? 'rgba(18,183,106,0.12)' : 'rgba(240,68,56,0.10)',
            border: `1px solid ${serviceable ? 'rgba(18,183,106,0.25)' : 'rgba(240,68,56,0.25)'}`,
          }}
        >
          <Icon
            name={serviceable ? 'check-circle' : 'x'}
            size={16}
            className={serviceable ? 'text-success shrink-0' : 'text-error shrink-0'}
          />
          <span className={`text-[14px] ${serviceable ? 'text-success' : 'text-error'}`}>
            {serviceable
              ? "Great news — we service your area!"
              : "Sorry, we don't cover that ZIP yet."}
          </span>
        </div>
      )}

      {serviceable && (
        <Link href="/book" className="block">
          <Button variant="metal" size="lg" fullWidth iconRight="arrow-right">
            Book your detail
          </Button>
        </Link>
      )}

      <div className="mt-5 flex flex-col gap-[10px]">
        {[
          { icon: 'map-pin' as const, text: 'We come to you — home, office, anywhere' },
          { icon: 'check-circle' as const, text: 'No deposit required to book' },
          { icon: 'clock' as const, text: 'Same-day appointments available' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-[10px]">
            <Icon name={item.icon} size={14} className="text-steel shrink-0" />
            <span className="text-[13px] text-steel">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
