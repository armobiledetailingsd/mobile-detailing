'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/atoms/Icon';
import { resolveNavHref } from '@/lib/nav';

const DISPATCH_PHONE_HREF = 'tel:+16265887122';
const DISPATCH_PHONE_LABEL = '(626) 588-7122';

type NavLink = {
  label: string;
  href: string | null;
  openInNewTab: boolean | null;
};

type MobileMenuProps = {
  links: NavLink[];
};

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  // Move focus into the menu when it opens
  useEffect(() => {
    if (!open || !navRef.current) return;
    const first = navRef.current.querySelector<HTMLElement>('a, button');
    first?.focus();
  }, [open]);

  // Focus trap: keep Tab/Shift+Tab inside the open nav
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' || !navRef.current) return;
    const focusable = Array.from(
      navRef.current.querySelectorAll<HTMLElement>('a[href], button'),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="rr-mobile-menu-btn"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          background: 'transparent',
          border: 'none',
          color: 'var(--off-white)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <Icon name={open ? 'x' : 'menu'} size={24} />
      </button>

      {open && (
        <nav
          ref={navRef}
          id="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(18,19,22,0.97)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 20px 20px',
            gap: 4,
            zIndex: 19,
          }}
        >
          {links.map(({ label, href, openInNewTab }) =>
            href ? (
              <a
                key={href}
                href={resolveNavHref(href)}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'var(--steel-300)',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                {label}
              </a>
            ) : (
              <span
                key={label}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'var(--steel-500)',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                {label}
              </span>
            ),
          )}
          <a
            href={DISPATCH_PHONE_HREF}
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              color: 'var(--signal-orange)',
              textDecoration: 'none',
            }}
          >
            <Icon name="phone" size={20} />
            {DISPATCH_PHONE_LABEL}
          </a>
        </nav>
      )}
    </>
  );
}
