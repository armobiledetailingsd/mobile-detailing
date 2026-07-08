const GALLERY_ITEMS = [
  { label: 'Paint correction before/after', aspect: '4/3' },
  { label: 'Ceramic coating application', aspect: '16/9' },
  { label: 'Interior deep clean', aspect: '4/3' },
  { label: 'Engine bay detail', aspect: '4/3' },
  { label: 'Wheel & tire restoration', aspect: '4/3' },
  { label: 'Signature Detail result', aspect: '16/9' },
];

export function Gallery() {
  return (
    <section id="gallery" aria-label="Work gallery" style={{ background: 'var(--color-charcoal)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          Our work
        </p>
        <h2 style={{ margin: '0 0 40px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(26px,4vw,38px)', color: 'var(--color-platinum)', letterSpacing: '-0.02em' }}>
          Results that speak for themselves
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                aspectRatio: item.aspect,
                background: 'linear-gradient(135deg, var(--color-surf-d) 0%, var(--color-elev-d) 100%)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 16,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Placeholder shimmer pattern */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(164,170,180,0.05) 0%, transparent 60%)',
              }} />
              <span style={{ position: 'relative', fontSize: 12, color: 'var(--color-steel)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
