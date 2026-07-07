/**
 * Normalises a Sanity-stored href for use in anchor tags.
 * Bare #section anchors are prefixed with / so they link to the homepage
 * section from any route, not just the current page.
 */
export function resolveNavHref(href: string | null | undefined): string {
  if (!href) return '#';
  if (href.startsWith('#')) return `/${href}`;
  return href;
}
