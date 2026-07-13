export type Package = {
  id: string;
  name: string;
  price: number;
  duration: string;
  durationMin: number;
  description: string;
  includes: string[];
  popular?: boolean;
};

export type Addon = {
  id: string;
  label: string;
  price: number;
  durationMin: number;
};

export const PACKAGES: Package[] = [
  {
    id: 'express',
    name: 'Express Refresh',
    price: 89,
    duration: '~45 min',
    durationMin: 45,
    description: 'Quick refresh for a clean, polished look between full details.',
    includes: ['Exterior hand wash', 'Wheel & tire clean', 'Interior vacuum', 'Window wipe-down'],
  },
  {
    id: 'signature',
    name: 'Signature Detail',
    price: 249,
    duration: '~3 hr',
    durationMin: 180,
    description: 'Our most popular service — a thorough inside-and-out transformation.',
    includes: [
      'Full exterior wash & clay bar',
      'Hand wax & paint sealant',
      'Interior deep clean & shampoo',
      'Leather conditioning',
      'Glass polish (all windows)',
    ],
    popular: true,
  },
  {
    id: 'ceramic',
    name: 'Ceramic Coating',
    price: 699,
    duration: '~5 hr',
    durationMin: 300,
    description: 'Professional-grade ceramic protection that lasts years, not weeks.',
    includes: [
      'Paint decontamination & prep',
      'Single-stage machine polish',
      '9H ceramic coating application',
      '24-hr cure time guidance',
    ],
  },
  {
    id: 'correction',
    name: 'Paint Correction',
    price: 549,
    duration: '~6 hr',
    durationMin: 360,
    description: 'Eliminate swirls, scratches, and oxidation for showroom-grade clarity.',
    includes: [
      'Multi-stage machine polishing',
      'Swirl & scratch removal',
      'Paint depth measurement',
      'Sealant finish coat',
    ],
  },
];

export const ADDONS: Addon[] = [
  { id: 'pet-hair',  label: 'Pet Hair Removal',     price: 40, durationMin: 30 },
  { id: 'engine',    label: 'Engine Bay Detail',     price: 45, durationMin: 30 },
  { id: 'headlight', label: 'Headlight Restoration', price: 60, durationMin: 45 },
  { id: 'odor',      label: 'Odor Elimination',      price: 50, durationMin: 30 },
];

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
