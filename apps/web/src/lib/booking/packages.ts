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

export const CORE_ZIPS = new Set([
  '78701','78702','78703','78704','78705',
  '78745','78746','78748','78749',
  '78751','78756','78757','78758',
]);

export const TRAVEL_ZIPS = new Set([
  '78610','78613','78620','78641','78660',
  '78664','78681','78737','78738',
]);

export function getTravelFee(zip: string): number {
  return TRAVEL_ZIPS.has(zip) ? 25 : 0;
}

export function isServiceableZip(zip: string): boolean {
  return CORE_ZIPS.has(zip) || TRAVEL_ZIPS.has(zip);
}
