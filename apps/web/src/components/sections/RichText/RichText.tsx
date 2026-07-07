import { PortableText, type PortableTextBlock } from '@portabletext/react';
import type { HomepageQueryResult } from '@/sanity.types';

type RichTextSection = Extract<
  NonNullable<NonNullable<HomepageQueryResult>['sections']>[number],
  { _type: 'richText' }
>;

type RichTextProps = {
  body: RichTextSection['body'];
};

export function RichText({ body }: RichTextProps) {
  if (!body || body.length === 0) return null;

  return (
    <section>
      <PortableText value={body as unknown as PortableTextBlock[]} />
    </section>
  );
}
