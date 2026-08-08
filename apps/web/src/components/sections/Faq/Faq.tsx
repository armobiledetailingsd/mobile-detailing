import type { HomepageQueryResult } from '@/sanity.types';
import { Icon } from '@/components/atoms/Icon';
import { serializeJsonLd } from '@/lib/seo/jsonLd';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type FaqSectionProps = Extract<PageSection, { _type: 'faqSection' }>;

export function Faq({ eyebrow, heading, items }: FaqSectionProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-paper border-t border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="max-w-[800px] mx-auto py-20 px-6">
        {eyebrow && (
          <p className="m-0 mb-[10px] text-xs font-semibold tracking-[0.12em] uppercase text-muted">
            {eyebrow}
          </p>
        )}
        <h2
          id="faq-heading"
          className="m-0 mb-8 font-sans font-semibold text-[clamp(26px,4vw,38px)] tracking-[-0.02em] text-ink1"
        >
          {heading}
        </h2>

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <details
              key={item._key}
              className="group border border-line rounded-card bg-surface open:bg-surface"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-sans font-semibold text-[16px] text-ink1 [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icon
                  name="chevron-down"
                  size={18}
                  className="shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="m-0 px-5 pb-5 text-[15px] text-ink2 leading-[1.65]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
