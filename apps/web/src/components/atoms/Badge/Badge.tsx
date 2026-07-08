import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type BadgeTone = 'caution' | 'success' | 'neutral' | 'solid';

type BadgeProps = {
  tone?: BadgeTone;
  icon?: IconName;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>;

const TONES: Record<BadgeTone, { background: string; color: string; border: string }> = {
  caution: { background: 'rgba(247,144,9,0.14)', color: 'var(--color-warning)', border: 'rgba(247,144,9,0.3)' },
  success: { background: 'rgba(18,183,106,0.12)', color: 'var(--color-success)', border: 'rgba(18,183,106,0.3)' },
  neutral: { background: 'var(--color-paper)', color: 'var(--color-ink2)', border: 'var(--color-line)' },
  solid: { background: 'var(--color-elev-d)', color: 'var(--color-platinum)', border: 'rgba(255,255,255,0.1)' },
};

export function Badge({ children, tone = 'neutral', icon, style, ...rest }: BadgeProps) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 24,
        padding: '0 10px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        lineHeight: 1,
        borderRadius: 100,
        border: `1px solid ${t.border}`,
        background: t.background,
        color: t.color,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
