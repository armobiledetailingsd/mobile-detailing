import { TrustMarker } from '@/components/molecules/TrustMarker';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';
import Image from 'next/image';
import { QuoteForm } from './QuoteForm';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HeroSectionProps = Extract<PageSection, { _type: 'heroSection' }>;

export function Hero({ eyebrow, headlineMain, headlineAccent, body, trustMarkers }: HeroSectionProps) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="rr-tread" style={{ position: 'relative', background: 'var(--bg-page)', paddingBottom: 8 }}>
      <div
        className="rr-hero-grid"
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '48px 20px 40px',
          display: 'grid',
          gap: 40,
          alignItems: 'start',
        }}
      >
        <div>
          {eyebrow && (
            <div className="rr-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--caution-yellow)' }} />
              {eyebrow}
            </div>
          )}
          {(headlineMain || headlineAccent) && (
          <h1
            id="hero-heading"
            style={{
              margin: '16px 0 0',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 64px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--off-white)',
            }}
          >
            {headlineMain}
            {headlineMain && headlineAccent && <br />}
            {headlineAccent && <span style={{ color: 'var(--signal-orange)' }}>{headlineAccent}</span>}
          </h1>
          )}
          {body && (
            <p style={{ margin: '18px 0 0', maxWidth: 460, fontSize: 19, fontWeight: 500, color: 'var(--off-white)' }}>
              {body}
            </p>
          )}
          {trustMarkers && trustMarkers.length > 0 && (
            <div className="rr-hero-trust" style={{ display: 'flex', flexWrap: 'wrap', gap: 26, marginTop: 26 }}>
              {trustMarkers.map((m, i) => (
                <TrustMarker
                  key={i}
                  icon={m.icon ?? undefined as IconName | undefined}
                  value={m.value}
                  label={m.label}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="rr-brackets" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
            <Image
              src="/medinas/service-to-home.jpg"
              alt="Medina's Mobile Tire Service van working at a customer location"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 44vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
