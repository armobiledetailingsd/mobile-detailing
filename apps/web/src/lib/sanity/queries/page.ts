import { cache } from 'react';
import { groq } from 'next-sanity';
import { client } from '../client';
import { sanityFetch } from '../live';
import type {
  AllNonHomepageSlugsQueryResult,
  AllWebsitePagesForSitemapQueryResult,
  HomepageQueryResult,
  WebsitePageBySlugQueryResult,
} from '@/sanity.types';

// Singleton document IDs. Mirrors apps/studio/structure/index.ts — keep in sync.
export const HOMEPAGE_ID = 'siteHomepage';

const pageProjection = groq`{
  _id,
  _type,
  title,
  "slug": slug.current,
  seo,
  pageSettings,
  sections[]{
    _type,
    _key,
    _type == "richText" => {
      body
    },
    _type == "heroSection" => {
      eyebrow,
      headlineMain,
      headlineAccent,
      body,
      trustMarkers[]{ icon, value, label }
    },
    _type == "trustBar" => {
      items[]{ icon, value, label }
    },
    _type == "servicesSection" => {
      eyebrow,
      heading,
      packages[]{ _key, name, price, duration, description, includes, popular },
      addons[]{ _key, label, price, duration }
    },
    _type == "howItWorks" => {
      eyebrow,
      heading,
      steps[]{ title, description }
    },
    _type == "reviewsSection" => {
      eyebrow,
      heading,
      rating,
      reviewCount,
      quotes[]{ quote, name, city }
    },
    _type == "coverageSection" => {
      eyebrow,
      heading,
      body,
      towns
    },
    _type == "depositCallout" => {
      eyebrow,
      heading,
      body,
      depositAmount,
      depositLabel,
      depositNote,
      reasons[]{ icon, title, description }
    },
    _type == "smsBanner" => {
      headline,
      body,
      phoneNumber,
      phoneDisplay
    },
    _type == "finalCta" => {
      eyebrow,
      heading,
      body,
      phoneNumber,
      phoneDisplay,
      trustItems[]{ _key, icon, text }
    },
    _type == "gallery" => {
      eyebrow,
      heading,
      items[]{ _key, image{ asset{ _ref }, hotspot, crop }, label, aspect }
    }
  }
}`;

const homepageQuery = groq`*[_id == $id && _type == "websitePage"][0]${pageProjection}`;

const websitePageBySlugQuery = groq`
  *[_type == "websitePage" && slug.current == $slug && _id != $homepageId][0]${pageProjection}
`;

const allNonHomepageSlugsQuery = groq`
  *[_type == "websitePage" && defined(slug.current) && _id != $homepageId]{
    "slug": slug.current
  }
`;

export const getHomepage = cache(async (): Promise<HomepageQueryResult> => {
  const { data } = await sanityFetch({
    query: homepageQuery,
    params: { id: HOMEPAGE_ID },
    tags: ['websitePage', `websitePage:${HOMEPAGE_ID}`],
  });
  return data;
});

export async function getWebsitePageBySlug(slug: string): Promise<WebsitePageBySlugQueryResult> {
  const { data } = await sanityFetch({
    query: websitePageBySlugQuery,
    params: { slug, homepageId: HOMEPAGE_ID },
    tags: ['websitePage', `websitePage:slug:${slug}`],
  });
  return data;
}

// Note: uses raw `client.fetch` (not `sanityFetch`) because this runs inside
// generateStaticParams, which has no request context — `draftMode()` would throw.
export async function getAllWebsitePageSlugs(): Promise<AllNonHomepageSlugsQueryResult> {
  return client.fetch<AllNonHomepageSlugsQueryResult>(allNonHomepageSlugsQuery, {
    homepageId: HOMEPAGE_ID,
  });
}

const allWebsitePagesForSitemapQuery = groq`
  *[_type == "websitePage" && defined(slug.current) && seo.noIndex != true]
    | order(_updatedAt desc) {
    "slug": slug.current,
    "lastModified": _updatedAt,
    "isHomepage": _id == $homepageId
  }
`;

// Used by app/sitemap.ts (also runs outside a request context, so raw client.fetch).
export async function getAllWebsitePagesForSitemap(): Promise<AllWebsitePagesForSitemapQueryResult> {
  return client.fetch<AllWebsitePagesForSitemapQueryResult>(allWebsitePagesForSitemapQuery, {
    homepageId: HOMEPAGE_ID,
  });
}
