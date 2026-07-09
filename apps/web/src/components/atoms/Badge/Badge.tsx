import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type BadgeTone = 'caution' | 'success' | 'neutral' | 'solid';

type BadgeProps = {
  tone?: BadgeTone;
  icon?: IconName;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>;

const TONE_CLASSES: Record<BadgeTone, string> = {
  caution: 'bg-[rgba(247,144,9,0.14)] text-warning border border-[rgba(247,144,9,0.3)]',
  success: 'bg-[rgba(18,183,106,0.12)] text-success border border-[rgba(18,183,106,0.3)]',
  neutral: 'bg-paper text-ink2 border border-line',
  solid: 'bg-elev-d text-platinum border border-white/10',
};

export function Badge({ children, tone = 'neutral', icon, style, className, ...rest }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-[5px] h-6 px-[10px]',
        'font-sans font-semibold text-[11px] uppercase tracking-[0.08em] leading-none',
        'rounded-full whitespace-nowrap',
        TONE_CLASSES[tone] ?? TONE_CLASSES.neutral,
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {icon && <Icon name={icon} size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
