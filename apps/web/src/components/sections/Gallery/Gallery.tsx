'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { HomepageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/lib/sanity/image';
import { Icon } from '@/components/atoms/Icon';
import { useDialogA11y } from '@/lib/useDialogA11y';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type GalleryProps = Extract<PageSection, { _type: 'gallery' }>;

const CONTROL_SIZE = 44;

export function Gallery({ eyebrow, heading, items }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const { containerRef } = useDialogA11y<HTMLDivElement>({ isOpen, onClose: close });

  const count = items?.length ?? 0;

  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + count) % count));
  }, [count]);

  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % count));
  }, [count]);

  useEffect(() => {
    if (!isOpen) return;
    function handleArrowKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
    window.addEventListener('keydown', handleArrowKey);
    return () => window.removeEventListener('keydown', handleArrowKey);
  }, [isOpen, showPrev, showNext]);

  const openItem = openIndex !== null ? items?.[openIndex] : null;
  const openImageUrl = openItem?.image?.asset
    ? urlForImage(openItem.image).width(1600).url()
    : null;

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
            {items.map((item, index) => {
              const imageUrl = item.image?.asset ? urlForImage(item.image).width(800).url() : null;
              const aspectRatio = (item.aspect ?? '4/3').replace('/', ' / ');
              const tileStyle = {
                aspectRatio,
                position: 'relative' as const,
                borderRadius: 'var(--radius-card)',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, var(--color-surf-d) 0%, var(--color-elev-d) 100%)',
              };

              // Items with no uploaded image aren't interactive — there's
              // nothing larger to show, so they shouldn't claim to open one.
              if (!imageUrl) {
                return (
                  <div key={item._key} style={tileStyle}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(164,170,180,0.05) 0%, transparent 60%)',
                    }} />
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
              }

              return (
                <button
                  key={item._key}
                  type="button"
                  aria-label={item.label ? `View larger photo: ${item.label}` : 'View larger photo'}
                  onClick={() => setOpenIndex(index)}
                  style={{
                    ...tileStyle,
                    padding: 0,
                    cursor: 'zoom-in',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={item.label ?? ''}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {item.label && (
                    <span style={{
                      position: 'absolute', bottom: 16, left: 16,
                      fontSize: 12, color: 'var(--color-steel)',
                      background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 8px',
                    }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {openItem && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={openItem.label ?? 'Photo viewer'}
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(8,9,10,0.94)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            overflowY: 'auto',
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: CONTROL_SIZE,
              height: CONTROL_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: 0,
              borderRadius: 8,
              color: 'var(--color-platinum)',
              cursor: 'pointer',
            }}
          >
            <Icon name="x" size={20} />
          </button>

          {count > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: CONTROL_SIZE,
                height: CONTROL_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.08)',
                border: 0,
                borderRadius: 8,
                color: 'var(--color-platinum)',
                cursor: 'pointer',
              }}
            >
              <Icon name="arrow-right" size={20} style={{ transform: 'scaleX(-1)' }} />
            </button>
          )}

          {openImageUrl && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 1100,
                maxHeight: '75vh',
                flex: '0 1 auto',
                aspectRatio: '4 / 3',
              }}
            >
              <Image
                src={openImageUrl}
                alt={openItem.label ?? ''}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 1100px) 100vw, 1100px"
                priority
              />
            </div>
          )}

          {count > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: CONTROL_SIZE,
                height: CONTROL_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.08)',
                border: 0,
                borderRadius: 8,
                color: 'var(--color-platinum)',
                cursor: 'pointer',
              }}
            >
              <Icon name="arrow-right" size={20} />
            </button>
          )}

          {openItem.label && (
            <span
              onClick={(e) => e.stopPropagation()}
              style={{
                marginTop: 16,
                flex: '0 0 auto',
                fontSize: 13,
                color: 'var(--color-steel)',
              }}
            >
              {openItem.label}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
