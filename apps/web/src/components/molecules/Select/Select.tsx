'use client';

import { useState } from 'react';
import type { CSSProperties, SelectHTMLAttributes } from 'react';
import { Icon } from '@/components/atoms/Icon';

export type SelectOption = string | { value: string; label: string };

/* Select — native dropdown styled to match Input, with chevron affordance. */
type SelectProps = {
  options?: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  style?: CSSProperties;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  options = [],
  placeholder,
  invalid = false,
  style,
  onFocus,
  onBlur,
  ...rest
}: SelectProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? 'var(--signal-red)' : focused ? 'var(--signal-orange)' : 'var(--border-default)';

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select
        aria-invalid={invalid || undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        defaultValue={placeholder ? '' : undefined}
        style={{
          width: '100%',
          height: 'var(--control-h)',
          padding: '0 44px 0 16px',
          background: 'var(--bg-input)',
          color: 'var(--off-white)',
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 500,
          border: `2px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          boxShadow: focused ? 'var(--focus-ring)' : 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          ...style,
        }}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => {
          const value = typeof o === 'string' ? o : o.value;
          const label = typeof o === 'string' ? o : o.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <span style={{ position: 'absolute', right: 14, display: 'flex', color: 'var(--steel-300)', pointerEvents: 'none' }}>
        <Icon name="chevron-down" size={20} />
      </span>
    </div>
  );
}
