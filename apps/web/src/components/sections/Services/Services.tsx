import { ServiceCard } from '@/components/molecules/ServiceCard';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type ServicesSectionProps = Extract<PageSection, { _type: 'servicesSection' }>;

const SERVICE_IMAGES = [
  '/medinas/tire-repair-from-inside-truck.jpg',
  '/medinas/new-tire-michelling.jpg',
  '/medinas/tire-with-rim-replacement.jpg',
  '/medinas/road-side-night-service.jpg',
];

export function Services({ eyebrow, heading, services }: ServicesSectionProps) {
  return (
    <section id="services" aria-labelledby="services-heading" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border-default)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 20px' }}>
        {eyebrow && <div className="rr-eyebrow">{eyebrow}</div>}
        <h2
          id="services-heading"
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
        <div className="rr-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              icon={(s.icon ?? 'wrench') as IconName}
              title={s.title}
              description={s.description ?? ''}
              price={s.price ?? undefined}
              imageSrc={SERVICE_IMAGES[i % SERVICE_IMAGES.length]}
              imageAlt={s.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
