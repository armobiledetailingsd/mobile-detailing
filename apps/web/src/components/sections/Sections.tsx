import type { HomepageQueryResult } from '@/sanity.types';
import { RichText } from './RichText';
import { Hero } from './Hero';
import { TrustBar } from './TrustBar';
import { Services } from './Services';
import { HowItWorks } from './HowItWorks';
import { Reviews } from './Reviews';
import { Coverage } from './Coverage';
import { DepositCallout } from './DepositCallout';
import { SmsBanner } from './SmsBanner';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];

type SectionsProps = {
  sections: PageSection[] | null | undefined;
};

export function Sections({ sections }: SectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'richText':
            return <RichText key={section._key} body={section.body} />;
          case 'heroSection':
            return <Hero key={section._key} {...section} />;
          case 'trustBar':
            return <TrustBar key={section._key} {...section} />;
          case 'servicesSection':
            return <Services key={section._key} {...section} />;
          case 'howItWorks':
            return <HowItWorks key={section._key} {...section} />;
          case 'reviewsSection':
            return <Reviews key={section._key} {...section} />;
          case 'coverageSection':
            return <Coverage key={section._key} {...section} />;
          case 'depositCallout':
            return <DepositCallout key={section._key} {...section} />;
          case 'smsBanner':
            return <SmsBanner key={section._key} {...section} />;
          default:
            if (process.env.NODE_ENV !== 'production') {
              const unknown = section as { _type: string; _key: string };
              return (
                <div key={unknown._key} data-unknown-section={unknown._type} style={{ padding: '16px 20px', background: '#ff000022', color: '#ff4444', fontFamily: 'monospace', fontSize: 13 }}>
                  Unknown section type: <code>{unknown._type}</code>
                </div>
              );
            }
            return null;
        }
      })}
    </>
  );
}
