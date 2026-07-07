import type { CSSProperties, HTMLAttributes } from 'react';

/* Card — graphite surface with hard corners. Optional corner-bracket
   viewfinder framing (the brand motif) via `brackets`. */
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
  bracketColor = 'var(--caution-yellow)',
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
        background: raised ? 'var(--bg-raised)' : 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding,
        boxShadow: raised ? 'var(--shadow-raised)' : 'var(--shadow-card)',
        ...style,
      }}
      {...rest}
    >
      {brackets && (
        <>
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              width: bracketSize,
              height: bracketSize,
              borderTop: `${bw}px solid ${bracketColor}`,
              borderLeft: `${bw}px solid ${bracketColor}`,
              pointerEvents: 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: bracketSize,
              height: bracketSize,
              borderTop: `${bw}px solid ${bracketColor}`,
              borderRight: `${bw}px solid ${bracketColor}`,
              pointerEvents: 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              width: bracketSize,
              height: bracketSize,
              borderBottom: `${bw}px solid ${bracketColor}`,
              borderLeft: `${bw}px solid ${bracketColor}`,
              pointerEvents: 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: bracketSize,
              height: bracketSize,
              borderBottom: `${bw}px solid ${bracketColor}`,
              borderRight: `${bw}px solid ${bracketColor}`,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}
