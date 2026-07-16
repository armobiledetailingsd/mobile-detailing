import { describe, expect, it } from 'vitest';
import { CORE_ZIPS, PACKAGES, isServiceableZip, resolvePackageSlug } from './packages';

describe('isServiceableZip', () => {
  it('accepts a known core ZIP', () => {
    const goodZip = [...CORE_ZIPS][0]!;
    expect(isServiceableZip(goodZip)).toBe(true);
  });

  it('accepts North County San Diego ZIPs from the coverage area', () => {
    // Encinitas, Carlsbad, Oceanside, Escondido, Fallbrook
    for (const zip of ['92024', '92008', '92054', '92025', '92028']) {
      expect(isServiceableZip(zip)).toBe(true);
    }
  });

  it('rejects an unserviceable ZIP', () => {
    expect(isServiceableZip('00000')).toBe(false);
  });

  it('rejects the old Austin placeholder ZIPs', () => {
    expect(isServiceableZip('78701')).toBe(false);
  });
});

describe('PACKAGES', () => {
  it('lists the Bronze, Silver, and Gold rate card', () => {
    expect(PACKAGES.map((p) => p.slug)).toEqual(['bronze', 'silver', 'gold']);
    const bronze = PACKAGES[0]!;
    expect(bronze).toEqual({
      slug: 'bronze',
      name: 'Bronze',
      priceSedan: 99.99,
      priceTruckSuv: 120,
      duration: '~1.5 hr',
    });
  });
});

describe('resolvePackageSlug', () => {
  it('resolves known names case-insensitively with whitespace trimmed', () => {
    expect(resolvePackageSlug('Bronze')).toBe('bronze');
    expect(resolvePackageSlug(' silver ')).toBe('silver');
    expect(resolvePackageSlug('GOLD')).toBe('gold');
  });

  it('returns null for unknown, empty, or missing names', () => {
    expect(resolvePackageSlug('Full Detail')).toBeNull();
    expect(resolvePackageSlug('')).toBeNull();
    expect(resolvePackageSlug(null)).toBeNull();
    expect(resolvePackageSlug(undefined)).toBeNull();
  });
});
