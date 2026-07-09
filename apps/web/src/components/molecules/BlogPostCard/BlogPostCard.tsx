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
    <Link href={`/blog/${slug}`} aria-label={title} className="no-underline text-inherit block">
      <Card padding={0} className="overflow-hidden h-full">
        {coverImageUrl && (
          <div className="relative w-full aspect-video">
            <Image
              src={coverImageUrl}
              alt={coverImageAlt || title}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-[10px] p-[22px]">
          {date && (
            <time dateTime={publishedAt} className="text-[13px] text-muted" aria-hidden="true">
              {date}
            </time>
          )}
          <h2 className="m-0 text-xl leading-[1.3]">{title}</h2>
          <p className="m-0 text-[15px] leading-[1.55] text-muted">{excerpt}</p>
        </div>
      </Card>
    </Link>
  );
}
