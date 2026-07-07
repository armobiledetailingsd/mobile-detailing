'use client';

import { useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';

/* Input — dark field, big touch target, orange focus ring. Optional leading icon. */
type InputProps = {
  icon?: IconName;
  invalid?: boolean;
  numeric?: boolean;
  style?: CSSProperties;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ icon, invalid = false, numeric = false, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? 'var(--signal-red)' : focused ? 'var(--signal-orange)' : 'var(--border-default)';

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: 14,
            display: 'flex',
            color: focused ? 'var(--signal-orange)' : 'var(--steel-300)',
            pointerEvents: 'none',
          }}
        >
          <Icon name={icon} size={20} />
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          width: '100%',
          height: 'var(--control-h)',
          padding: icon ? '0 16px 0 44px' : '0 16px',
          background: 'var(--bg-input)',
          color: 'var(--off-white)',
          fontFamily: numeric ? 'var(--font-numeric)' : 'var(--font-body)',
          fontVariantNumeric: numeric ? 'tabular-nums lining-nums' : 'normal',
          fontSize: numeric ? 18 : 16,
          fontWeight: 500,
          border: `2px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          boxShadow: focused ? 'var(--focus-ring)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          ...style,
        }}
        {...rest}
      />
    </div>
  );
}
