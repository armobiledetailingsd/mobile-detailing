import { TrustMarker } from '@/components/molecules/TrustMarker';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type TrustBarProps = Extract<PageSection, { _type: 'trustBar' }>;

export function TrustBar({ items }: TrustBarProps) {
  return (
    <section
      style={{
        background: 'var(--bg-section)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 28,
          justifyContent: 'space-between',
        }}
      >
        {items.map((item, i) => (
          <TrustMarker
            key={i}
            icon={item.icon ?? undefined as IconName | undefined}
            value={item.value}
            label={item.label}
          />
        ))}
      </div>
    </section>
  );
}
