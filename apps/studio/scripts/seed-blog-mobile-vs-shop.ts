// apps/studio/scripts/seed-blog-mobile-vs-shop.ts
//
// One-off script to publish a single blog post. Follows the same pattern as
// seed-homepage.ts. This post has no coverImage yet -- add one in Studio
// (the field is required there even though the write API doesn't enforce it).
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

function block(text: string, style: 'normal' | 'h2' = 'normal') {
  return {
    _type: 'block',
    style,
    children: [{ _type: 'span', text }],
  };
}

function bulletList(items: string[]) {
  return items.map((text) => ({
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', text }],
  }));
}

const post = {
  _type: 'blogPost',
  title: 'Mobile Detailing vs. the Shop: Why North County Drivers Are Skipping the Drop-Off',
  slug: { _type: 'slug', current: 'mobile-detailing-vs-shop' },
  excerpt:
    'No drop-off, no waiting room, no rides to arrange. Here’s what actually changes when a detailer comes to your driveway instead of the other way around.',
  publishedAt: new Date().toISOString(),
  body: [
    block(
      'If you’ve ever detailed your car the old way, you know the drill: block out a morning, drop the car off at a shop, arrange a ride home or sit in a waiting room, then come back hours later to pick it up. Mobile detailing skips all of that. We bring the water, power, and equipment to your driveway, office parking lot, or wherever your car happens to be parked in North County San Diego.',
    ),
    block('The time you actually get back', 'h2'),
    block(
      'A shop visit costs you two trips and a gap in your day you have to plan around. With mobile detailing, you drop the car off with us without ever leaving your house — work from home while we detail in the driveway, or leave the keys for us while you’re at work and come home to a finished car. No coordinating rides, no waiting rooms, no lost afternoon.',
    ),
    block('The same level of work, without the compromises', 'h2'),
    block(
      'A common assumption is that mobile means a rushed, watered-down version of a shop detail. In practice, it’s the opposite: we bring the same equipment a shop would use, and because we’re only working on one car at a time in one location, there’s no assembly-line pressure to rush through it. Our packages cover the same ground a full-service shop would:',
    ),
    ...bulletList([
      'Bronze: hand washing, spray waxing, trim and tire dressing, interior wipe-down and vacuuming',
      'Silver: machine waxing or sealant, steam cleaning, leather conditioning, carpet and upholstery extraction',
      'Gold: clay bar treatment, paint sealant, trim restoration, light scratch and swirl removal, engine bay detailing',
    ]),
    block('You can actually see the work happen', 'h2'),
    block(
      'When your car is at a shop, you drop it off and hope for the best. When it’s in your own driveway, you can see exactly what’s being done, ask questions in real time, and point out the spots that matter most to you — that stain in the back seat, the bug splatter on the bumper, the dog hair in the trunk. It’s a more direct line between what you want and what you get.',
    ),
    block('No shop overhead built into the price', 'h2'),
    block(
      'Traditional detail shops carry rent, storefront staff, and waiting-room upkeep — costs that get baked into every invoice. Mobile detailing cuts that overhead out, which is part of why we can offer the same level of service without the shop markup.',
    ),
    block('Built for how North County actually gets around', 'h2'),
    block(
      'Between Carlsbad, Oceanside, Vista, San Marcos, Escondido, Encinitas, Solana Beach, Del Mar, Rancho Santa Fe, and Fallbrook, getting a car to a shop and back can eat up more time than the detail itself. Mobile detailing removes that step entirely — we bring our own water and power, so location is never a barrier.',
    ),
    block(
      'Ready to see the difference for yourself? Book online in under two minutes, or text us at (442) 999-1980 with any questions.',
    ),
  ],
  seo: {
    metaTitle: 'Mobile Detailing vs. Shop Detailing | AR Mobile Detailing',
    metaDescription:
      'Skip the drop-off. See why North County San Diego drivers choose mobile detailing over a traditional shop visit — same quality, none of the wasted time.',
  },
};

async function seed() {
  console.log(`Publishing blog post in project=${projectId} dataset=${dataset}...`);
  const result = await client.create(post);
  console.log(`Done. Created ${result._id}. Add a cover image in Studio before it fully validates.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
