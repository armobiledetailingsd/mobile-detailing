import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

/* StatusPill — live job status indicator (en route, deposit received, etc.).
   Larger than Badge; used in confirmation/tracking states. */
export type StatusPillStatus = 'success' | 'active' | 'pending' | 'action';

type StatusPillProps = {
  status?: StatusPillStatus;
  icon?: IconName;
  pulse?: boolean;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>;

const MAP: Record<StatusPillStatus, { fg: string; dot: string; bg: string; bd: string }> = {
  success: { fg: 'var(--signal-green)', dot: 'var(--signal-green)', bg: 'rgba(55, 214, 122, 0.12)', bd: 'rgba(55, 214, 122, 0.4)' },
  active: { fg: 'var(--caution-yellow)', dot: 'var(--caution-yellow)', bg: 'rgba(255, 198, 39, 0.12)', bd: 'rgba(255, 198, 39, 0.4)' },
  pending: { fg: 'var(--steel-300)', dot: 'var(--steel-500)', bg: 'var(--graphite-800)', bd: 'var(--border-default)' },
  action: { fg: 'var(--signal-orange)', dot: 'var(--signal-orange)', bg: 'rgba(255, 90, 31, 0.12)', bd: 'rgba(255, 90, 31, 0.4)' },
};

export function StatusPill({ children, status = 'success', icon, pulse = false, style, ...rest }: StatusPillProps) {
  const c = MAP[status] ?? MAP.success;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        background: c.bg,
        border: `1px solid ${c.bd}`,
        borderRadius: 'var(--radius-pill)',
        color: c.fg,
        fontFamily: 'var(--font-condensed)',
        fontWeight: 700,
        fontSize: 15,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        ...style,
      }}
      {...rest}
    >
      {icon ? (
        <Icon name={icon} size={16} strokeWidth={2.5} />
      ) : (
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: c.dot,
            boxShadow: pulse ? `0 0 0 0 ${c.dot}` : 'none',
            animation: pulse ? 'rr-pulse 1.6s var(--ease-out) infinite' : 'none',
          }}
        />
      )}
      {children}
    </span>
  );
}
