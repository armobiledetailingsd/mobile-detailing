// apps/studio/scripts/seed-homepage.ts
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local from the studio app directory
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

const homepage = {
  _id: 'siteHomepage',
  _type: 'websitePage',
  title: 'Homepage',
  slug: { _type: 'slug', current: 'homepage' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero',
      eyebrow: "Austin's Mobile Detail Service",
      headlineMain: 'Premium detailing,',
      headlineAccent: 'delivered to you.',
      body: "Austin's mobile detail service. We come to your home or office, no shop needed.",
      trustMarkers: [
        { _type: 'trustMarker', _key: 'tm1', icon: 'star', value: '5.0', label: 'on Google' },
        { _type: 'trustMarker', _key: 'tm2', icon: 'check-circle', value: '140+', label: 'reviews' },
        { _type: 'trustMarker', _key: 'tm3', icon: 'shield', value: 'Fully', label: 'insured' },
        { _type: 'trustMarker', _key: 'tm4', icon: 'truck', value: 'We come', label: 'to you' },
      ],
    },
    {
      _type: 'trustBar',
      _key: 'trust',
      items: [
        { _type: 'trustBarItem', _key: 'tb1', icon: 'star', value: '5.0 Rating', label: 'on Google' },
        { _type: 'trustBarItem', _key: 'tb2', icon: 'check-circle', value: '140+ Reviews', label: 'verified customers' },
        { _type: 'trustBarItem', _key: 'tb3', icon: 'shield', value: 'Fully Insured', label: 'licensed & bonded' },
        { _type: 'trustBarItem', _key: 'tb4', icon: 'truck', value: 'Mobile Service', label: 'we come to you' },
      ],
    },
    {
      _type: 'servicesSection',
      _key: 'services',
      eyebrow: 'What we offer',
      heading: 'Services & Pricing',
      packages: [
        {
          _type: 'servicePackage',
          _key: 'pkg1',
          name: 'Express Refresh',
          price: 89,
          duration: '~45 min',
          description: 'Quick refresh for a clean, polished look between full details.',
          includes: ['Exterior hand wash', 'Wheel & tire clean', 'Interior vacuum', 'Window wipe-down'],
          popular: false,
        },
        {
          _type: 'servicePackage',
          _key: 'pkg2',
          name: 'Signature Detail',
          price: 249,
          duration: '~3 hr',
          description: 'Our most popular service -- a thorough inside-and-out transformation.',
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
          _type: 'servicePackage',
          _key: 'pkg3',
          name: 'Ceramic Coating',
          price: 699,
          duration: '~5 hr',
          description: 'Professional-grade ceramic protection that lasts years, not weeks.',
          includes: [
            'Paint decontamination & prep',
            'Single-stage machine polish',
            '9H ceramic coating application',
            '24-hr cure time guidance',
          ],
          popular: false,
        },
        {
          _type: 'servicePackage',
          _key: 'pkg4',
          name: 'Paint Correction',
          price: 549,
          duration: '~6 hr',
          description: 'Eliminate swirls, scratches, and oxidation for showroom-grade clarity.',
          includes: [
            'Multi-stage machine polishing',
            'Swirl & scratch removal',
            'Paint depth measurement',
            'Sealant finish coat',
          ],
          popular: false,
        },
      ],
      addons: [
        { _type: 'serviceAddon', _key: 'ao1', label: 'Pet Hair Removal', price: 40, duration: '~30 min' },
        { _type: 'serviceAddon', _key: 'ao2', label: 'Engine Bay Detail', price: 45, duration: '~30 min' },
        { _type: 'serviceAddon', _key: 'ao3', label: 'Headlight Restoration', price: 60, duration: '~45 min' },
        { _type: 'serviceAddon', _key: 'ao4', label: 'Odor Elimination', price: 50, duration: '~30 min' },
      ],
    },
    {
      _type: 'howItWorks',
      _key: 'hiw',
      eyebrow: 'Simple process',
      heading: 'How it works',
      steps: [
        { _type: 'step', _key: 's1', title: 'Book online', description: 'Choose your service and pick a time that works for you. Takes under 2 minutes.' },
        { _type: 'step', _key: 's2', title: 'We come to you', description: 'Our detailer arrives at your home, office, or wherever your car is parked.' },
        { _type: 'step', _key: 's3', title: 'Drive away clean', description: "Sit back while we work. You'll get a spotless car without leaving your driveway." },
      ],
    },
    {
      _type: 'reviewsSection',
      _key: 'reviews',
      eyebrow: 'What customers say',
      heading: 'Trusted by Austin drivers',
      rating: 5.0,
      reviewCount: 140,
      quotes: [
        {
          _type: 'reviewQuote',
          _key: 'r1',
          quote: 'Absolutely incredible work. My car looks better than it did when I bought it. Will 100% be booking again.',
          name: 'Marcus T.',
          city: 'Austin, TX',
        },
        {
          _type: 'reviewQuote',
          _key: 'r2',
          quote: 'The convenience alone is worth it -- they came to my office while I worked. Car was spotless when I came down.',
          name: 'Priya S.',
          city: 'Round Rock, TX',
        },
        {
          _type: 'reviewQuote',
          _key: 'r3',
          quote: "Best detail I've ever had. The ceramic coating looks amazing and the team was super professional.",
          name: 'Jordan K.',
          city: 'Cedar Park, TX',
        },
      ],
    },
    {
      _type: 'coverageSection',
      _key: 'coverage',
      eyebrow: 'Service area',
      heading: 'We come to you across Greater Austin',
      body: "We serve the greater Austin metro. If your zip isn't listed, reach out -- we may still be able to help.",
      towns: [
        'Austin', 'Round Rock', 'Cedar Park', 'Pflugerville', 'Georgetown',
        'Kyle', 'Buda', 'Leander', 'Manor', 'Bee Cave',
      ],
    },
    {
      _type: 'depositCallout',
      _key: 'deposit',
      eyebrow: 'Booking policy',
      heading: 'A small deposit holds your spot',
      body: "We require a deposit at booking to reserve your time slot. It goes toward your total -- no extra fees.",
      depositAmount: '$70',
      depositLabel: 'Deposit',
      depositNote: 'Applied to your total at checkout. Refundable with 24-hour notice.',
      reasons: [
        { _type: 'depositReason', _key: 'd1', icon: 'clock', title: 'Protects your time slot', description: 'Guarantees we show up for you.' },
        { _type: 'depositReason', _key: 'd2', icon: 'dollar-sign', title: 'Goes toward your total', description: 'Not an extra charge.' },
        { _type: 'depositReason', _key: 'd3', icon: 'check-circle', title: 'Easy refunds', description: '24-hour cancellation window.' },
      ],
    },
    {
      _type: 'smsBanner',
      _key: 'sms',
      headline: 'Questions? Text us.',
      body: 'Fast replies, no hold music.',
      phoneNumber: '+15124567890',
      phoneDisplay: '(512) 456-7890',
    },
    {
      _type: 'finalCta',
      _key: 'cta',
      eyebrow: 'Ready to book?',
      heading: 'Your car deserves better.',
      body: 'Schedule in under 2 minutes. We come to you -- no shop, no hassle.',
      phoneNumber: '+15124567890',
      phoneDisplay: '(512) 456-7890',
      trustItems: [
        { _type: 'trustItem', _key: 'ti1', icon: 'star', text: '5.0 on Google (140+ reviews)' },
        { _type: 'trustItem', _key: 'ti2', icon: 'shield', text: 'Fully insured' },
        { _type: 'trustItem', _key: 'ti3', icon: 'check-circle', text: 'Satisfaction guaranteed' },
      ],
    },
    {
      _type: 'gallery',
      _key: 'gallery',
      eyebrow: 'Our work',
      heading: 'Results that speak for themselves',
      items: [
        { _type: 'galleryItem', _key: 'g1', label: 'Paint correction before/after', aspect: '4/3' },
        { _type: 'galleryItem', _key: 'g2', label: 'Ceramic coating application', aspect: '16/9' },
        { _type: 'galleryItem', _key: 'g3', label: 'Interior deep clean', aspect: '4/3' },
        { _type: 'galleryItem', _key: 'g4', label: 'Engine bay detail', aspect: '4/3' },
        { _type: 'galleryItem', _key: 'g5', label: 'Wheel & tire restoration', aspect: '4/3' },
        { _type: 'galleryItem', _key: 'g6', label: 'Signature Detail result', aspect: '16/9' },
      ],
    },
  ],
};

async function seed() {
  console.log(`Seeding siteHomepage in project=${projectId} dataset=${dataset}...`);
  await client.createOrReplace(homepage);
  console.log('Done. Open Sanity Studio to upload gallery images.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
