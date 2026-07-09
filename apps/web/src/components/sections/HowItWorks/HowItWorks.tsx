import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HowItWorksProps = Extract<PageSection, { _type: 'howItWorks' }>;

export function HowItWorks({ eyebrow, heading, steps }: HowItWorksProps) {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-surface border-t border-line">
      <div className="max-w-[1200px] mx-auto py-20 px-6">
        {eyebrow && (
          <p className="m-0 mb-[10px] text-xs font-semibold tracking-[0.12em] uppercase text-muted">
            {eyebrow}
          </p>
        )}
        <h2
          id="how-it-works-heading"
          className="m-0 mb-[52px] font-sans font-semibold text-[clamp(26px,4vw,38px)] text-ink1 tracking-[-0.02em]"
        >
          {heading}
        </h2>

        <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-[14px]">
              <div className="size-10 flex items-center justify-center bg-metal rounded-[10px] font-sans font-bold text-base text-[#16181b] shrink-0">
                {idx + 1}
              </div>
              <div>
                <h3 className="m-0 mb-2 font-sans font-semibold text-[17px] text-ink1">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="m-0 text-sm text-ink2 leading-[1.6]">
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
