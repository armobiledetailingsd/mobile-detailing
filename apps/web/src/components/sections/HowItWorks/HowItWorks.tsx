import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HowItWorksProps = Extract<PageSection, { _type: 'howItWorks' }>;

export function HowItWorks({ eyebrow, heading, steps }: HowItWorksProps) {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            {eyebrow}
          </p>
        )}
        <h2
          id="how-it-works-heading"
          style={{
            margin: '0 0 52px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'clamp(26px,4vw,38px)',
            color: 'var(--color-ink1)',
            letterSpacing: '-0.02em',
          }}
        >
          {heading}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
                borderRadius: 10,
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: '#16181b',
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, color: 'var(--color-ink1)' }}>
                  {step.title}
                </h3>
                {step.description && (
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--color-ink2)', lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
