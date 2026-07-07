'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

/* RoadReady Button — heavy, high-contrast, big touch target.
   variant: primary (orange action) | secondary (outline) | ghost | success
   Orange is the ONLY fill for primary actions; never yellow. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZES: Record<ButtonSize, { height: number; padding: string; font: number }> = {
  sm: { height: 40, padding: '0 16px', font: 15 },
  md: { height: 52, padding: '0 24px', font: 16 },
  lg: { height: 60, padding: '0 32px', font: 18 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--signal-orange)',
    color: 'var(--text-on-accent)',
    border: '2px solid var(--signal-orange)',
    boxShadow: 'var(--shadow-cta)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--off-white)',
    border: '2px solid var(--border-strong)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--signal-orange)',
    border: '2px solid transparent',
    boxShadow: 'none',
  },
  success: {
    background: 'var(--signal-green)',
    color: 'var(--text-on-accent)',
    border: '2px solid var(--signal-green)',
    boxShadow: 'none',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  style,
  ...rest
}: ButtonProps) {
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: fullWidth ? '100%' : 'auto',
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-condensed)',
        fontWeight: 700,
        fontSize: s.font,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition:
          'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent',
        ...v,
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 22 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 22 : 18} />}
    </button>
  );
}
