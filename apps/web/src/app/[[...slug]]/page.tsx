import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Sections } from '@/components/sections/Sections';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { getAllWebsitePageSlugs, getHomepage, getWebsitePageBySlug } from '@/lib/sanity/queries/page';

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
    return {
      title: page?.seo?.metaTitle ?? 'Alex Detailing — Premium Mobile Detailing in North County San Diego',
      description: page?.seo?.metaDescription ?? 'Professional mobile auto detailing in North County San Diego and surrounding areas. We come to your home or office. Book in minutes.',
      robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
    };
  }

  const page = await getWebsitePageBySlug(params.slug!.join('/'));
  if (!page) {
    return { title: 'Page not found' };
  }

  return {
    title: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription ?? undefined,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function Page(props: { params: Promise<RouteParams> }) {
  const params = await props.params;

  if (isHomepageRoute(params.slug)) {
    const page = await getHomepage();
    if (!page) return null;
    return (
      <div data-sanity={createDocDataAttribute(page).toString()}>
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
