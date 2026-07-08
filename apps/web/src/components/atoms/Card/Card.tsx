import type { CSSProperties, HTMLAttributes } from 'react';

type CardProps = {
  brackets?: boolean;
  bracketColor?: string;
  padding?: number;
  raised?: boolean;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  brackets = false,
  bracketColor = 'var(--color-accent-d)',
  padding = 24,
  raised = false,
  style,
  ...rest
}: CardProps) {
  const bracketSize = 18;
  const bw = 2;
  return (
    <div
      style={{
        position: 'relative',
        background: raised ? 'var(--color-paper)' : 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-card)',
        padding,
        ...style,
      }}
      {...rest}
    >
      {brackets && (
        <>
          <span style={{ position: 'absolute', top: 8, left: 8, width: bracketSize, height: bracketSize, borderTop: `${bw}px solid ${bracketColor}`, borderLeft: `${bw}px solid ${bracketColor}`, pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 8, right: 8, width: bracketSize, height: bracketSize, borderTop: `${bw}px solid ${bracketColor}`, borderRight: `${bw}px solid ${bracketColor}`, pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', bottom: 8, left: 8, width: bracketSize, height: bracketSize, borderBottom: `${bw}px solid ${bracketColor}`, borderLeft: `${bw}px solid ${bracketColor}`, pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', bottom: 8, right: 8, width: bracketSize, height: bracketSize, borderBottom: `${bw}px solid ${bracketColor}`, borderRight: `${bw}px solid ${bracketColor}`, pointerEvents: 'none' }} />
        </>
      )}
      {children}
    </div>
  );
}
