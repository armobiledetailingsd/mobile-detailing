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
    <div className="relative flex items-center">
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
        className="w-full h-12 pl-4 pr-[44px] bg-paper text-ink1 font-sans text-[15px] font-medium rounded-input outline-none appearance-none cursor-pointer transition-[border-color] duration-[120ms] ease-out"
        style={{ border: `2px solid ${borderColor}`, ...style }}
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
      <span className="absolute right-[14px] flex text-steel pointer-events-none">
        <Icon name="chevron-down" size={20} />
      </span>
    </div>
  );
}
