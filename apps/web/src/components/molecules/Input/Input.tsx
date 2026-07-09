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
    <div className="relative flex items-center">
      {icon && (
        <span
          className="absolute left-[14px] flex pointer-events-none"
          style={{ color: focused ? 'var(--color-accent)' : 'var(--color-steel)' }}
        >
          <Icon name={icon} size={20} />
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        className={[
          'w-full h-12 bg-paper text-ink1 font-sans font-medium rounded-input outline-none',
          'transition-[border-color] duration-[120ms] ease-out',
          icon ? 'pl-[44px] pr-4' : 'px-4',
          numeric ? 'text-[18px] [font-variant-numeric:tabular-nums_lining-nums]' : 'text-[15px]',
        ].filter(Boolean).join(' ')}
        style={{ border: `2px solid ${borderColor}`, ...style }}
        {...rest}
      />
    </div>
  );
}
