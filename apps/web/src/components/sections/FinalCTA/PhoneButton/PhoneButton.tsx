'use client';

import { Button } from '@/components/atoms/Button';
import { trackEvent } from '@/lib/analytics/events';

type PhoneButtonProps = {
  phoneNumber: string;
  phoneDisplay: string | null | undefined;
};

// Separate client component because FinalCTA is a server component and can't
// pass an inline onClick to the (client) Button atom directly.
export function PhoneButton({ phoneNumber, phoneDisplay }: PhoneButtonProps) {
  return (
    <Button
      href={`tel:${phoneNumber}`}
      variant="outline"
      size="lg"
      icon="phone"
      aria-label={phoneDisplay || phoneNumber}
      style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.18)' }}
      onClick={() => trackEvent('click_to_call', { location: 'final_cta' })}
    >
      {phoneDisplay}
    </Button>
  );
}
