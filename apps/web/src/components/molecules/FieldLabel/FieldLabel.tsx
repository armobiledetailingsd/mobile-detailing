import type { CSSProperties, LabelHTMLAttributes } from 'react';

type FieldLabelProps = {
  optional?: boolean;
  hint?: string;
  style?: CSSProperties;
} & LabelHTMLAttributes<HTMLLabelElement>;

export function FieldLabel({ children, htmlFor, optional = false, hint, style, ...rest }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 8,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: 'var(--color-ink2)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {optional && (
        <span style={{ fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-muted)', fontWeight: 500 }}>
          Optional
        </span>
      )}
      {hint && (
        <span
          style={{
            fontSize: 12,
            letterSpacing: '0.04em',
            color: 'var(--color-muted)',
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}
