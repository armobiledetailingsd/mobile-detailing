import { cache } from 'react';
import { groq } from 'next-sanity';
import { client } from '../client';
import { sanityFetch } from '../live';
import { SITE_SETTINGS_ID } from './global';
import type {
  AllBlogPostSlugsQueryResult,
  AllBlogPostsQueryResult,
  BlogEnabledQueryResult,
  BlogPostBySlugQueryResult,
  BlogPostsForSitemapQueryResult,
} from '@/sanity.types';

const allBlogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt
  }
`;

const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && defined(publishedAt)][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    body,
    seo
  }
`;

const allBlogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt)]{
    "slug": slug.current
  }
`;

const blogPostsForSitemapQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && seo.noIndex != true]
    | order(_updatedAt desc) {
    "slug": slug.current,
    "lastModified": _updatedAt
  }
`;

const blogEnabledQuery = groq`*[_id == $id && _type == "siteSettings"][0].blogEnabled`;

export async function getAllBlogPosts(): Promise<AllBlogPostsQueryResult> {
  const { data } = await sanityFetch({
    query: allBlogPostsQuery,
    tags: ['blogPost'],
  });
  return data;
}

// Wrapped in cache() so generateMetadata and the page component share one
// fetch per request instead of relying on sanityFetch's internal dedup.
export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPostBySlugQueryResult> => {
    const { data } = await sanityFetch({
      query: blogPostBySlugQuery,
      params: { slug },
      tags: ['blogPost', `blogPost:slug:${slug}`],
    });
    return data;
  },
);

// Note: uses raw `client.fetch` (not `sanityFetch`) because this runs inside
// generateStaticParams, which has no request context — `draftMode()` would throw.
export async function getAllBlogPostSlugs(): Promise<AllBlogPostSlugsQueryResult> {
  return client.fetch<AllBlogPostSlugsQueryResult>(allBlogPostSlugsQuery);
}

// Used by app/sitemap.ts (also runs outside a request context, so raw client.fetch).
export async function getBlogPostsForSitemap(): Promise<BlogPostsForSitemapQueryResult> {
  return client.fetch<BlogPostsForSitemapQueryResult>(blogPostsForSitemapQuery);
}

// Used by app/sitemap.ts to gate blog entries on the site-settings toggle.
export async function getBlogEnabledForStaticContext(): Promise<BlogEnabledQueryResult> {
  return client.fetch<BlogEnabledQueryResult>(blogEnabledQuery, { id: SITE_SETTINGS_ID });
}
