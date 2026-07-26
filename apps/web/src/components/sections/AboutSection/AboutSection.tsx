import type { HomepageQueryResult } from '@/sanity.types';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type AboutSectionProps = Extract<PageSection, { _type: 'aboutSection' }>;

export function AboutSection({
  eyebrow,
  heading,
  body,
  founderName,
  founderTitle,
  foundedYear,
  yearsExperience,
}: AboutSectionProps) {
  const stats = [
    foundedYear ? { label: 'Founded', value: String(foundedYear) } : null,
    yearsExperience ? { label: 'Years experience', value: `${yearsExperience}+` } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <section id="about" aria-labelledby="about-heading" className="bg-surface border-t border-line">
      <div className="max-w-[1200px] mx-auto py-20 px-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-start">
        <div>
          {eyebrow && (
            <p className="m-0 mb-[10px] text-xs font-semibold tracking-[0.12em] uppercase text-muted">
              {eyebrow}
            </p>
          )}
          <h2
            id="about-heading"
            className="m-0 mb-5 font-sans font-semibold text-[clamp(26px,4vw,38px)] text-ink1 tracking-[-0.02em]"
          >
            {heading}
          </h2>
          <p className="m-0 text-[15px] text-ink2 leading-[1.7] max-w-[60ch]">{body}</p>
          {founderName && (
            <p className="m-0 mt-5 font-sans font-semibold text-sm text-ink1">
              {founderName}
              {founderTitle && <span className="font-normal text-muted"> · {founderTitle}</span>}
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-5 bg-paper border border-line rounded-card">
                <div className="font-sans font-bold text-[28px] text-ink1 leading-none mb-1.5">
                  {stat.value}
                </div>
                <div className="text-[13px] text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
