import type { CSSProperties, LabelHTMLAttributes } from 'react';

type FieldLabelProps = {
  optional?: boolean;
  hint?: string;
  style?: CSSProperties;
} & LabelHTMLAttributes<HTMLLabelElement>;

export function FieldLabel({ children, htmlFor, optional = false, hint, style, className, ...rest }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={[
        'flex items-baseline gap-2 mb-2',
        'font-sans font-semibold text-[13px] uppercase tracking-[0.07em] text-ink2',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {children}
      {optional && (
        <span className="text-[12px] tracking-[0.04em] text-muted font-medium normal-case">
          Optional
        </span>
      )}
      {hint && (
        <span className="text-[12px] tracking-[0.04em] text-muted font-medium normal-case">
          {hint}
        </span>
      )}
    </label>
  );
}
