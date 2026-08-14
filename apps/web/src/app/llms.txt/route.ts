import {
  getBlogPostsForLlms,
  getPagesForLlms,
  getSiteSettingsForLlms,
} from '@/lib/sanity/queries/llms';

export const revalidate = 86400;

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export async function GET(): Promise<Response> {
  const [settings, pages, posts] = await Promise.all([
    getSiteSettingsForLlms(),
    getPagesForLlms(),
    getBlogPostsForLlms(),
  ]);

  const siteName = settings?.siteName ?? 'AR Mobile Detailing';
  const siteDescription =
    settings?.siteDescription ??
    'Mobile car detailing across North County San Diego. We come to your home or office, no shop needed.';

  const lines: string[] = [`# ${siteName}`, '', `> ${siteDescription}`, ''];

  if (pages.length > 0) {
    lines.push('## Pages', '');
    for (const page of pages) {
      const url = page.isHomepage ? baseUrl : `${baseUrl}/${page.slug}`;
      lines.push(`- [${page.title ?? page.slug}](${url})`);
    }
    lines.push('');
  }

  // Disabled only when explicitly false; missing field counts as enabled.
  if (settings?.blogEnabled !== false && posts.length > 0) {
    lines.push('## Blog', '');
    for (const post of posts) {
      const suffix = post.excerpt ? `: ${post.excerpt}` : '';
      lines.push(`- [${post.title}](${baseUrl}/blog/${post.slug})${suffix}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
