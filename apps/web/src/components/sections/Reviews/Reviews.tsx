import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ReviewsSectionProps = Extract<PageSection, { _type: 'reviewsSection' }>;

function Stars({ size = 16, label }: { size?: number; label?: string }) {
  return (
    <div aria-label={label} style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={size} style={{ color: 'var(--color-warning)', fill: 'var(--color-warning)' }} />
      ))}
    </div>
  );
}

export function Reviews({ eyebrow, heading, rating, reviewCount, quotes }: ReviewsSectionProps) {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" style={{ background: 'var(--color-paper)', borderTop: '1px solid var(--color-line)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
          <div>
            {eyebrow && (
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                {eyebrow}
              </p>
            )}
            <h2
              id="reviews-heading"
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 'clamp(26px,4vw,38px)',
                letterSpacing: '-0.02em',
                color: 'var(--color-ink1)',
              }}
            >
              {heading}
            </h2>
          </div>
          <div
            aria-label={`Rated ${rating} out of 5 stars · ${(reviewCount ?? 0).toLocaleString()} Google reviews`}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Stars size={20} />
            <span aria-hidden="true" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: 'var(--color-ink1)' }}>
              {rating}
            </span>
            <span aria-hidden="true" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
              · {(reviewCount ?? 0).toLocaleString()} Google reviews
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {quotes.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 24,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <Stars label="5 out of 5 stars" />
              <p style={{ margin: 0, fontSize: 15, color: 'var(--color-ink2)', lineHeight: 1.65, flexGrow: 1 }}>
                &quot;{r.quote}&quot;
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-ink1)' }}>
                  {r.name}
                </span>
                {r.city && (
                  <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{r.city}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
