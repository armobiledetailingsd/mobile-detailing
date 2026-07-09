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
  { label: 'Gallery', href: '/#gallery', openInNewTab: false },
  { label: 'Reviews', href: '/#reviews', openInNewTab: false },
  { label: 'Coverage', href: '/#coverage', openInNewTab: false },
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
        className="sticky top-0 z-50 h-[72px] flex items-center px-6 bg-[rgba(12,14,16,.86)] backdrop-blur-[14px] border-b border-[rgba(255,255,255,0.09)]"
      >
        {/* Brand mark */}
        <Link
          href="/"
          aria-label="Alex Detailing"
          className="flex items-center gap-[10px] no-underline shrink-0"
        >
          <span className="w-[34px] h-[34px] flex items-center justify-center bg-elev-d border border-[rgba(255,255,255,0.12)] rounded-[9px] font-sans font-bold text-[16px] text-platinum shrink-0">
            A
          </span>
          <span className="font-sans font-semibold text-[15px] tracking-[0.06em]">
            <span className="text-platinum">ALEX</span>
            <span className="text-steel">·DETAILING</span>
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
            <Button variant="metal" size="sm">
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
          role="dialog"
          aria-modal={true}
          aria-label="Navigation menu"
          className="fixed inset-0 z-[100] bg-[rgba(12,14,16,.95)] backdrop-blur-[16px] flex flex-col p-6"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="flex justify-between mb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-sans font-semibold text-[15px] text-platinum tracking-[0.06em]">
              ALEX·DETAILING
            </span>
            <button
              ref={closeButtonRef}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
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
                  onClick={() => setMenuOpen(false)}
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
            <a href={PHONE_HREF} className="text-[16px] text-silver no-underline">
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
