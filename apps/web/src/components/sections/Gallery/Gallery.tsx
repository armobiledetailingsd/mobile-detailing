import Image from 'next/image';
import type { HomepageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/lib/sanity/image';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type GalleryProps = Extract<PageSection, { _type: 'gallery' }>;

export function Gallery({ eyebrow, heading, items }: GalleryProps) {
  return (
    <section id="gallery" aria-label="Work gallery" style={{ background: 'var(--color-charcoal)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {eyebrow && (
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            {eyebrow}
          </p>
        )}
        <h2 style={{ margin: '0 0 40px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(26px,4vw,38px)', color: 'var(--color-platinum)', letterSpacing: '-0.02em' }}>
          {heading}
        </h2>

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => {
              const imageUrl = item.image?.asset ? urlForImage(item.image).width(800).url() : null;
              const aspectRatio = (item.aspect ?? '4/3').replace('/', ' / ');
              return (
                <div
                  key={item._key}
                  style={{
                    aspectRatio,
                    position: 'relative',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--color-surf-d) 0%, var(--color-elev-d) 100%)',
                  }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.label ?? ''}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(164,170,180,0.05) 0%, transparent 60%)',
                    }} />
                  )}
                  {item.label && (
                    <span style={{
                      position: 'absolute', bottom: 16, left: 16,
                      fontSize: 12, color: 'var(--color-steel)',
                      background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 8px',
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
