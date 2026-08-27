import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import type { HomepageQueryResult } from '@/sanity.types';

type RichTextSection = Extract<
  NonNullable<NonNullable<HomepageQueryResult>['sections']>[number],
  { _type: 'richText' }
>;

type RichTextProps = {
  body: RichTextSection['body'];
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="m-0 mt-10 mb-4 font-sans font-semibold text-[clamp(22px,3.5vw,30px)] tracking-[-0.02em] text-platinum">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="m-0 mt-8 mb-3 font-sans font-semibold text-xl text-platinum">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="m-0 mb-5 text-base text-silver leading-[1.7]">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-5 border-l-2 border-white/[0.15] italic text-silver">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="m-0 mb-5 pl-6 list-disc text-silver">{children}</ul>,
    number: ({ children }) => (
      <ol className="m-0 mb-5 pl-6 list-decimal text-silver">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2 leading-[1.7]">{children}</li>,
    number: ({ children }) => <li className="mb-2 leading-[1.7]">{children}</li>,
  },
};

export function RichText({ body }: RichTextProps) {
  if (!body || body.length === 0) return null;

  return (
    <section>
      <div className="max-w-[720px] mx-auto py-16 px-6">
        <PortableText value={body as unknown as PortableTextBlock[]} components={portableTextComponents} />
      </div>
    </section>
  );
}
