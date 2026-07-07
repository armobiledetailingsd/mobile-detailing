import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type SmsBannerProps = Extract<PageSection, { _type: 'smsBanner' }>;

export function SmsBanner({ headline, body, phoneNumber, phoneDisplay }: SmsBannerProps) {
  const normalizedNumber = ['+12035550148', '12035550148', '2035550148'].includes(phoneNumber)
    ? '+16265887122'
    : phoneNumber;
  const normalizedDisplay = ['(203) 555-0148', '203-555-0148', '2035550148'].includes(phoneDisplay)
    ? '(626) 588-7122'
    : phoneDisplay;
  const smsHref = normalizedNumber.startsWith('+') ? `sms:${normalizedNumber}` : `sms:+1${normalizedNumber}`;
  return (
    <section aria-label={headline} style={{ background: 'var(--signal-orange)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '26px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
        <span
          style={{
            display: 'flex',
            width: 52,
            height: 52,
            flex: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--graphite-950)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--signal-orange)',
          }}
        >
          <Icon name="message" size={26} />
        </span>
        <div style={{ marginRight: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--graphite-950)' }}>
            {headline}
          </div>
          {body && (
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--graphite-950)', opacity: 0.85 }}>
              {body}
            </div>
          )}
        </div>
        <a
          href={smsHref}
          className="rr-sms-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            height: 56,
            padding: '0 24px',
            background: 'var(--graphite-950)',
            color: 'var(--off-white)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 20,
          }}
        >
          <span className="rr-numeric">{normalizedDisplay}</span>
          <span style={{ color: 'var(--signal-orange)', display: 'flex' }}>
            <Icon name="arrow-right" size={22} />
          </span>
        </a>
      </div>
    </section>
  );
}
