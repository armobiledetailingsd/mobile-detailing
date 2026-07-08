import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type StatusPillStatus = 'success' | 'active' | 'pending' | 'action';

type StatusPillProps = {
  status?: StatusPillStatus;
  icon?: IconName;
  pulse?: boolean;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>;

const MAP: Record<StatusPillStatus, { fg: string; dot: string; bg: string; bd: string }> = {
  success: { fg: 'var(--color-success)', dot: 'var(--color-success)', bg: 'rgba(18,183,106,0.12)', bd: 'rgba(18,183,106,0.3)' },
  active: { fg: 'var(--color-warning)', dot: 'var(--color-warning)', bg: 'rgba(247,144,9,0.12)', bd: 'rgba(247,144,9,0.3)' },
  pending: { fg: 'var(--color-muted)', dot: 'var(--color-steel)', bg: 'var(--color-paper)', bd: 'var(--color-line)' },
  action: { fg: 'var(--color-error)', dot: 'var(--color-error)', bg: 'rgba(240,68,56,0.12)', bd: 'rgba(240,68,56,0.3)' },
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
        borderRadius: 100,
        color: c.fg,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
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
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
