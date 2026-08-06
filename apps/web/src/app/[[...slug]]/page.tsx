import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Sections } from '@/components/sections/Sections';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { getAllWebsitePageSlugs, getHomepage, getWebsitePageBySlug } from '@/lib/sanity/queries/page';
import { getSiteSettings } from '@/lib/sanity/queries/global';
import { buildLocalBusinessJsonLd } from '@/lib/seo/localBusiness';
import { urlForImage } from '@/lib/sanity/image';

function ogImagesFor(openGraphImage: { asset?: { _ref: string } } | null | undefined) {
  if (!openGraphImage?.asset) return undefined;
  const url = urlForImage(openGraphImage).width(1200).height(630).url();
  return [{ url, width: 1200, height: 630 }];
}

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

type RouteParams = { slug?: string[] };

export const dynamicParams = true;
export const revalidate = 86400;

function isHomepageRoute(slugSegments?: string[]): boolean {
  return !slugSegments || slugSegments.length === 0;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const pages = await getAllWebsitePageSlugs();
  return [{ slug: [] }, ...pages.map(({ slug }) => ({ slug: slug.split('/') }))];
}

export async function generateMetadata(props: { params: Promise<RouteParams> }): Promise<Metadata> {
  const params = await props.params;

  if (isHomepageRoute(params.slug)) {
    const page = await getHomepage();
    const title = page?.seo?.metaTitle ?? 'AR Mobile Detailing — Premium Mobile Detailing in North County San Diego';
    const description = page?.seo?.metaDescription ?? 'Professional mobile auto detailing in North County San Diego and surrounding areas. We come to your home or office. Book in minutes.';
    const images = ogImagesFor(page?.seo?.openGraphImage);
    return {
      // Absolute: the homepage title is already the full brand title, so it
      // must skip the root layout's `%s | siteName` template rather than
      // getting the site name appended a second time.
      title: { absolute: title },
      description,
      robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
      ...(images && {
        openGraph: { title, description, images },
        twitter: { card: 'summary_large_image', title, description, images },
      }),
    };
  }

  const page = await getWebsitePageBySlug(params.slug!.join('/'));
  if (!page) {
    return { title: 'Page not found' };
  }

  const title = page.seo?.metaTitle ?? page.title;
  const description = page.seo?.metaDescription ?? undefined;
  const images = ogImagesFor(page.seo?.openGraphImage);

  return {
    title,
    description,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
    ...(images && {
      openGraph: { title, description, images },
      twitter: { card: 'summary_large_image', title, description, images },
    }),
  };
}

export default async function Page(props: { params: Promise<RouteParams> }) {
  const params = await props.params;

  if (isHomepageRoute(params.slug)) {
    const [page, siteSettings] = await Promise.all([getHomepage(), getSiteSettings()]);
    if (!page) return null;
    const jsonLd = buildLocalBusinessJsonLd({ siteSettings, homepage: page, baseUrl });
    return (
      <div data-sanity={createDocDataAttribute(page).toString()}>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <Sections sections={page.sections} />
      </div>
    );
  }

  const page = await getWebsitePageBySlug(params.slug!.join('/'));
  if (!page) notFound();

  return (
    <div data-sanity={createDocDataAttribute(page).toString()}>
      <Sections sections={page.sections} />
    </div>
  );
}
