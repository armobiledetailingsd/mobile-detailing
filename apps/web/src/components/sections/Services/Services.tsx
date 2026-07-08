import type { HomepageQueryResult } from '@/sanity.types';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ServicesSectionProps = Extract<PageSection, { _type: 'servicesSection' }>;

export function Services({ eyebrow, heading, packages, addons }: ServicesSectionProps) {
  return (
    <section id="services" aria-labelledby="services-heading" style={{ background: 'var(--color-paper)', borderTop: '1px solid var(--color-line)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            {eyebrow}
          </p>
        )}
        <h2
          id="services-heading"
          style={{
            margin: '0 0 48px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'clamp(28px,4vw,40px)',
            color: 'var(--color-ink1)',
            letterSpacing: '-0.02em',
          }}
        >
          {heading ?? 'Services & Pricing'}
        </h2>

        {packages && packages.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
            {packages.map((pkg, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  background: 'var(--color-surface)',
                  border: pkg.popular ? '2px solid var(--color-ink1)' : '1.5px solid var(--color-line)',
                  borderRadius: 'var(--radius-card)',
                  padding: '28px 24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {pkg.popular && (
                  <span style={{
                    position: 'absolute', top: -12, left: 24,
                    background: 'var(--color-ink1)', color: 'var(--color-platinum)',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                    padding: '3px 10px', borderRadius: 100,
                    textTransform: 'uppercase',
                  }}>
                    Most popular
                  </span>
                )}

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>{pkg.duration}</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 20, color: 'var(--color-ink1)' }}>
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-ink2)', lineHeight: 1.55 }}>
                    {pkg.description}
                  </p>
                )}

                {pkg.includes && pkg.includes.length > 0 && (
                  <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.includes.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--color-ink2)' }}>
                        <span style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 2 }}>
                          <Icon name="check" size={15} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 28, color: 'var(--color-ink1)' }}>
                    ${pkg.price}
                  </span>
                  <Button variant={pkg.popular ? 'ink' : 'outline'} size="sm" aria-label={`Book ${pkg.name}`}>Book now</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addons && addons.length > 0 && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-line)',
            borderRadius: 'var(--radius-panel)',
            padding: '28px 28px',
          }}>
            <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-ink1)' }}>
              Add-ons
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {addons.map((addon, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: 'var(--color-ink2)' }}>{addon.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink1)', whiteSpace: 'nowrap' }}>+${addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
