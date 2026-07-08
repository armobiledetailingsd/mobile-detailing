'use client';

import { useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

type InputProps = {
  icon?: IconName;
  invalid?: boolean;
  numeric?: boolean;
  style?: CSSProperties;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ icon, invalid = false, numeric = false, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? 'var(--color-error)' : focused ? 'var(--color-accent)' : 'var(--color-line)';

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: 14,
            display: 'flex',
            color: focused ? 'var(--color-accent)' : 'var(--color-steel)',
            pointerEvents: 'none',
          }}
        >
          <Icon name={icon} size={20} />
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        style={{
          width: '100%',
          height: 48,
          padding: icon ? '0 16px 0 44px' : '0 16px',
          background: 'var(--color-paper)',
          color: 'var(--color-ink1)',
          fontFamily: 'var(--font-sans)',
          fontVariantNumeric: numeric ? 'tabular-nums lining-nums' : 'normal',
          fontSize: numeric ? 18 : 15,
          fontWeight: 500,
          border: `2px solid ${borderColor}`,
          borderRadius: 'var(--radius-input)',
          outline: 'none',
          transition: 'border-color 120ms ease',
          ...style,
        }}
        {...rest}
      />
    </div>
  );
}
