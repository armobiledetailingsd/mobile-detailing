'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties } from 'react';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/atoms/Icon';

export type ButtonVariant = 'metal' | 'ink' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  style?: CSSProperties;
};

type ButtonAsButtonProps = BaseProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
// With href, renders a Next.js Link styled as a button — one interactive
// element, so keyboard activation and the focus ring live on the link itself.
type ButtonAsLinkProps = BaseProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href'
  >;
export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[38px] px-4 text-sm',
  md: 'h-12 px-[22px] text-[15px]',
  lg: 'h-14 px-7 text-base',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  metal: 'bg-metal text-[#16181b] shadow-[0_1px_3px_rgba(0,0,0,.18),0_4px_12px_rgba(0,0,0,.10)]',
  ink: 'bg-ink1 text-platinum',
  outline: 'bg-transparent text-ink1 border-[1.5px] border-line',
};

// :enabled doesn't match anchors, so the metal hover/active styles need an
// unprefixed form for the link render.
const METAL_INTERACTION = {
  button:
    'enabled:hover:-translate-y-px enabled:hover:shadow-[0_2px_6px_rgba(0,0,0,.20),0_8px_20px_rgba(0,0,0,.12)] enabled:active:scale-[0.98]',
  link: 'hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,.20),0_8px_20px_rgba(0,0,0,.12)] active:scale-[0.98]',
};

const ALLOWED_HREF_SCHEMES = ['http:', 'https:', 'tel:', 'mailto:'];

// Root-relative hrefs go through next/link (never hit a raw <a>); this only
// guards absolute/scheme hrefs, which may come from CMS content.
function isAllowedHref(href: string): boolean {
  try {
    return ALLOWED_HREF_SCHEMES.includes(new URL(href, 'https://placeholder.invalid').protocol);
  } catch {
    return false;
  }
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'metal',
    size = 'md',
    icon,
    iconRight,
    fullWidth = false,
    style,
    className,
  } = props;

  const isLink = props.href !== undefined;

  const classes = [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-semibold leading-none rounded-btn cursor-pointer',
    'transition-[transform,box-shadow] duration-[120ms] ease-out',
    '[-webkit-tap-highlight-color:transparent]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]',
    fullWidth ? 'w-full' : '',
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.metal,
    variant === 'metal' ? METAL_INTERACTION[isLink ? 'link' : 'button'] : '',
    isLink
      ? 'no-underline'
      : 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none disabled:border-0',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 17} />}
    </>
  );

  if (props.href !== undefined) {
    const {
      href,
      children: _children,
      variant: _variant,
      size: _size,
      icon: _icon,
      iconRight: _iconRight,
      fullWidth: _fullWidth,
      style: _style,
      className: _className,
      ...anchorRest
    } = props;
    // next/link only handles internal routes; tel:, mailto:, and absolute URLs
    // get a plain anchor.
    if (!href.startsWith('/')) {
      // href may come from CMS content — refuse to render javascript:/data:
      // etc. as an interactive link.
      if (!isAllowedHref(href)) {
        return (
          <span className={classes} style={style}>
            {content}
          </span>
        );
      }
      return (
        <a href={href} className={classes} style={style} {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} style={style} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const {
    href: _href,
    children: _children,
    variant: _variant,
    size: _size,
    icon: _icon,
    iconRight: _iconRight,
    fullWidth: _fullWidth,
    style: _style,
    className: _className,
    disabled = false,
    type = 'button',
    ...buttonRest
  } = props;

  return (
    <button type={type} disabled={disabled} className={classes} style={style} {...buttonRest}>
      {content}
    </button>
  );
}
