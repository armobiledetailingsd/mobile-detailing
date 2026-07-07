import type { CSSProperties, HTMLAttributes } from 'react';

/* StepItem — one numbered step in the "how it works" sequence.
   Big orange tabular numeral, title, one-line description. */
type StepItemProps = {
  number: number;
  title: string;
  active?: boolean;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function StepItem({ number, title, children, active = false, style, ...rest }: StepItemProps) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...style }} {...rest}>
      <span
        className="rr-numeric"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 40,
          lineHeight: 1,
          color: active ? 'var(--signal-orange)' : 'var(--graphite-600)',
          minWidth: 52,
          flex: 'none',
        }}
      >
        {String(number).padStart(2, '0')}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-condensed)',
            fontWeight: 700,
            fontSize: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: 'var(--off-white)',
          }}
        >
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--steel-300)', lineHeight: 1.5 }}>{children}</p>
      </div>
    </div>
  );
}
