'use client';

import { useState } from 'react';
import type { CSSProperties, TextareaHTMLAttributes } from 'react';

/* Textarea — multiline notes field matching Input styling. */
type TextareaProps = {
  invalid?: boolean;
  style?: CSSProperties;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ invalid = false, rows = 3, style, onFocus, onBlur, ...rest }: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? 'var(--signal-red)' : focused ? 'var(--signal-orange)' : 'var(--border-default)';

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
        background: 'var(--bg-input)',
        color: 'var(--off-white)',
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.5,
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        resize: 'vertical',
        boxShadow: focused ? 'var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    />
  );
}
