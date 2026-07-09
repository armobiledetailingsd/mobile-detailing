import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ReviewsSectionProps = Extract<PageSection, { _type: 'reviewsSection' }>;

function Stars({ size = 16, label }: { size?: number; label?: string }) {
  return (
    <div aria-label={label} className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={size} className="text-warning fill-warning" />
      ))}
    </div>
  );
}

export function Reviews({ eyebrow, heading, rating, reviewCount, quotes }: ReviewsSectionProps) {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="bg-paper border-t border-line">
      <div className="max-w-[1200px] mx-auto py-20 px-6">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-10">
          <div>
            {eyebrow && (
              <p className="m-0 mb-[10px] text-xs font-semibold tracking-[0.12em] uppercase text-muted">
                {eyebrow}
              </p>
            )}
            <h2
              id="reviews-heading"
              className="m-0 font-sans font-semibold text-[clamp(26px,4vw,38px)] tracking-[-0.02em] text-ink1"
            >
              {heading}
            </h2>
          </div>
          <div
            aria-label={`Rated ${rating} out of 5 stars · ${(reviewCount ?? 0).toLocaleString()} Google reviews`}
            className="flex items-center gap-[10px]"
          >
            <Stars size={20} />
            <span aria-hidden="true" className="font-sans font-bold text-[22px] text-ink1">
              {rating}
            </span>
            <span aria-hidden="true" className="text-sm text-muted">
              · {(reviewCount ?? 0).toLocaleString()} Google reviews
            </span>
          </div>
        </div>

        <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {quotes.map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 bg-surface border border-line rounded-card"
            >
              <Stars label="5 out of 5 stars" />
              <p className="m-0 text-[15px] text-ink2 leading-[1.65] grow">
                &quot;{r.quote}&quot;
              </p>
              <div className="flex flex-col gap-0.5">
                <span className="font-sans font-semibold text-sm text-ink1">
                  {r.name}
                </span>
                {r.city && (
                  <span className="text-[13px] text-muted">{r.city}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
