import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { urlForImage } from '@/lib/sanity/image';
import { resolveNavHref } from '@/lib/nav';
import { Icon } from '@/components/atoms/Icon';
import { TrackedLink } from '@/components/atoms/TrackedLink';
import type { FooterNavigationQueryResult, SiteSettingsQueryResult } from '@/sanity.types';
import Image from 'next/image';

type SiteFooterProps = {
  navigation: FooterNavigationQueryResult;
  siteName: string;
  logo?: NonNullable<SiteSettingsQueryResult>['logo'];
  email?: string | null;
  hours?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  phoneNumber?: string | null;
  phoneDisplay?: string | null;
};

const FALLBACK_PHONE_HREF = 'tel:+14429991980';
const FALLBACK_SMS_HREF = 'sms:+14429991980';
const FALLBACK_PHONE_LABEL = '(442) 999-1980';

function buildContactColumn(phoneHref: string, smsHref: string, phoneLabel: string) {
  return {
    _key: 'contact',
    heading: 'Contact',
    links: [
      { label: phoneLabel, href: phoneHref, openInNewTab: false },
      { label: 'Text us', href: smsHref, openInNewTab: false },
    ],
  };
}

const FALLBACK_OTHER_COLUMNS = [
  {
    _key: 'services',
    heading: 'Services',
    links: [
      { label: 'Express Refresh', href: '/#services', openInNewTab: false },
      { label: 'Signature Detail', href: '/#services', openInNewTab: false },
      { label: 'Paint Correction', href: '/#services', openInNewTab: false },
      { label: 'Headlight Restoration', href: '/#services', openInNewTab: false },
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

export function SiteFooter({
  navigation,
  siteName,
  logo,
  email,
  hours,
  facebookUrl,
  instagramUrl,
  phoneNumber,
  phoneDisplay,
}: SiteFooterProps) {
  const logoUrl = logo?.asset ? urlForImage(logo).width(64).height(64).fit('crop').url() : null;
  const sanityColumns = navigation?.columns ?? [];
  const phoneHref = phoneNumber ? `tel:${phoneNumber}` : FALLBACK_PHONE_HREF;
  const smsHref = phoneNumber ? `sms:${phoneNumber}` : FALLBACK_SMS_HREF;
  const phoneLabel = phoneDisplay ?? FALLBACK_PHONE_LABEL;
  const columns =
    sanityColumns.length > 0
      ? sanityColumns
      : [buildContactColumn(phoneHref, smsHref, phoneLabel), ...FALLBACK_OTHER_COLUMNS];
  const fallbackCopyright = `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const copyright = navigation?.copyright
    ? navigation.copyright.replace('{year}', new Date().getFullYear().toString())
    : fallbackCopyright;

  return (
    <footer
      data-component="site-footer"
      data-sanity={navigation ? createDocDataAttribute(navigation).toString() : undefined}
      className="bg-ink1 border-t border-[rgba(255,255,255,0.08)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-9">
        {/* Brand + columns grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <div className="mb-4 flex items-center gap-[10px]">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-[8px] shrink-0 object-cover"
                />
              )}
              <span className="font-sans font-bold text-[16px] text-platinum tracking-[0.06em]">
                {siteName}
              </span>
            </div>
            <p className="m-0 mb-4 text-[14px] text-steel leading-[1.6] max-w-[200px]">
              Premium mobile detailing in North County San Diego. We come to you — no shop, no wait.
            </p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="block text-[14px] text-silver no-underline mb-1"
              >
                {email}
              </a>
            )}
            {hours && <p className="m-0 text-[14px] text-steel">{hours}</p>}
            {(facebookUrl || instagramUrl) && (
              <div className="flex gap-3 mt-4">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-silver"
                  >
                    <Icon name="facebook" size={18} />
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-silver"
                  >
                    <Icon name="instagram" size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col._key}>
              <h3 className="font-sans font-semibold text-[11px] uppercase tracking-[0.1em] text-muted m-0 mb-[14px]">
                {col.heading}
              </h3>
              <div className="flex flex-col gap-[10px]">
                {(col.links ?? []).map((link) =>
                  link.href?.startsWith('tel:') || link.href?.startsWith('sms:') ? (
                    <TrackedLink
                      key={link.label}
                      href={link.href}
                      event={link.href.startsWith('tel:') ? 'click_to_call' : 'click_to_text'}
                      eventParams={{ location: 'footer' }}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="text-[14px] text-silver no-underline"
                    >
                      {link.label}
                    </TrackedLink>
                  ) : link.href ? (
                    <a
                      key={link.label}
                      href={resolveNavHref(link.href)}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="text-[14px] text-silver no-underline"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.label} className="text-[14px] text-silver">
                      {link.label}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap gap-3 justify-between items-center">
          <span className="text-[13px] text-muted">{copyright}</span>
          <div className="flex gap-5">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-[13px] text-muted no-underline">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
