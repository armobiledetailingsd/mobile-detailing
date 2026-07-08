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

const SIZES: Record<ButtonSize, { height: number; padding: string; font: number }> = {
  sm: { height: 38, padding: '0 16px', font: 14 },
  md: { height: 48, padding: '0 22px', font: 15 },
  lg: { height: 56, padding: '0 28px', font: 16 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  metal: {
    background: 'linear-gradient(135deg, #F1F3F5 0%, #CFD4DA 46%, #A7ADB6 100%)',
    color: '#16181b',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.10)',
  },
  ink: {
    background: 'var(--color-ink1)',
    color: 'var(--color-platinum)',
    border: 'none',
    boxShadow: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-ink1)',
    border: '1.5px solid var(--color-line)',
    boxShadow: 'none',
  },
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
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.metal;
  return (
    <button
      type={type}
      disabled={disabled}
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]${className ? ` ${className}` : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: s.font,
        lineHeight: 1,
        borderRadius: 'var(--radius-btn)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: disabled ? 'var(--color-line)' : (v.background as string),
        color: disabled ? 'var(--color-muted)' : (v.color as string),
        border: disabled ? 'none' : (v.border as string),
        boxShadow: disabled ? 'none' : (v.boxShadow as string),
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'metal') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,.20), 0 8px 20px rgba(0,0,0,.12)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = disabled ? 'none' : (v.boxShadow as string ?? '');
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 17} />}
    </button>
  );
}
