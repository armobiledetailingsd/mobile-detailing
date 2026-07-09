import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { BookingCTA } from './BookingCTA';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HeroSectionProps = Extract<PageSection, { _type: 'heroSection' }>;

export function Hero({ eyebrow, headlineMain, headlineAccent, body, trustMarkers }: HeroSectionProps) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="bg-ink1 relative overflow-hidden">
      {/* Subtle metal shimmer backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(164,170,180,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-center max-w-[1200px] mx-auto pt-[72px] pb-16 px-6">
        {/* Left column */}
        <div>
          {eyebrow && (
            <p className="m-0 mb-[18px] text-[12px] font-semibold tracking-[0.14em] uppercase text-steel">
              {eyebrow}
            </p>
          )}

          <h1
            id="hero-heading"
            className="m-0 mb-5 font-sans font-bold text-[clamp(38px,5.5vw,64px)] leading-[1.05] tracking-[-0.03em] text-platinum"
          >
            {headlineMain ?? 'Premium detailing,'}
            {(headlineMain || headlineAccent) && <br />}
            {headlineAccent ? (
              <span className="bg-metal bg-clip-text text-transparent">{headlineAccent}</span>
            ) : (
              <span className="bg-metal bg-clip-text text-transparent">delivered to you.</span>
            )}
          </h1>

          {body && (
            <p className="m-0 mb-8 max-w-[460px] text-[19px] font-normal text-silver leading-[1.55]">
              {body}
            </p>
          )}

          {!body && (
            <p className="m-0 mb-8 max-w-[460px] text-[19px] font-normal text-silver leading-[1.55]">
              Alex&apos;s mobile detail service. We come to your home or office, no shop needed.
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
            <Button variant="outline" size="lg" style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.2)' }}>
              View services
            </Button>
          </div>

          {trustMarkers && trustMarkers.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-10">
              {trustMarkers.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  {m.icon && <Icon name={m.icon as IconName} size={16} className="text-steel" />}
                  <span className="text-[14px] text-steel">
                    {m.value && <strong className="text-silver mr-1">{m.value}</strong>}
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
