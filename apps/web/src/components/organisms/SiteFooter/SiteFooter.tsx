import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { FooterNavigationQueryResult } from '@/sanity.types';

type SiteFooterProps = {
  navigation: FooterNavigationQueryResult;
};

const FALLBACK_COLUMNS = [
  {
    _key: 'contact',
    heading: 'Contact',
    links: [
      { label: '(512) 456-7890', href: 'tel:+15124567890', openInNewTab: false },
      { label: 'Text us', href: 'sms:+15124567890', openInNewTab: false },
    ],
  },
  {
    _key: 'hours',
    heading: 'Hours',
    links: [
      { label: 'Mon–Sat  8am–7pm', href: null, openInNewTab: false },
      { label: 'Sunday  10am–5pm', href: null, openInNewTab: false },
    ],
  },
  {
    _key: 'services',
    heading: 'Services',
    links: [
      { label: 'Express Refresh', href: '/#services', openInNewTab: false },
      { label: 'Signature Detail', href: '/#services', openInNewTab: false },
      { label: 'Ceramic Coating', href: '/#services', openInNewTab: false },
      { label: 'Paint Correction', href: '/#services', openInNewTab: false },
    ],
  },
  {
    _key: 'company',
    heading: 'Company',
    links: [
      { label: 'How it works', href: '/#how-it-works', openInNewTab: false },
      { label: 'Coverage area', href: '/#coverage', openInNewTab: false },
      { label: 'Reviews', href: '/#reviews', openInNewTab: false },
    ],
  },
];

const FALLBACK_COPYRIGHT = `© ${new Date().getFullYear()} Alex Detailing. All rights reserved.`;

export function SiteFooter({ navigation }: SiteFooterProps) {
  const sanityColumns = navigation?.columns ?? [];
  const columns = sanityColumns.length > 0 ? sanityColumns : FALLBACK_COLUMNS;
  const copyright = navigation?.copyright
    ? navigation.copyright.replace('{year}', new Date().getFullYear().toString())
    : FALLBACK_COPYRIGHT;

  return (
    <footer
      data-component="site-footer"
      data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
      style={{ background: 'var(--color-ink1)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 36px' }}>
        {/* Brand + columns grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8" style={{ marginBottom: 48 }}>
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--color-platinum)', letterSpacing: '0.06em' }}>
                ALEX·DETAILING
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-steel)', lineHeight: 1.6, maxWidth: 200 }}>
              Premium mobile detailing in Austin, TX. We come to you — no shop, no wait.
            </p>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col._key}>
              <h3 style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-muted)',
                margin: '0 0 14px',
              }}>
                {col.heading}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(col.links ?? []).map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      href={resolveNavHref(link.href)}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      style={{ fontSize: 14, color: 'var(--color-silver)', textDecoration: 'none' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.label} style={{ fontSize: 14, color: 'var(--color-silver)' }}>
                      {link.label}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{copyright}</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms'].map((l) => (
              <a key={l} href="#" style={{ fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none' }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
