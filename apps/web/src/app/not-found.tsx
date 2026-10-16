import type { Metadata } from 'next';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      aria-label="Page not found"
      style={{
        background: 'var(--color-ink1)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        padding: '96px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Icon name="navigation" size={28} style={{ color: 'var(--color-silver)' }} />
        </div>

        <p
          style={{
            margin: '0 0 16px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-steel)',
          }}
        >
          404
        </p>
        <h1
          style={{
            margin: '0 0 18px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 5vw, 48px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--color-platinum)',
          }}
        >
          We couldn&apos;t find that page
        </h1>
        <p style={{ margin: '0 0 36px', fontSize: 17, color: 'var(--color-steel)', lineHeight: 1.6 }}>
          The page you&apos;re looking for may have moved or no longer exists. Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button href="/" variant="metal" size="lg" icon="navigation">
            Back to home
          </Button>
          <Button
            href="/book"
            variant="outline"
            size="lg"
            iconRight="arrow-right"
            style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.18)' }}
          >
            Book a detail
          </Button>
        </div>
      </div>
    </section>
  );
}
