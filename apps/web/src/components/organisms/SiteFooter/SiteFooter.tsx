import { Badge } from '@/components/atoms/Badge';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { FooterNavigationQueryResult } from '@/sanity.types';
import Image from 'next/image';

type SiteFooterProps = {
  navigation: FooterNavigationQueryResult;
};

const FALLBACK_COLUMNS = [
  {
    _key: 'contact',
    heading: 'Contact',
    links: [
      { label: '(626) 588-7122', href: 'tel:+16265887122', openInNewTab: false },
      { label: 'Text us', href: 'sms:+16265887122', openInNewTab: false },
      { label: 'medinasmobiletireservice.com', href: 'https://medinasmobiletireservice.com/', openInNewTab: true },
    ],
  },
  {
    _key: 'hours',
    heading: 'Hours',
    links: [
      { label: 'Mon–Sun 7am–9pm', href: null, openInNewTab: false },
      { label: 'After-hours: on call', href: null, openInNewTab: false },
      { label: 'Holidays: 24/7', href: null, openInNewTab: false },
    ],
  },
  {
    _key: 'company',
    heading: 'Company',
    links: [
      { label: 'Services', href: '/#services', openInNewTab: false },
      { label: 'Coverage', href: '/#coverage', openInNewTab: false },
      { label: 'Fleet accounts', href: null, openInNewTab: false },
      { label: 'Careers', href: null, openInNewTab: false },
    ],
  },
];

const FALLBACK_COPYRIGHT = `© ${new Date().getFullYear()} Medina's Mobile Tire Service. All rights reserved.`;

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
      style={{ background: 'var(--graphite-950)', borderTop: '1px solid var(--border-default)' }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '48px 20px 32px' }}>
        <div className="rr-footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Image src="/medinas/logo.png" alt="Medina's Mobile Tire Service" width={52} height={52} />
              <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 17, lineHeight: 1.1, color: 'var(--off-white)' }}>
                Medina&apos;s Mobile
                <br />
                Tire Service
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--steel-300)', maxWidth: 280 }}>
              Mobile tire &amp; roadside service across Los Angeles and Orange County. We come to you.
            </p>
            <div style={{ marginTop: 16 }}>
              <Badge tone="caution" icon="shield">
                Licensed &amp; insured
              </Badge>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col._key}>
              <h3
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--steel-500)',
                  margin: '0 0 12px',
                }}
              >
                {col.heading}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {(col.links ?? []).map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      href={resolveNavHref(link.href)}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      style={{ fontSize: 15, color: 'var(--steel-300)', textDecoration: 'none' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.label} style={{ fontSize: 15, color: 'var(--steel-300)' }}>
                      {link.label}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 36,
            paddingTop: 20,
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--steel-500)' }}>{copyright}</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Deposit policy'].map((l) => (
              <a key={l} href="#" style={{ fontSize: 13, color: 'var(--steel-500)', textDecoration: 'none' }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
