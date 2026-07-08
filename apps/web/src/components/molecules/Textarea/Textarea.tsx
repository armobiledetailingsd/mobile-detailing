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
      style={{
        width: '100%',
        padding: '14px 16px',
        background: 'var(--color-paper)',
        color: 'var(--color-ink1)',
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        fontWeight: 400,
        lineHeight: 1.5,
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--radius-input)',
        outline: 'none',
        resize: 'vertical',
        transition: 'border-color 120ms ease',
        ...style,
      }}
      {...rest}
    />
  );
}
