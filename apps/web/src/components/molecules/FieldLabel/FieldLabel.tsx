import type { CSSProperties, LabelHTMLAttributes } from 'react';

/* FieldLabel — uppercase condensed label with optional "(optional)" hint.
   Pairs above every form control. */
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
        fontFamily: 'var(--font-condensed)',
        fontWeight: 600,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--off-white)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {optional && (
        <span style={{ fontSize: 12, letterSpacing: '0.04em', color: 'var(--steel-500)', fontWeight: 500 }}>
          Optional
        </span>
      )}
      {hint && (
        <span
          style={{
            fontSize: 12,
            letterSpacing: '0.04em',
            color: 'var(--steel-300)',
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
