import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type CoverageSectionProps = Extract<PageSection, { _type: 'coverageSection' }>;

export function Coverage({ eyebrow, heading, body, towns }: CoverageSectionProps) {
  return (
    <section id="coverage" aria-labelledby="coverage-heading" className="bg-surface border-t border-line">
      <div className="max-w-[1200px] mx-auto py-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
          <div>
            {eyebrow && (
              <p className="m-0 mb-[10px] text-xs font-semibold tracking-[0.12em] uppercase text-muted">
                {eyebrow}
              </p>
            )}
            <h2
              id="coverage-heading"
              className="m-0 mb-4 font-sans font-semibold text-[clamp(26px,4vw,38px)] tracking-[-0.02em] text-ink1"
            >
              {heading}
            </h2>
            {body && (
              <p className="m-0 mb-7 text-base text-ink2 leading-[1.65] max-w-[440px]">
                {body}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {towns.map((town) => (
                <span
                  key={town}
                  className="inline-flex items-center gap-[6px] py-[7px] px-[14px] bg-paper border border-line rounded-btn text-[13px] font-medium text-ink2"
                >
                  <Icon name="map-pin" size={13} className="text-accent" />
                  {town}
                </span>
              ))}
            </div>
          </div>

          {/* North County San Diego coverage map placeholder */}
          <div className="relative min-h-[280px] bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-line)_100%)] border border-line rounded-panel overflow-hidden flex flex-col items-center justify-center gap-3">
            <div className="size-14 bg-metal rounded-full flex items-center justify-center">
              <Icon name="map-pin" size={26} className="text-[#16181b]" />
            </div>
            <p className="m-0 font-sans font-semibold text-[15px] text-ink1">
              North County San Diego
            </p>
            <p className="m-0 text-[13px] text-muted">~30 mile service radius</p>
          </div>
        </div>
      </div>
    </section>
  );
}
