'use client';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { resolveNavHref } from '@/lib/nav';
import type { HeaderNavigationQueryResult } from '@/sanity.types';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useDialogA11y } from '@/lib/useDialogA11y';

const FALLBACK_PHONE_HREF = 'tel:+14429991980';
const FALLBACK_PHONE_LABEL = '(442) 999-1980';

const FALLBACK_LINKS = [
  { label: 'Services', href: '/#services', openInNewTab: false },
  { label: 'How it works', href: '/#how-it-works', openInNewTab: false },
  { label: 'Portfolio', href: '/#gallery', openInNewTab: false },
  { label: 'Reviews', href: '/#reviews', openInNewTab: false },
  { label: 'Coverage', href: '/#coverage', openInNewTab: false },
];

type SiteHeaderProps = {
  navigation: HeaderNavigationQueryResult;
  siteName: string;
  phoneNumber?: string | null;
  phoneDisplay?: string | null;
};

export function SiteHeader({ navigation, siteName, phoneNumber, phoneDisplay }: SiteHeaderProps) {
  const initial = siteName.trim().charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const { containerRef } = useDialogA11y<HTMLDivElement>({ isOpen: menuOpen, onClose: closeMenu });
  const sanityLinks = navigation?.links ?? [];
  const navLinks = sanityLinks.length > 0 ? sanityLinks : FALLBACK_LINKS;
  const phoneHref = phoneNumber ? `tel:${phoneNumber}` : FALLBACK_PHONE_HREF;
  const phoneLabel = phoneDisplay ?? FALLBACK_PHONE_LABEL;

  return (
    <>
      <header
        data-component="site-header"
        data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
        className="sticky top-0 z-50 h-[72px] flex items-center px-6 bg-[rgba(12,14,16,.86)] backdrop-blur-[14px] border-b border-[rgba(255,255,255,0.09)]"
      >
        {/* Brand mark */}
        <Link
          href="/"
          aria-label={siteName}
          className="flex items-center gap-[10px] no-underline shrink-0"
        >
          <span className="w-[34px] h-[34px] flex items-center justify-center bg-elev-d border border-[rgba(255,255,255,0.12)] rounded-[9px] font-sans font-bold text-[16px] text-platinum shrink-0">
            {initial}
          </span>
          <span className="font-sans font-semibold text-[15px] tracking-[0.06em] text-platinum">
            {siteName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden lg:flex gap-7 ml-10">
          {navLinks.map((link) =>
            link.href ? (
              <a
                key={link.href}
                href={resolveNavHref(link.href)}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                className="font-sans text-[14px] font-normal text-platinum no-underline"
              >
                {link.label}
              </a>
            ) : (
              <span key={link.label} className="text-[14px] text-steel">
                {link.label}
              </span>
            ),
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden lg:block">
            <Button href="/book" variant="metal" size="sm">
              Book now
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex lg:hidden bg-transparent border-0 cursor-pointer text-platinum p-1"
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal={true}
          aria-label="Navigation menu"
          className="fixed inset-0 z-[100] bg-[rgba(12,14,16,.95)] backdrop-blur-[16px] flex flex-col p-6"
          onClick={closeMenu}
        >
          <div
            className="flex justify-between mb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-sans font-semibold text-[15px] text-platinum tracking-[0.06em]">
              {siteName}
            </span>
            <button
              aria-label="Close menu"
              onClick={closeMenu}
              className="bg-transparent border-0 cursor-pointer text-platinum"
            >
              <Icon name="x" size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.href}
                  href={resolveNavHref(link.href)}
                  onClick={closeMenu}
                  className="text-[22px] font-medium text-platinum no-underline py-2"
                >
                  {link.label}
                </a>
              ) : (
                <span
                  key={link.label}
                  className="text-[22px] font-medium text-steel py-2"
                >
                  {link.label}
                </span>
              ),
            )}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <a href={phoneHref} className="text-[16px] text-silver no-underline">
              {phoneLabel}
            </a>
            <Button href="/book" variant="metal" size="lg" fullWidth onClick={closeMenu}>
              Book now
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
