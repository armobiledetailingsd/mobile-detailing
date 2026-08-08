'use client';

import type { AnchorHTMLAttributes } from 'react';
import { trackEvent } from '@/lib/analytics/events';

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  event: string;
  eventParams?: Record<string, string | number | boolean>;
};

// Plain <a> wrapper that fires a GA4 event on click before the browser
// navigates — used for tel:/sms: links, which are conversion signals but
// otherwise unremarkable anchors.
export function TrackedLink({ event, eventParams, onClick, ...anchorProps }: TrackedLinkProps) {
  return (
    <a
      {...anchorProps}
      onClick={(e) => {
        trackEvent(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
