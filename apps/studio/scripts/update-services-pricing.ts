// apps/studio/scripts/update-services-pricing.ts
// Replaces the servicesSection packages/addons on the homepage (published and
// draft) with the current rate card. Content must mirror scripts/seed-homepage.ts.
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID is required');
if (!token) throw new Error('SANITY_API_TOKEN is required (needs write permission)');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const packages = [
  {
    _type: 'servicePackage',
    _key: 'pkg1',
    name: 'Bronze',
    priceSedan: 99.99,
    priceTruckSuv: 120,
    duration: '~1.5 hr',
    description: 'A thorough wash and interior refresh to keep your car looking its best.',
    includes: [
      'Hand washing',
      'Spray waxing',
      'Trim and tire dressing',
      'Interior and plastic wiping',
      'Vacuuming',
      'Cleaning: pedals, steering wheel, door panels, windows, carpets, and spot stains',
    ],
    popular: false,
  },
  {
    _type: 'servicePackage',
    _key: 'pkg2',
    name: 'Silver',
    priceSedan: 180,
    priceTruckSuv: 249.99,
    duration: '~3 hr',
    description: 'Deep interior detailing plus machine waxing or sealant for lasting protection.',
    includes: [
      'Machine waxing or sealant application',
      'Trim and tire dressing',
      'Steam cleaning: interior plastics, door panels, air vents',
      'Deep cleaning and vacuuming',
      'Leather conditioning',
      'Carpet and/or upholstery extraction and shampooing',
      'Cleaning: pedals, steering wheel, door jambs, windows inside and out',
    ],
    popular: true,
  },
  {
    _type: 'servicePackage',
    _key: 'pkg3',
    name: 'Gold',
    priceSedan: 275,
    priceTruckSuv: 300,
    duration: '~4.5 hr',
    description: 'Our most complete detail, from clay bar and sealant to engine bay work.',
    includes: [
      'Hand washing and clay bar treatment',
      'Waxing and sealant application',
      'Trim restoration, tire dressing, and wheel cleaning',
      'Interior plastic and vent steam cleaning',
      'Vacuuming and leather conditioning',
      'Carpet, floor mats, and upholstery shampooing and extraction',
      'Cleaning: pedals, roof, trunk, steering wheel, door jambs, windows inside and out',
      'Light scratch and swirl removal',
      'Engine bay work',
    ],
    popular: false,
  },
];

const addons = [
  { _type: 'serviceAddon', _key: 'ao1', label: 'Headlight Restoration', price: 50 },
  { _type: 'serviceAddon', _key: 'ao2', label: 'Dog Hair Removal', price: 50 },
  { _type: 'serviceAddon', _key: 'ao3', label: 'Rock Chip Touch-Ups', price: 100 },
];

type Section = { _type: string; [key: string]: unknown };

async function updateServicesPricing() {
  for (const id of ['siteHomepage', 'drafts.siteHomepage']) {
    const doc = await client.getDocument<{ sections?: Section[] }>(id);
    if (!doc) {
      console.log(`Skipping ${id} (not found)`);
      continue;
    }
    const sections = (doc.sections ?? []).map((s) =>
      s._type === 'servicesSection' ? { ...s, packages, addons } : s,
    );
    await client.patch(id).set({ sections }).commit();
    console.log(`Updated servicesSection on ${id}`);
  }
}

updateServicesPricing().catch((err) => {
  console.error(err);
  process.exit(1);
});
