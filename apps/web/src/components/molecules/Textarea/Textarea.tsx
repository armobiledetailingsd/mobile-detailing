'use client';

import { useState } from 'react';
import type { CSSProperties, TextareaHTMLAttributes } from 'react';

type TextareaProps = {
  invalid?: boolean;
  style?: CSSProperties;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ invalid = false, rows = 3, style, onFocus, onBlur, ...rest }: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? 'var(--color-error)' : focused ? 'var(--color-accent)' : 'var(--color-line)';

  return (
    <textarea
      rows={rows}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      className="w-full py-[14px] px-4 bg-paper text-ink1 font-sans text-[15px] font-normal leading-[1.5] rounded-input outline-none resize-y transition-[border-color] duration-[120ms] ease-out"
      style={{ border: `2px solid ${borderColor}`, ...style }}
      {...rest}
    />
  );
}
