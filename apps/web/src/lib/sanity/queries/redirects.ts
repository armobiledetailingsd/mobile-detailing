import { groq } from 'next-sanity';
import { client } from '../client';
import type { AllRedirectsQueryResult } from '@/sanity.types';

const allRedirectsQuery = groq`
  *[_type == "redirect" && defined(from) && defined(to)]{
    from,
    to,
    redirectType
  }
`;

export async function getAllRedirects(): Promise<AllRedirectsQueryResult> {
  return client.fetch<AllRedirectsQueryResult>(allRedirectsQuery);
}
