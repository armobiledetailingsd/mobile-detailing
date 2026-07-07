import { createClient } from 'next-sanity';

const PLACEHOLDER_PROJECT_ID = 'your-sanity-project-id';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? PLACEHOLDER_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-01-01';

if (projectId === PLACEHOLDER_PROJECT_ID && process.env.NODE_ENV === 'development') {
  console.warn(
    '\n[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID not set. The web app will boot but Sanity queries will fail until you set it in apps/web/.env.local.\n',
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: false,
});
