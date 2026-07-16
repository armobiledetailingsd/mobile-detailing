import { groq } from 'next-sanity';
import { sanityFetch } from '../live';
import type {
  FooterNavigationQueryResult,
  HeaderNavigationQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity.types';

// Singleton document IDs — mirror apps/studio/structure/index.ts.
export const SITE_SETTINGS_ID = 'siteSettings';
export const HEADER_NAVIGATION_ID = 'headerNavigation';
export const FOOTER_NAVIGATION_ID = 'footerNavigation';

const linkProjection = groq`{
  label,
  linkType,
  openInNewTab,
  "href": select(
    linkType == "external" => externalUrl,
    linkType == "internal" => "/" + internalReference->slug.current,
    null
  )
}`;

const siteSettingsQuery = groq`*[_id == $id && _type == "siteSettings"][0]{
  _id,
  _type,
  siteName,
  siteDescription,
  defaultOpenGraphImage,
  organizationLegalName,
  organizationUrl,
  blogEnabled,
  calendlyUrlBronze,
  calendlyUrlSilver,
  calendlyUrlGold,
  stripeDepositLink
}`;

const headerNavigationQuery = groq`*[_id == $id && _type == "headerNavigation"][0]{
  _id,
  _type,
  title,
  links[]${linkProjection}
}`;

const footerNavigationQuery = groq`*[_id == $id && _type == "footerNavigation"][0]{
  _id,
  _type,
  title,
  columns[]{
    _key,
    heading,
    links[]${linkProjection}
  },
  copyright
}`;

export async function getSiteSettings(): Promise<SiteSettingsQueryResult> {
  const { data } = await sanityFetch({
    query: siteSettingsQuery,
    params: { id: SITE_SETTINGS_ID },
    tags: ['siteSettings'],
  });
  return data;
}

export async function getHeaderNavigation(): Promise<HeaderNavigationQueryResult> {
  const { data } = await sanityFetch({
    query: headerNavigationQuery,
    params: { id: HEADER_NAVIGATION_ID },
    tags: ['headerNavigation'],
  });
  return data;
}

export async function getFooterNavigation(): Promise<FooterNavigationQueryResult> {
  const { data } = await sanityFetch({
    query: footerNavigationQuery,
    params: { id: FOOTER_NAVIGATION_ID },
    tags: ['footerNavigation'],
  });
  return data;
}
