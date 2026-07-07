import { Card } from '@/components/atoms/Card';
import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ReviewsSectionProps = Extract<PageSection, { _type: 'reviewsSection' }>;

function Stars({ size = 16, label }: { size?: number; label?: string }) {
  return (
    <div
      aria-label={label}
      style={{ display: 'flex', gap: 2, color: 'var(--caution-yellow)' }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={size} color="var(--caution-yellow)" style={{ fill: 'var(--caution-yellow)' }} />
      ))}
    </div>
  );
}

export function Reviews({ eyebrow, heading, rating, reviewCount, quotes }: ReviewsSectionProps) {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border-default)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 30 }}>
          <div>
            {eyebrow && <div className="rr-eyebrow">{eyebrow}</div>}
            <h2
              id="reviews-heading"
              style={{
                margin: '8px 0 0',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px,3.6vw,38px)',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: 'var(--off-white)',
              }}
            >
              {heading}
            </h2>
          </div>
          <div aria-label={`Rated ${rating} out of 5 stars · ${(reviewCount ?? 0).toLocaleString()} Google reviews`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stars size={20} />
            <span aria-hidden="true" className="rr-numeric" style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--off-white)' }}>
              {rating}
            </span>
            <span aria-hidden="true" style={{ fontSize: 14, color: 'var(--steel-300)' }}>· {(reviewCount ?? 0).toLocaleString()} Google reviews</span>
          </div>
        </div>
        <div className="rr-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {quotes.map((r, i) => (
            <Card key={i} padding={24} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Stars label="5 out of 5 stars" />
              <p style={{ margin: 0, fontSize: 16, color: 'var(--off-white)', lineHeight: 1.5 }}>&quot;{r.quote}&quot;</p>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'var(--off-white)',
                  }}
                >
                  {r.name}
                </span>
                {r.city && <span style={{ fontSize: 13, color: 'var(--steel-300)' }}>{r.city}</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
