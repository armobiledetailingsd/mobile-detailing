import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import { createDocDataAttribute } from '@/lib/sanity/dataAttribute';
import { formatDate } from '@/lib/formatDate';
import { urlForImage } from '@/lib/sanity/image';
import { getAllBlogPostSlugs, getBlogPostBySlug } from '@/lib/sanity/queries/blog';
import { getSiteSettings } from '@/lib/sanity/queries/global';

type RouteParams = { slug: string };

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = await getAllBlogPostSlugs();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: 'Post not found' };
  }

  const ogImage = post.seo?.openGraphImage ?? post.coverImage;

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt ?? undefined,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: ogImage
      ? {
          images: [{ url: urlForImage(ogImage).width(1200).height(630).url() }],
        }
      : undefined,
  };
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { alt?: string } }) => (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          margin: '24px 0',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <Image
          src={urlForImage(value).width(760).url()}
          alt={value.alt || ''}
          fill
          sizes="(max-width: 800px) 100vw, 760px"
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
  },
};

export default async function BlogPostPage(props: { params: Promise<RouteParams> }) {
  const { slug } = await props.params;

  const settings = await getSiteSettings();
  // Disabled only when explicitly false; missing field counts as enabled.
  if (settings?.blogEnabled === false) notFound();

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [urlForImage(post.coverImage).width(1200).url()] : undefined,
    datePublished: post.publishedAt,
  };

  const date = formatDate(post.publishedAt);

  return (
    <main
      data-sanity={createDocDataAttribute(post).toString()}
      style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article aria-labelledby="post-title">
        <header style={{ marginBottom: 32 }}>
          {date && (
            <time
              dateTime={post.publishedAt ?? undefined}
              style={{ fontSize: 14, color: 'var(--text-muted, #9aa0a6)' }}
            >
              {date}
            </time>
          )}
          <h1
            id="post-title"
            style={{ margin: '8px 0 0', fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.2 }}
          >
            {post.title}
          </h1>
        </header>
        {post.coverImage && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              marginBottom: 32,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <Image
              src={urlForImage(post.coverImage).width(1520).height(855).url()}
              alt={post.coverImage.alt || post.title || ''}
              fill
              sizes="(max-width: 800px) 100vw, 760px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}
        <div style={{ fontSize: 17, lineHeight: 1.7 }}>
          <PortableText
            value={(post.body ?? []) as unknown as PortableTextBlock[]}
            components={portableTextComponents}
          />
        </div>
      </article>
    </main>
  );
}
