'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon } from '@/components/atoms/Icon';

/* LocationButton — the primary "Use my location" GPS control for the intake
   form. Shows a captured-state once located; manual address entry is the
   fallback rendered separately by the form. */
type LocationButtonProps = {
  located?: boolean;
  address?: string;
  loading?: boolean;
  style?: CSSProperties;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export function LocationButton({ located = false, address, loading = false, style, ...rest }: LocationButtonProps) {
  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        minHeight: 'var(--control-h)',
        padding: '12px 16px',
        textAlign: 'left',
        background: located ? 'rgba(55, 214, 122, 0.12)' : 'var(--bg-input)',
        color: 'var(--off-white)',
        border: `2px solid ${located ? 'var(--signal-green)' : 'var(--signal-orange)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          flex: 'none',
          borderRadius: 'var(--radius-sm)',
          background: located ? 'var(--signal-green)' : 'var(--signal-orange)',
          color: 'var(--graphite-950)',
        }}
      >
        <Icon name={located ? 'check' : 'crosshair'} size={20} strokeWidth={2.5} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-condensed)',
            fontWeight: 700,
            fontSize: 16,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {located ? 'Location captured' : loading ? 'Locating…' : 'Use my location'}
        </span>
        <span
          style={{
            fontSize: 13,
            color: 'var(--steel-300)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {located ? address || 'GPS pin set — tap to update' : 'Fastest way to get a tech to you'}
        </span>
      </span>
    </button>
  );
}
