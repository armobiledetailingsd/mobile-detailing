import { groq } from 'next-sanity';
import { client } from '../client';
import { SITE_SETTINGS_ID } from './global';
import { HOMEPAGE_ID } from './page';
import type {
  BlogPostsForLlmsQueryResult,
  PagesForLlmsQueryResult,
  SiteSettingsForLlmsQueryResult,
} from '@/sanity.types';

// All queries here back app/llms.txt/route.ts, which is statically rendered,
// so they use raw `client.fetch` (no request context for `draftMode()`).

const siteSettingsForLlmsQuery = groq`*[_id == $id && _type == "siteSettings"][0]{
  siteName,
  siteDescription,
  blogEnabled
}`;

const pagesForLlmsQuery = groq`
  *[_type == "websitePage" && defined(slug.current) && seo.noIndex != true]{
    title,
    "slug": slug.current,
    "isHomepage": _id == $homepageId
  }
`;

const blogPostsForLlmsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && seo.noIndex != true]
    | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt
  }
`;

export async function getSiteSettingsForLlms(): Promise<SiteSettingsForLlmsQueryResult> {
  return client.fetch<SiteSettingsForLlmsQueryResult>(siteSettingsForLlmsQuery, {
    id: SITE_SETTINGS_ID,
  });
}

export async function getPagesForLlms(): Promise<PagesForLlmsQueryResult> {
  return client.fetch<PagesForLlmsQueryResult>(pagesForLlmsQuery, { homepageId: HOMEPAGE_ID });
}

export async function getBlogPostsForLlms(): Promise<BlogPostsForLlmsQueryResult> {
  return client.fetch<BlogPostsForLlmsQueryResult>(blogPostsForLlmsQuery);
}
