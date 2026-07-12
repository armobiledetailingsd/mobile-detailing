import Link from 'next/link';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type FinalCtaProps = Extract<PageSection, { _type: 'finalCta' }>;

export function FinalCTA({ eyebrow, heading, body, phoneNumber, phoneDisplay, trustItems }: FinalCtaProps) {
  return (
    <section
      aria-label="Book your detail"
      style={{
        background: 'var(--color-ink1)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '96px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
            {eyebrow}
          </p>
        )}
        <h2 style={{
          margin: '0 0 18px',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: 'clamp(32px, 5vw, 52px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          color: 'var(--color-platinum)',
        }}>
          {heading}
        </h2>
        {body && (
          <p style={{ margin: '0 0 36px', fontSize: 17, color: 'var(--color-steel)', lineHeight: 1.6 }}>
            {body}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <Link href="/book" style={{ textDecoration: 'none' }}>
            <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
          </Link>
          {phoneNumber && (
            <a href={`tel:${phoneNumber}`} style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg" icon="phone" aria-label={phoneDisplay || phoneNumber} style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.18)' }}>
                {phoneDisplay}
              </Button>
            </a>
          )}
        </div>

        {trustItems && trustItems.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {trustItems.map((item) => (
              <div key={item._key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {item.icon && <Icon name={item.icon as IconName} size={14} style={{ color: 'var(--color-steel)' }} />}
                <span style={{ fontSize: 13, color: 'var(--color-steel)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
