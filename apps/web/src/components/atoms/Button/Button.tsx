'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type ButtonVariant = 'metal' | 'ink' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[38px] px-4 text-sm',
  md: 'h-12 px-[22px] text-[15px]',
  lg: 'h-14 px-7 text-base',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  metal: [
    'bg-metal text-[#16181b]',
    'shadow-[0_1px_3px_rgba(0,0,0,.18),0_4px_12px_rgba(0,0,0,.10)]',
    'enabled:hover:-translate-y-px enabled:hover:shadow-[0_2px_6px_rgba(0,0,0,.20),0_8px_20px_rgba(0,0,0,.12)]',
    'enabled:active:scale-[0.98]',
  ].join(' '),
  ink: 'bg-ink1 text-platinum',
  outline: 'bg-transparent text-ink1 border-[1.5px] border-line',
};

export function Button({
  children,
  variant = 'metal',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  style,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-sans font-semibold leading-none rounded-btn cursor-pointer',
        'transition-[transform,box-shadow] duration-[120ms] ease-out',
        '[-webkit-tap-highlight-color:transparent]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none disabled:border-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]',
        fullWidth ? 'w-full' : '',
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.metal,
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 17} />}
    </button>
  );
}
