import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

const TRUST_ITEMS = [
  { icon: 'star' as const, text: '5.0 on Google (140+ reviews)' },
  { icon: 'shield' as const, text: 'Fully insured' },
  { icon: 'check-circle' as const, text: 'Satisfaction guaranteed' },
];

export function FinalCTA() {
  return (
    <section
      aria-label="Book your detail"
      style={{
        background: 'var(--color-ink1)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '96px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-steel)' }}>
          Ready to book?
        </p>
        <h2 style={{
          margin: '0 0 18px',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: 'clamp(32px, 5vw, 52px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          color: 'var(--color-platinum)',
        }}>
          Your car deserves{' '}
          <span style={{
            background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            better.
          </span>
        </h2>
        <p style={{ margin: '0 0 36px', fontSize: 17, color: 'var(--color-steel)', lineHeight: 1.6 }}>
          Schedule in under 2 minutes. We come to you — no shop, no hassle.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <Button variant="metal" size="lg" iconRight="arrow-right">Book your detail</Button>
          <a href="tel:+15124567890" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg" icon="phone" style={{ color: 'var(--color-silver)', borderColor: 'rgba(255,255,255,0.18)' }}>
              (512) 456-7890
            </Button>
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {TRUST_ITEMS.map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Icon name={item.icon} size={14} style={{ color: 'var(--color-steel)' }} />
              <span style={{ fontSize: 13, color: 'var(--color-steel)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
