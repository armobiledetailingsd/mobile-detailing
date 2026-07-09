import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

type TrustMarkerProps = {
  icon?: IconName;
  value: string;
  label: string;
  align?: CSSProperties['textAlign'];
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function TrustMarker({ icon, value, label, align = 'left', style, className, ...rest }: TrustMarkerProps) {
  return (
    <div
      className={`flex items-center gap-3${className ? ` ${className}` : ''}`}
      style={{ textAlign: align, ...style }}
      {...rest}
    >
      {icon && (
        <span className="flex text-accent shrink-0">
          <Icon name={icon} size={24} />
        </span>
      )}
      <div className="flex flex-col leading-[1.2]">
        <span className="font-sans font-bold text-[22px] text-ink1">{value}</span>
        <span className="font-sans text-[13px] font-medium text-muted">{label}</span>
      </div>
    </div>
  );
}
