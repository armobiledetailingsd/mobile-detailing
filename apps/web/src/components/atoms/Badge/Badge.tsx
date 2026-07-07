import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

/* Badge — attention/status marker. Yellow is the default badge color
   ("Same-day", "24/7"); green for success; graphite for neutral.
   Never orange (orange is reserved for actions). */
export type BadgeTone = 'caution' | 'success' | 'neutral' | 'solid';

type BadgeProps = {
  tone?: BadgeTone;
  icon?: IconName;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>;

const TONES: Record<BadgeTone, { background: string; color: string; border: string }> = {
  caution: { background: 'var(--caution-yellow)', color: 'var(--graphite-950)', border: 'transparent' },
  success: {
    background: 'rgba(55, 214, 122, 0.16)',
    color: 'var(--signal-green)',
    border: 'rgba(55, 214, 122, 0.4)',
  },
  neutral: { background: 'var(--graphite-800)', color: 'var(--steel-300)', border: 'var(--border-default)' },
  solid: { background: 'var(--graphite-800)', color: 'var(--off-white)', border: 'var(--border-strong)' },
};

export function Badge({ children, tone = 'caution', icon, style, ...rest }: BadgeProps) {
  const t = TONES[tone] ?? TONES.caution;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 26,
        padding: '0 10px',
        fontFamily: 'var(--font-condensed)',
        fontWeight: 700,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        lineHeight: 1,
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${t.border}`,
        background: t.background,
        color: t.color,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={14} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
