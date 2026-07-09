import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type DepositCalloutProps = Extract<PageSection, { _type: 'depositCallout' }>;

export function DepositCallout({ eyebrow, heading, body, depositAmount, depositLabel, depositNote, reasons }: DepositCalloutProps) {
  return (
    <section aria-labelledby="deposit-heading" className="bg-charcoal border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto py-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {eyebrow && (
              <p className="m-0 mb-[10px] text-xs font-semibold tracking-[0.12em] uppercase text-steel">
                {eyebrow}
              </p>
            )}
            <h2
              id="deposit-heading"
              className="m-0 mb-4 font-sans font-semibold text-[clamp(26px,4vw,38px)] tracking-[-0.02em] text-platinum"
            >
              {heading}
            </h2>
            {body && (
              <p className="m-0 mb-6 text-base text-silver leading-[1.65] max-w-[460px]">
                {body}
              </p>
            )}
            {reasons && reasons.length > 0 && (
              <div className="flex flex-col gap-[14px]">
                {reasons.map((r, i) => (
                  <div key={i} className="flex gap-[14px] items-start">
                    <span className="flex size-[38px] shrink-0 items-center justify-center bg-surf-d border border-white/[0.08] rounded-[10px] text-warning">
                      <Icon name={(r.icon ?? 'alert-triangle') as IconName} size={18} />
                    </span>
                    <div>
                      <div className="font-sans font-semibold text-[15px] text-platinum">
                        {r.title}
                      </div>
                      {r.description && <div className="text-[13px] text-steel leading-[1.5]">{r.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-9 text-center bg-surf-d border border-white/[0.08] rounded-panel">
            {depositLabel && (
              <p className="m-0 mb-2 text-xs font-semibold tracking-[0.12em] uppercase text-steel">
                {depositLabel}
              </p>
            )}
            <div className="font-sans font-bold text-[clamp(56px,12vw,84px)] leading-none bg-metal bg-clip-text text-transparent my-2">
              {depositAmount}
            </div>
            {depositNote && (
              <p className="m-0 mx-auto max-w-[300px] text-sm text-steel leading-[1.6]">
                {depositNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
