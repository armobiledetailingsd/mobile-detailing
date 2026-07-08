import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type DepositCalloutProps = Extract<PageSection, { _type: 'depositCallout' }>;

export function DepositCallout({ eyebrow, heading, body, depositAmount, depositLabel, depositNote, reasons }: DepositCalloutProps) {
  return (
    <section aria-labelledby="deposit-heading" style={{ background: 'var(--color-charcoal)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {eyebrow && (
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
                {eyebrow}
              </p>
            )}
            <h2
              id="deposit-heading"
              style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 'clamp(26px,4vw,38px)',
                letterSpacing: '-0.02em',
                color: 'var(--color-platinum)',
              }}
            >
              {heading}
            </h2>
            {body && (
              <p style={{ margin: '0 0 24px', fontSize: 16, color: 'var(--color-silver)', lineHeight: 1.65, maxWidth: 460 }}>
                {body}
              </p>
            )}
            {reasons && reasons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'flex',
                      width: 38, height: 38, flexShrink: 0,
                      alignItems: 'center', justifyContent: 'center',
                      background: 'var(--color-surf-d)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      color: 'var(--color-warning)',
                    }}>
                      <Icon name={(r.icon ?? 'alert-triangle') as IconName} size={18} />
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-platinum)' }}>
                        {r.title}
                      </div>
                      {r.description && <div style={{ fontSize: 13, color: 'var(--color-steel)', lineHeight: 1.5 }}>{r.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            padding: 36, textAlign: 'center',
            background: 'var(--color-surf-d)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-panel)',
          }}>
            {depositLabel && (
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
                {depositLabel}
              </p>
            )}
            <div style={{
              fontFamily: 'var(--font-sans)', fontWeight: 700,
              fontSize: 'clamp(56px, 12vw, 84px)', lineHeight: 1,
              background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              margin: '8px 0',
            }}>
              {depositAmount}
            </div>
            {depositNote && (
              <p style={{ margin: '0 auto', maxWidth: 300, fontSize: 14, color: 'var(--color-steel)', lineHeight: 1.6 }}>
                {depositNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
