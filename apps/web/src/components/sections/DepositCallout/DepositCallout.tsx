import { Card } from '@/components/atoms/Card';
import { Icon } from '@/components/atoms/Icon';
import { SectionEdge } from '@/components/atoms/SectionEdge';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type DepositCalloutProps = Extract<PageSection, { _type: 'depositCallout' }>;

export function DepositCallout({ eyebrow, heading, body, depositAmount, depositLabel, depositNote, reasons }: DepositCalloutProps) {
  return (
    <SectionEdge cut="top" background="var(--graphite-900)" slope={44} aria-labelledby="deposit-heading" style={{ marginTop: -1 }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '72px 20px 64px' }}>
        <div className="rr-deposit" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            {eyebrow && <div className="rr-eyebrow">{eyebrow}</div>}
            <h2
              id="deposit-heading"
              style={{
                margin: '8px 0 14px',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px,3.6vw,38px)',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: 'var(--off-white)',
              }}
            >
              {heading}
            </h2>
            {body && (
              <p style={{ margin: '0 0 18px', fontSize: 17, color: 'var(--steel-300)', lineHeight: 1.55, maxWidth: 460 }}>
                {body}
              </p>
            )}
            {reasons && reasons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        display: 'flex',
                        width: 40,
                        height: 40,
                        flex: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--graphite-800)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--caution-yellow)',
                      }}
                    >
                      <Icon name={(r.icon ?? 'alert-triangle') as IconName} size={20} />
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          fontWeight: 700,
                          fontSize: 16,
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          color: 'var(--off-white)',
                        }}
                      >
                        {r.title}
                      </div>
                      {r.description && <div style={{ fontSize: 14, color: 'var(--steel-300)' }}>{r.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Card brackets padding={30} style={{ textAlign: 'center', background: 'var(--bg-page)' }}>
            {depositLabel && (
              <div className="rr-eyebrow" style={{ color: 'var(--steel-300)' }}>
                {depositLabel}
              </div>
            )}
            <div className="rr-numeric" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 12vw, 84px)', lineHeight: 1, color: 'var(--caution-yellow)', margin: '8px 0' }}>
              {depositAmount}
            </div>
            {depositNote && (
              <p style={{ margin: '0 auto', maxWidth: 300, fontSize: 15, color: 'var(--steel-300)' }}>
                {depositNote}
              </p>
            )}
          </Card>
        </div>
      </div>
    </SectionEdge>
  );
}
