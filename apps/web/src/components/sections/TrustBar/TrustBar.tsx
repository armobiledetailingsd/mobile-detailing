import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type TrustBarProps = Extract<PageSection, { _type: 'trustBar' }>;

export function TrustBar({ items }: TrustBarProps) {
  return (
    <section style={{ background: 'var(--color-paper)', borderTop: '1px solid var(--color-line)', borderBottom: '1px solid var(--color-line)' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '22px 24px',
        display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'space-between',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {item.icon && (
              <Icon name={item.icon as IconName} size={18} style={{ color: 'var(--color-accent)' }} />
            )}
            <div>
              {item.value && (
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--color-ink1)' }}>
                  {item.value}
                </div>
              )}
              {item.label && (
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{item.label}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
