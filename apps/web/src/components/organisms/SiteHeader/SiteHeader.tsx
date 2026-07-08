'use client';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { HeaderNavigationQueryResult } from '@/sanity.types';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const PHONE_HREF = 'tel:+15124567890';
const PHONE_LABEL = '(512) 456-7890';

const FALLBACK_LINKS = [
  { label: 'Services', href: '/#services', openInNewTab: false },
  { label: 'How it works', href: '/#how-it-works', openInNewTab: false },
  { label: 'Coverage', href: '/#coverage', openInNewTab: false },
  { label: 'Reviews', href: '/#reviews', openInNewTab: false },
];

type SiteHeaderProps = { navigation: HeaderNavigationQueryResult };

export function SiteHeader({ navigation }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sanityLinks = navigation?.links ?? [];
  const navLinks = sanityLinks.length > 0 ? sanityLinks : FALLBACK_LINKS;

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  return (
    <>
      <header
        data-component="site-header"
        data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(12,14,16,.86)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        {/* Brand mark */}
        <Link
          href="/"
          aria-label="Alex Detailing"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
              borderRadius: 9,
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 16,
              color: '#16181b',
              flexShrink: 0,
            }}
          >
            A
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 15,
              color: 'var(--color-platinum)',
              letterSpacing: '0.06em',
            }}
          >
            ALEX·MOBILE·DETAILING
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex"
          style={{
            gap: 28,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {navLinks.map((link) =>
            link.href ? (
              <a
                key={link.href}
                href={resolveNavHref(link.href)}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 400,
                  color: 'var(--color-silver)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ) : (
              <span key={link.label} style={{ fontSize: 14, color: 'var(--color-steel)' }}>
                {link.label}
              </span>
            ),
          )}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <a
            href={PHONE_HREF}
            className="hidden lg:block"
            style={{
              fontSize: 13,
              color: 'var(--color-silver)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {PHONE_LABEL}
          </a>
          <div className="hidden lg:block">
            <Button variant="metal" size="sm">
              Book now
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex lg:hidden"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-silver)',
              padding: 4,
            }}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal={true}
          aria-label="Navigation menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(12,14,16,.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 24,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 15,
                color: 'var(--color-platinum)',
                letterSpacing: '0.06em',
              }}
            >
              ALEX·DETAILING
            </span>
            <button
              ref={closeButtonRef}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-silver)',
              }}
            >
              <Icon name="x" size={22} />
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.href}
                  href={resolveNavHref(link.href)}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--color-platinum)',
                    textDecoration: 'none',
                    padding: '8px 0',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <span
                  key={link.label}
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--color-steel)',
                    padding: '8px 0',
                  }}
                >
                  {link.label}
                </span>
              ),
            )}
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href={PHONE_HREF}
              style={{ fontSize: 16, color: 'var(--color-silver)', textDecoration: 'none' }}
            >
              {PHONE_LABEL}
            </a>
            <Button variant="metal" size="lg" fullWidth>
              Book now
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
