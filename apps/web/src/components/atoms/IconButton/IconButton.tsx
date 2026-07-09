'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

type IconButtonProps = {
  icon: IconName;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
  style?: CSSProperties;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const DIM_CLASSES: Record<IconButtonSize, string> = {
  sm: 'size-9',
  md: 'size-11',
  lg: 'size-[52px]',
};

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  primary: 'bg-metal text-[#16181b] border-0',
  secondary: 'bg-paper text-ink2 border border-line',
  ghost: 'bg-transparent text-ink2 border border-transparent',
};

export function IconButton({
  icon,
  variant = 'secondary',
  size = 'md',
  label,
  disabled = false,
  style,
  className,
  ...rest
}: IconButtonProps) {
  const iconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 18;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-btn cursor-pointer',
        'transition-opacity duration-[120ms] ease-out',
        '[-webkit-tap-highlight-color:transparent]',
        'disabled:opacity-[0.45] disabled:cursor-not-allowed',
        DIM_CLASSES[size] ?? DIM_CLASSES.md,
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.secondary,
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
