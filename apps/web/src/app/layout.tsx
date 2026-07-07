import type { Metadata } from 'next';
import { Archivo_Black, Barlow, Barlow_Condensed } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { SanityLive } from '@/lib/sanity/live';
import {
  getFooterNavigation,
  getHeaderNavigation,
  getSiteSettings,
} from '@/lib/sanity/queries/global';
import { SiteHeader } from '@/components/organisms/SiteHeader';
import { SiteFooter } from '@/components/organisms/SiteFooter';
import './globals.css';

// RoadReady brand type: heavy grotesk display, condensed headlines/eyebrows,
// clean sans body. Exposed as CSS variables consumed throughout
// components/{atoms,molecules,organisms,sections} as var(--font-*).
const fontDisplay = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});
const fontBody = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
const fontCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-condensed',
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
  const [headerNavigation, footerNavigation, { isEnabled: isDraftMode }] = await Promise.all([
    getHeaderNavigation(),
    getFooterNavigation(),
    draftMode(),
  ]);

  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontCondensed.variable}`}
    >
      <body>
        <a href="#main-content" className="rr-skip-link">
          Skip to main content
        </a>
        <SiteHeader navigation={headerNavigation} />
        <main id="main-content">
          {children}
        </main>
        <SiteFooter navigation={footerNavigation} />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
