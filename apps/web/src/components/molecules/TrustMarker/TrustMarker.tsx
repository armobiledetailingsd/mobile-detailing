import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

type TrustMarkerProps = {
  icon?: IconName;
  value: string;
  label: string;
  align?: CSSProperties['textAlign'];
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function TrustMarker({ icon, value, label, align = 'left', style, ...rest }: TrustMarkerProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: align, ...style }} {...rest}>
      {icon && (
        <span style={{ display: 'flex', color: 'var(--color-accent)', flexShrink: 0 }}>
          <Icon name={icon} size={24} />
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: 'var(--color-ink1)' }}>
          {value}
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--color-muted)' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
