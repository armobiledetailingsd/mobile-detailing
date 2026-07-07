import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';
import Image from 'next/image';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type CoverageSectionProps = Extract<PageSection, { _type: 'coverageSection' }>;

export function Coverage({ eyebrow, heading, body, towns }: CoverageSectionProps) {
  return (
    <section id="coverage" aria-labelledby="coverage-heading" style={{ background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 20px' }}>
        <div className="rr-coverage" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 36, alignItems: 'stretch' }}>
          <div>
            {eyebrow && <div className="rr-eyebrow">{eyebrow}</div>}
            <h2
              id="coverage-heading"
              style={{
                margin: '8px 0 8px',
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
              <p style={{ margin: '0 0 20px', fontSize: 16, color: 'var(--steel-300)', maxWidth: 420 }}>
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
                    padding: '7px 12px',
                    background: 'var(--bg-section)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--off-white)',
                  }}
                >
                  <span style={{ display: 'flex', color: 'var(--signal-orange)' }}>
                    <Icon name="map-pin" size={14} />
                  </span>
                  {town}
                </span>
              ))}
            </div>
          </div>
          <div
            className="rr-brackets"
            style={{
              position: 'relative',
              minHeight: 260,
              background: 'var(--bg-section)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/medinas/service-to-home2.jpg"
              alt="Mobile tire technician on-site in service area"
              fill
              sizes="(max-width: 860px) 100vw, 42vw"
              style={{ objectFit: 'cover' }}
            />
            <span
              style={{
                position: 'absolute',
                left: 14,
                bottom: 12,
                fontFamily: 'var(--font-condensed)',
                fontWeight: 600,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--steel-300)',
              }}
            >
              Service radius · ~25 mi
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
