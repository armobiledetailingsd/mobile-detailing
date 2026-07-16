import { describe, expect, it } from 'vitest';
import { CORE_ZIPS, isServiceableZip } from './packages';

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
