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

const DIMS: Record<IconButtonSize, number> = { sm: 36, md: 44, lg: 52 };

const VARIANTS: Record<IconButtonVariant, CSSProperties> = {
  primary: { background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)', color: '#16181b', border: 'none' },
  secondary: { background: 'var(--color-paper)', color: 'var(--color-ink2)', border: '1px solid var(--color-line)' },
  ghost: { background: 'transparent', color: 'var(--color-ink2)', border: '1px solid transparent' },
};

export function IconButton({
  icon,
  variant = 'secondary',
  size = 'md',
  label,
  disabled = false,
  style,
  ...rest
}: IconButtonProps) {
  const d = DIMS[size] ?? DIMS.md;
  const iconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 18;
  const v = VARIANTS[variant] ?? VARIANTS.secondary;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: d,
        height: d,
        borderRadius: 'var(--radius-btn)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 120ms ease',
        WebkitTapHighlightColor: 'transparent',
        ...v,
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
