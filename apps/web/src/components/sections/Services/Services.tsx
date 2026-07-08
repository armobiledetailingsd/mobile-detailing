import type { HomepageQueryResult } from '@/sanity.types';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ServicesSectionProps = Extract<PageSection, { _type: 'servicesSection' }>;

export function Services({ eyebrow, heading, packages, addons }: ServicesSectionProps) {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-paper border-t border-line">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        {eyebrow && (
          <p className="m-0 mb-[10px] text-[12px] font-semibold tracking-[0.12em] uppercase text-muted">
            {eyebrow}
          </p>
        )}
        <h2
          id="services-heading"
          className="m-0 mb-12 font-sans font-semibold text-[clamp(28px,4vw,40px)] text-ink1 tracking-[-0.02em]"
        >
          {heading ?? 'Services & Pricing'}
        </h2>

        {packages && packages.length > 0 && (
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] gap-5 mb-12">
            {packages.map((pkg) => (
              <div
                key={pkg._key}
                className={[
                  'relative bg-surface rounded-card p-[28px_24px_24px] flex flex-col',
                  pkg.popular ? 'border-2 border-ink1' : 'border border-[1.5px] border-line',
                ].join(' ')}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-6 bg-ink1 text-platinum text-[11px] font-semibold tracking-[0.08em] px-[10px] py-[3px] rounded-full uppercase">
                    Most popular
                  </span>
                )}

                <div className="mb-1">
                  <span className="text-[13px] text-muted font-medium">{pkg.duration}</span>
                </div>
                <h3 className="m-0 mb-2 font-sans font-semibold text-[20px] text-ink1">
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="m-0 mb-5 text-[14px] text-ink2 leading-[1.55]">
                    {pkg.description}
                  </p>
                )}

                {pkg.includes && pkg.includes.length > 0 && (
                  <ul className="list-none m-0 mb-6 p-0 flex flex-col gap-2">
                    {pkg.includes.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-[14px] text-ink2">
                        <span className="text-success shrink-0 mt-[2px]">
                          <Icon name="check" size={15} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-sans font-bold text-[28px] text-ink1">
                    ${pkg.price}
                  </span>
                  <Button variant={pkg.popular ? 'ink' : 'outline'} size="sm" aria-label={`Book ${pkg.name}`}>Book now</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addons && addons.length > 0 && (
          <div className="bg-surface border border-[1.5px] border-line rounded-panel p-7">
            <p className="m-0 mb-5 font-sans font-semibold text-[15px] text-ink1">
              Add-ons
            </p>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-[14px]">
              {addons.map((addon) => (
                <div key={addon._key} className="flex justify-between items-center gap-2">
                  <span className="text-[14px] text-ink2">{addon.label}</span>
                  <span className="text-[14px] font-semibold text-ink1 whitespace-nowrap">+${addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
