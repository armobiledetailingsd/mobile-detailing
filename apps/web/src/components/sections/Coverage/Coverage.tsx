import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type CoverageSectionProps = Extract<PageSection, { _type: 'coverageSection' }>;

export function Coverage({ eyebrow, heading, body, towns }: CoverageSectionProps) {
  return (
    <section id="coverage" aria-labelledby="coverage-heading" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
          <div>
            {eyebrow && (
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                {eyebrow}
              </p>
            )}
            <h2
              id="coverage-heading"
              style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 'clamp(26px,4vw,38px)',
                letterSpacing: '-0.02em',
                color: 'var(--color-ink1)',
              }}
            >
              {heading}
            </h2>
            {body && (
              <p style={{ margin: '0 0 28px', fontSize: 16, color: 'var(--color-ink2)', lineHeight: 1.65, maxWidth: 440 }}>
                {body}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {towns.map((town) => (
                <span
                  key={town}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-line)',
                    borderRadius: 'var(--radius-btn)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--color-ink2)',
                  }}
                >
                  <Icon name="map-pin" size={13} style={{ color: 'var(--color-accent)' }} />
                  {town}
                </span>
              ))}
            </div>
          </div>

          {/* Austin coverage map placeholder */}
          <div
            style={{
              position: 'relative',
              minHeight: 280,
              background: 'linear-gradient(135deg, var(--color-paper) 0%, var(--color-line) 100%)',
              border: '1px solid var(--color-line)',
              borderRadius: 'var(--radius-panel)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="map-pin" size={26} style={{ color: '#16181b' }} />
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-ink1)' }}>
              Austin Metro Area
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-muted)' }}>~30 mile service radius</p>
          </div>
        </div>
      </div>
    </section>
  );
}
