export type PackageSlug = 'bronze' | 'silver' | 'gold';

export type Package = {
  slug: PackageSlug;
  name: string;
  priceSedan: number;
  priceTruckSuv: number;
  duration: string;
};

// Rate card mirrors the Sanity servicesSection content
// (apps/studio/scripts/update-services-pricing.ts). Calendly event durations
// are configured per package in Calendly itself; these strings are display copy.
export const PACKAGES: Package[] = [
  { slug: 'bronze', name: 'Bronze', priceSedan: 99.99, priceTruckSuv: 120, duration: '~1.5 hr' },
  { slug: 'silver', name: 'Silver', priceSedan: 180, priceTruckSuv: 249.99, duration: '~3 hr' },
  { slug: 'gold', name: 'Gold', priceSedan: 275, priceTruckSuv: 300, duration: '~4.5 hr' },
];

// Sanity service packages have no stable key, so the (case-insensitive) name
// is the join key between CMS content and booking slugs.
export function resolvePackageSlug(name: string | null | undefined): PackageSlug | null {
  const normalized = (name ?? '').trim().toLowerCase();
  return PACKAGES.some((p) => p.slug === normalized) ? (normalized as PackageSlug) : null;
}

// North County San Diego service area. This list must stay in sync with the
// coverage towns edited in Sanity (homepage coverage section): adding or
// removing a town there requires updating these ZIPs too, and vice versa —
// nothing enforces the sync automatically.
export const CORE_ZIPS = new Set([
  // Carlsbad
  '92008', '92009', '92010', '92011',
  // Oceanside
  '92054', '92056', '92057', '92058',
  // Vista
  '92081', '92083', '92084',
  // San Marcos
  '92069', '92078',
  // Escondido
  '92025', '92026', '92027', '92029',
  // Encinitas (incl. Cardiff-by-the-Sea)
  '92024', '92007',
  // Solana Beach
  '92075',
  // Del Mar
  '92014',
  // Rancho Santa Fe
  '92067', '92091',
  // Fallbrook
  '92028',
]);

// ZIPs here are serviceable but add a $25 travel fee. Move outlying ZIPs
// from CORE_ZIPS into this set if a travel surcharge is wanted.
export const TRAVEL_ZIPS = new Set<string>([]);

export function getTravelFee(zip: string): number {
  return TRAVEL_ZIPS.has(zip) ? 25 : 0;
}

export function isServiceableZip(zip: string): boolean {
  return CORE_ZIPS.has(zip) || TRAVEL_ZIPS.has(zip);
}
