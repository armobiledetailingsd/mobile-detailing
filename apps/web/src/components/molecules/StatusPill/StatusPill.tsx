import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type StatusPillStatus = 'success' | 'active' | 'pending' | 'action';

type StatusPillProps = {
  status?: StatusPillStatus;
  icon?: IconName;
  pulse?: boolean;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>;

const STATUS_CLASSES: Record<StatusPillStatus, string> = {
  success: 'text-success bg-[rgba(18,183,106,0.12)] border-[rgba(18,183,106,0.3)]',
  active: 'text-warning bg-[rgba(247,144,9,0.12)] border-[rgba(247,144,9,0.3)]',
  pending: 'text-muted bg-paper border-line',
  action: 'text-error bg-[rgba(240,68,56,0.12)] border-[rgba(240,68,56,0.3)]',
};

const DOT_CLASSES: Record<StatusPillStatus, string> = {
  success: 'bg-success',
  active: 'bg-warning',
  pending: 'bg-steel',
  action: 'bg-error',
};

export function StatusPill({ children, status = 'success', icon, pulse = false, style, className, ...rest }: StatusPillProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 py-2 px-[14px]',
        'border rounded-full',
        'font-sans font-semibold text-[13px] uppercase tracking-[0.06em]',
        STATUS_CLASSES[status] ?? STATUS_CLASSES.success,
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {icon ? (
        <Icon name={icon} size={16} strokeWidth={2.5} />
      ) : (
        <span className={`w-[9px] h-[9px] rounded-full shrink-0 ${DOT_CLASSES[status] ?? DOT_CLASSES.success}`} />
      )}
      {children}
    </span>
  );
}
