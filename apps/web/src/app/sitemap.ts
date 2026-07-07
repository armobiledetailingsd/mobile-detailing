import type { MetadataRoute } from 'next';
import {
  getBlogEnabledForStaticContext,
  getBlogPostsForSitemap,
} from '@/lib/sanity/queries/blog';
import { getAllWebsitePagesForSitemap } from '@/lib/sanity/queries/page';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, blogEnabled] = await Promise.all([
    getAllWebsitePagesForSitemap(),
    getBlogEnabledForStaticContext(),
  ]);

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => {
    const path = page.isHomepage ? '' : `/${page.slug}`;
    return {
      url: `${baseUrl}${path}`,
      lastModified: page.lastModified ? new Date(page.lastModified) : undefined,
      changeFrequency: page.isHomepage ? 'daily' : 'weekly',
      priority: page.isHomepage ? 1.0 : 0.7,
    };
  });

  // Disabled only when explicitly false; missing field counts as enabled.
  if (blogEnabled === false) {
    return pageEntries;
  }

  const posts = await getBlogPostsForSitemap();

  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: posts[0]?.lastModified ? new Date(posts[0].lastModified) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.lastModified ? new Date(post.lastModified) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...pageEntries, ...blogEntries];
}
