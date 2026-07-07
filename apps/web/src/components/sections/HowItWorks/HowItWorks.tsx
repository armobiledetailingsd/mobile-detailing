import { Fragment } from 'react';
import { StepItem } from '@/components/molecules/StepItem';
import { TreadDivider } from '@/components/atoms/TreadDivider';
import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type HowItWorksProps = Extract<PageSection, { _type: 'howItWorks' }>;

export function HowItWorks({ eyebrow, heading, steps }: HowItWorksProps) {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" style={{ background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 20px' }}>
        {eyebrow && <div className="rr-eyebrow">{eyebrow}</div>}
        <h2
          id="how-it-works-heading"
          style={{
            margin: '8px 0 32px',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px,4vw,40px)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--off-white)',
          }}
        >
          {heading}
        </h2>
        <div className="rr-steps" style={{ display: 'grid', gap: 0 }}>
          {steps.map((step, idx) => (
            <Fragment key={idx}>
              <StepItem number={idx + 1} title={step.title} active={idx === 0} style={{ padding: '4px 0' }}>
                {step.description}
              </StepItem>
              {idx < steps.length - 1 && <TreadDivider style={{ margin: '18px 0' }} />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
