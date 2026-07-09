import { Icon } from '@/components/atoms/Icon';
import type { HomepageQueryResult } from '@/sanity.types';
import type { IconName } from '@/components/atoms/Icon';

type PageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];
export type TrustBarProps = Extract<PageSection, { _type: 'trustBar' }>;

export function TrustBar({ items }: TrustBarProps) {
  return (
    <section className="bg-paper border-t border-b border-line">
      <div className="max-w-[1200px] mx-auto py-[22px] px-6 flex flex-wrap gap-7 justify-between">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-[10px]">
            {item.icon && (
              <Icon name={item.icon as IconName} size={18} className="text-accent" />
            )}
            <div>
              {item.value && (
                <div className="font-sans font-bold text-[15px] text-ink1">{item.value}</div>
              )}
              {item.label && (
                <div className="text-xs text-muted">{item.label}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
