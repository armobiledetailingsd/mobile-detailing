'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

/* Square icon-only button. Same weight language as Button but compact. */
export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

type IconButtonProps = {
  icon: IconName;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
  style?: CSSProperties;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const DIMS: Record<IconButtonSize, number> = { sm: 40, md: 48, lg: 56 };

const VARIANTS: Record<IconButtonVariant, CSSProperties> = {
  primary: { background: 'var(--signal-orange)', color: 'var(--text-on-accent)', border: '2px solid var(--signal-orange)' },
  secondary: { background: 'var(--bg-input)', color: 'var(--off-white)', border: '2px solid var(--border-default)' },
  ghost: { background: 'transparent', color: 'var(--off-white)', border: '2px solid transparent' },
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
  const iconSize = size === 'lg' ? 24 : size === 'sm' ? 18 : 20;
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
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent',
        ...v,
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.96)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
