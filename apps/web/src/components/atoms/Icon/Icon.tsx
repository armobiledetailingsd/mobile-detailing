import type { CSSProperties, SVGProps } from 'react';

/* Alex Detailing line-icon set — 24px grid, 2px stroke, round caps/joins.
   Industrial, functional glyphs. Add new icons to PATHS as needed. */
export type IconName =
  | 'phone'
  | 'map-pin'
  | 'navigation'
  | 'crosshair'
  | 'camera'
  | 'clock'
  | 'wrench'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'arrow-right'
  | 'star'
  | 'shield'
  | 'truck'
  | 'alert-triangle'
  | 'x'
  | 'upload'
  | 'dollar-sign'
  | 'message'
  | 'menu'
  | 'gauge';

const PATHS: Record<IconName, React.ReactNode> = {
  phone: <path d="M5 3h3l2 5-2 1.5a12 12 0 0 0 5.5 5.5L20 13l1 6-3 2C10 21 3 14 3 6z" />,
  'map-pin': (
    <>
      <path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  navigation: <path d="M3 11l18-8-8 18-2-8-8-2z" />,
  crosshair: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8h4l2-3h6l2 3h4v12H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  wrench: <path d="M15 4a5 5 0 0 0-5 6L3 17l4 4 7-7a5 5 0 0 0 6-5l-3.5 3.5L14 12l-.5-3z" />,
  check: <path d="M4 12.5l5 5L20 6" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'arrow-right': <path d="M4 12h15M13 6l6 6-6 6" />,
  star: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7z" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 9h4l4 3v4h-8z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="M12 3l10 17H2z" />
      <path d="M12 9v5M12 17.5v.5" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </>
  ),
  'dollar-sign': (
    <>
      <path d="M12 2v20" />
      <path d="M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.8 7 7s2.2 3 5 3.5 5 1.4 5 3.5-2.2 3.5-5 3.5S7 19.4 7 17.5" />
    </>
  ),
  message: <path d="M4 4h16v12H8l-4 4z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 14l4-4" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, 'style' | 'className'>;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = 'currentColor',
  style,
  className,
  ...rest
}: IconProps) {
  const glyph = PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rest['aria-label'] ? undefined : true}
      className={className}
      style={{ display: 'block', flex: 'none', ...style }}
      {...rest}
    >
      {glyph ?? null}
    </svg>
  );
}
