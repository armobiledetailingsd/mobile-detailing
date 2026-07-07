import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/atoms/Card';
import { formatDate } from '@/lib/formatDate';

type BlogPostCardProps = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  publishedAt?: string;
};

export function BlogPostCard({
  title,
  slug,
  excerpt,
  coverImageUrl,
  coverImageAlt,
  publishedAt,
}: BlogPostCardProps) {
  const date = formatDate(publishedAt);

  return (
    <Link
      href={`/blog/${slug}`}
      aria-label={title}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <Card padding={0} style={{ overflow: 'hidden', height: '100%' }}>
        {coverImageUrl && (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src={coverImageUrl}
              alt={coverImageAlt || title}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 22 }}>
          {date && (
            <time
              dateTime={publishedAt}
              style={{ fontSize: 13, color: 'var(--text-muted, #9aa0a6)' }}
              aria-hidden="true"
            >
              {date}
            </time>
          )}
          <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.3 }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--text-muted, #9aa0a6)' }}>
            {excerpt}
          </p>
        </div>
      </Card>
    </Link>
  );
}
