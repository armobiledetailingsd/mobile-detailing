import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type SmsBannerProps = Extract<PageSection, { _type: 'smsBanner' }>;

export function SmsBanner({ headline, body, phoneNumber, phoneDisplay }: SmsBannerProps) {
  const normalizedNumber = ['+12035550148', '12035550148', '2035550148'].includes(phoneNumber)
    ? '+15124567890'
    : phoneNumber;
  const normalizedDisplay = ['(203) 555-0148', '203-555-0148', '2035550148'].includes(phoneDisplay)
    ? '(512) 456-7890'
    : phoneDisplay;
  const smsHref = normalizedNumber.startsWith('+') ? `sms:${normalizedNumber}` : `sms:+1${normalizedNumber}`;

  return (
    <section aria-label={headline} style={{ background: 'var(--color-ink1)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '26px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
        <span style={{
          display: 'flex', width: 50, height: 50, flexShrink: 0,
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
          borderRadius: 12,
          color: '#16181b',
        }}>
          <Icon name="message" size={24} />
        </span>
        <div style={{ marginRight: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 20, color: 'var(--color-platinum)' }}>
            {headline}
          </div>
          {body && (
            <div style={{ fontSize: 14, color: 'var(--color-steel)' }}>
              {body}
            </div>
          )}
        </div>
        <a
          href={smsHref}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            height: 52, padding: '0 22px',
            background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
            color: '#16181b',
            borderRadius: 'var(--radius-btn)',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
          }}
        >
          {normalizedDisplay}
          <Icon name="arrow-right" size={18} style={{ color: '#16181b' }} />
        </a>
      </div>
    </section>
  );
}
