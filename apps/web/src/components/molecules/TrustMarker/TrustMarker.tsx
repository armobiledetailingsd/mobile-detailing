import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

/* TrustMarker — icon + big numeral/value + label. Used in the trust bar
   (service area, avg dispatch, jobs completed). Numerals get orange emphasis. */
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
        <span style={{ display: 'flex', color: 'var(--caution-yellow)', flex: 'none' }}>
          <Icon name={icon} size={26} />
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span className="rr-numeric" style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--off-white)' }}>
          {value}
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--steel-300)' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
