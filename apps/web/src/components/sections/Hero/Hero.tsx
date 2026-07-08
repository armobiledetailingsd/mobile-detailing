import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { BookingCTA } from './BookingCTA';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HeroSectionProps = Extract<PageSection, { _type: 'heroSection' }>;

export function Hero({ eyebrow, headlineMain, headlineAccent, body, trustMarkers }: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      style={{ background: 'var(--color-ink1)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle metal shimmer backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(164,170,180,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-center"
        style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '72px 24px 64px',
        }}
      >
        {/* Left column */}
        <div>
          {eyebrow && (
            <p style={{ margin: '0 0 18px', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
              {eyebrow}
            </p>
          )}

          <h1
            id="hero-heading"
            style={{
              margin: '0 0 20px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 'clamp(38px, 5.5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-platinum)',
            }}
          >
            {headlineMain ?? 'Premium detailing,'}
            {(headlineMain || headlineAccent) && <br />}
            {headlineAccent ? (
              <span style={{
                background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {headlineAccent}
              </span>
            ) : (
              <span style={{
                background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                delivered to you.
              </span>
            )}
          </h1>

          {body && (
            <p style={{ margin: '0 0 32px', maxWidth: 460, fontSize: 19, fontWeight: 400, color: 'var(--color-silver)', lineHeight: 1.55 }}>
              {body}
            </p>
          )}

          {!body && (
            <p style={{ margin: '0 0 32px', maxWidth: 460, fontSize: 19, fontWeight: 400, color: 'var(--color-silver)', lineHeight: 1.55 }}>
              Austin&apos;s mobile detail service. We come to your home or office, no shop needed.
            </p>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
            <Button variant="outline" size="lg" style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.2)' }}>
              View services
            </Button>
          </div>

          {trustMarkers && trustMarkers.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 40 }}>
              {trustMarkers.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.icon && <Icon name={m.icon as IconName} size={16} style={{ color: 'var(--color-steel)' }} />}
                  <span style={{ fontSize: 14, color: 'var(--color-steel)' }}>
                    {m.value && <strong style={{ color: 'var(--color-silver)', marginRight: 4 }}>{m.value}</strong>}
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — booking card */}
        <BookingCTA />
      </div>
    </section>
  );
}
