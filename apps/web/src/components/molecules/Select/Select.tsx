'use client';

import { useState } from 'react';
import type { CSSProperties, SelectHTMLAttributes } from 'react';
import { Icon } from '@/components/atoms/Icon';

export type SelectOption = string | { value: string; label: string };

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
  const borderColor = invalid ? 'var(--color-error)' : focused ? 'var(--color-accent)' : 'var(--color-line)';

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
          height: 48,
          padding: '0 44px 0 16px',
          background: 'var(--color-paper)',
          color: 'var(--color-ink1)',
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          fontWeight: 500,
          border: `2px solid ${borderColor}`,
          borderRadius: 'var(--radius-input)',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          transition: 'border-color 120ms ease',
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
      <span style={{ position: 'absolute', right: 14, display: 'flex', color: 'var(--color-steel)', pointerEvents: 'none' }}>
        <Icon name="chevron-down" size={20} />
      </span>
    </div>
  );
}
