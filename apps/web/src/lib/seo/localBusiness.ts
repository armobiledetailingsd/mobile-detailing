import type { HomepageQueryResult, SiteSettingsQueryResult } from '@/sanity.types';

const DAY_ABBREVIATIONS: Record<string, string> = {
  mon: 'Mo',
  tue: 'Tu',
  wed: 'We',
  thu: 'Th',
  fri: 'Fr',
  sat: 'Sa',
  sun: 'Su',
};

/**
 * Converts editor-entered hours like "Mon–Sat, 8am–5pm" into the Google/schema.org
 * shorthand for the `openingHours` property (e.g. "Mo-Sa 08:00-17:00"). Returns
 * undefined for any format it doesn't confidently recognize rather than emitting
 * malformed structured data.
 */
function parseOpeningHours(input: string | null | undefined): string[] | undefined {
  if (!input) return undefined;

  const normalized = input.replace(/[‒-―]/g, '-').trim();
  const [daysPart, timePart] = normalized.split(',').map((s) => s?.trim());
  if (!daysPart || !timePart) return undefined;

  const dayMatch = daysPart.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)$/);
  const singleDayMatch = daysPart.match(/^([A-Za-z]+)$/);
  const timeMatch = timePart.match(
    /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i,
  );
  if (!timeMatch) return undefined;

  const to24h = (hour: string | undefined, minute: string | undefined, meridiem: string | undefined) => {
    if (!hour || !meridiem) return undefined;
    let h = parseInt(hour, 10) % 12;
    if (meridiem.toLowerCase() === 'pm') h += 12;
    return `${String(h).padStart(2, '0')}:${minute ?? '00'}`;
  };
  const opens = to24h(timeMatch[1], timeMatch[2], timeMatch[3]);
  const closes = to24h(timeMatch[4], timeMatch[5], timeMatch[6]);
  if (!opens || !closes) return undefined;

  const abbreviate = (day: string | undefined) =>
    day ? DAY_ABBREVIATIONS[day.slice(0, 3).toLowerCase()] : undefined;

  let dayRange: string;
  if (dayMatch) {
    const start = abbreviate(dayMatch[1]);
    const end = abbreviate(dayMatch[2]);
    if (!start || !end) return undefined;
    dayRange = `${start}-${end}`;
  } else if (singleDayMatch) {
    const day = abbreviate(singleDayMatch[1]);
    if (!day) return undefined;
    dayRange = day;
  } else {
    return undefined;
  }

  return [`${dayRange} ${opens}-${closes}`];
}

type HomepageSection = NonNullable<NonNullable<HomepageQueryResult>['sections']>[number];

function findPhoneNumber(sections: HomepageSection[] | null | undefined): string | undefined {
  for (const section of sections ?? []) {
    if (section._type === 'finalCta' && section.phoneNumber) return section.phoneNumber;
    if (section._type === 'smsBanner' && section.phoneNumber) return section.phoneNumber;
  }
  return undefined;
}

function findCoverageTowns(sections: HomepageSection[] | null | undefined): string[] {
  for (const section of sections ?? []) {
    if (section._type === 'coverageSection' && section.towns) return section.towns;
  }
  return [];
}

export function buildLocalBusinessJsonLd({
  siteSettings,
  homepage,
  baseUrl,
}: {
  siteSettings: SiteSettingsQueryResult;
  homepage: HomepageQueryResult;
  baseUrl: string;
}) {
  const name = siteSettings?.organizationLegalName ?? siteSettings?.siteName;
  if (!name) return null;

  const towns = findCoverageTowns(homepage?.sections);

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDetailing',
    name,
    description: siteSettings?.siteDescription ?? undefined,
    url: siteSettings?.organizationUrl ?? baseUrl,
    telephone: findPhoneNumber(homepage?.sections),
    email: siteSettings?.contactEmail ?? undefined,
    openingHours: parseOpeningHours(siteSettings?.businessHours),
    sameAs: [siteSettings?.socialFacebookUrl, siteSettings?.socialInstagramUrl].filter(
      (url): url is string => Boolean(url),
    ),
    areaServed: towns.map((town) => ({ '@type': 'City', name: town })),
  };
}
