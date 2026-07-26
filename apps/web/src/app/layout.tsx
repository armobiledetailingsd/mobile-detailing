import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { SanityLive } from '@/lib/sanity/live';
import {
  getFooterNavigation,
  getHeaderNavigation,
  getSiteSettings,
} from '@/lib/sanity/queries/global';

const DEFAULT_SITE_NAME = 'AR Mobile Detailing';
import { SiteHeader } from '@/components/organisms/SiteHeader';
import { SiteFooter } from '@/components/organisms/SiteFooter';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.siteName ?? 'Site',
      template: `%s | ${settings?.siteName ?? 'Site'}`,
    },
    description: settings?.siteDescription ?? undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [headerNavigation, footerNavigation, siteSettings, { isEnabled: isDraftMode }] =
    await Promise.all([
      getHeaderNavigation(),
      getFooterNavigation(),
      getSiteSettings(),
      draftMode(),
    ]);

  const siteName = siteSettings?.siteName ?? DEFAULT_SITE_NAME;

  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--color-ink1)] focus:rounded focus:shadow-lg focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          Skip to main content
        </a>
        <SiteHeader navigation={headerNavigation} siteName={siteName} />
        <main id="main-content">
          {children}
        </main>
        <SiteFooter
          navigation={footerNavigation}
          siteName={siteName}
          email={siteSettings?.contactEmail ?? null}
          hours={siteSettings?.businessHours ?? null}
          facebookUrl={siteSettings?.socialFacebookUrl ?? null}
          instagramUrl={siteSettings?.socialInstagramUrl ?? null}
        />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
