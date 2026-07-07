import { defineLive } from 'next-sanity/live';
import { client } from './client';

const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_VIEWER_TOKEN;

if (!token && process.env.NODE_ENV === 'development') {
  console.warn(
    'Missing SANITY_API_READ_TOKEN or SANITY_VIEWER_TOKEN — live preview will only show published content.',
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: 'vX',
  }),
  serverToken: token,
});
