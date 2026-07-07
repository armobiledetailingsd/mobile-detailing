import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { HeaderNavigationQueryResult } from '@/sanity.types';
import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

const DISPATCH_PHONE_HREF = 'tel:+16265887122';
const DISPATCH_PHONE_LABEL = '(626) 588-7122';

const FALLBACK_LINKS = [
  { label: 'Services', href: '/#services', openInNewTab: false },
  { label: 'How it works', href: '/#how-it-works', openInNewTab: false },
  { label: 'Coverage', href: '/#coverage', openInNewTab: false },
  { label: 'Reviews', href: '/#reviews', openInNewTab: false },
];

type SiteHeaderProps = {
  navigation: HeaderNavigationQueryResult;
};

export function SiteHeader({ navigation }: SiteHeaderProps) {
  const sanityLinks = navigation?.links ?? [];
  const navLinks = sanityLinks.length > 0 ? sanityLinks : FALLBACK_LINKS;

  return (
    <header
      data-component="site-header"
      data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        background: 'rgba(18,19,22,0.86)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <Link href="/" aria-label="Medina's Mobile Tire Service" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <Image src="/medinas/logo.png" alt="" width={52} height={52} priority />
        <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 17, lineHeight: 1.1, color: 'var(--off-white)' }}>
          Medina&apos;s Mobile
          <br />
          Tire Service
        </span>
      </Link>

      <nav
        className="rr-desktop-nav"
        aria-label="Main navigation"
        style={{ display: 'flex', gap: 22, marginLeft: 20 }}
      >
        {navLinks.map((link) =>
          link.href ? (
            <a
              key={link.href}
              href={resolveNavHref(link.href)}
              target={link.openInNewTab ? '_blank' : undefined}
              rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: 'var(--steel-300)' }}
            >
              {link.label}
            </a>
          ) : (
            <span
              key={link.label}
              style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: 'var(--steel-500)' }}
            >
              {link.label}
            </span>
          ),
        )}
      </nav>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href={DISPATCH_PHONE_HREF}
          className="rr-desktop-phone"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
        >
          <Badge tone="caution">24/7</Badge>
          <span
            className="rr-numeric"
            style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--off-white)' }}
          >
            {DISPATCH_PHONE_LABEL}
          </span>
        </a>

        {/* Mobile-only phone link rendered as icon button */}
        <a
          href={DISPATCH_PHONE_HREF}
          aria-label="Call dispatch"
          className="rr-mobile-phone"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--signal-orange)',
            color: 'var(--off-white)',
          }}
        >
          <Icon name="phone" size={20} />
        </a>

        <div className="rr-mobile-menu-wrapper" style={{ display: 'none' }}>
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
