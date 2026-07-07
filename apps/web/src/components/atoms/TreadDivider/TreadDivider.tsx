import type { CSSProperties, HTMLAttributes } from 'react';

/* TreadDivider — a thin band of tire-tread texture used between sections
   or steps. Purely decorative; never place body text over it. */
type TreadDividerProps = {
  height?: number;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function TreadDivider({ height = 28, style, ...rest }: TreadDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        backgroundImage: 'var(--tread)',
        backgroundRepeat: 'repeat',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        ...style,
      }}
      {...rest}
    />
  );
}
