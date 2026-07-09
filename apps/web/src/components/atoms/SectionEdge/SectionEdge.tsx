import type { CSSProperties, HTMLAttributes } from 'react';

/* SectionEdge — a diagonal-cut wrapper for a page section. Gives the
   asymmetric clip-path top/bottom edge instead of a straight band.
   Pass a `background` so the cut is visible against the neighboring section. */
type SectionEdgeProps = {
  cut?: 'top' | 'bottom' | 'both';
  background?: string;
  slope?: number;
  style?: CSSProperties;
} & HTMLAttributes<HTMLElement>;

export function SectionEdge({
  children,
  cut = 'top',
  background = 'var(--color-paper)',
  slope = 40,
  style,
  className,
  ...rest
}: SectionEdgeProps) {
  const clip =
    {
      top: `polygon(0 ${slope}px, 100% 0, 100% 100%, 0 100%)`,
      bottom: `polygon(0 0, 100% 0, 100% calc(100% - ${slope}px), 0 100%)`,
      both: `polygon(0 ${slope}px, 100% 0, 100% calc(100% - ${slope}px), 0 100%)`,
    }[cut] ?? undefined;

  return (
    <section
      className={`relative${className ? ` ${className}` : ''}`}
      style={{ background, clipPath: clip, ...style }}
      {...rest}
    >
      {children}
    </section>
  );
}
