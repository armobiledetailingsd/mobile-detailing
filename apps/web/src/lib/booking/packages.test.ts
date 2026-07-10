import { describe, expect, it } from 'vitest';
import { CORE_ZIPS, isServiceableZip } from './packages';

describe('isServiceableZip', () => {
  it('accepts a known core ZIP', () => {
    const goodZip = [...CORE_ZIPS][0]!;
    expect(isServiceableZip(goodZip)).toBe(true);
  });

  it('rejects an unserviceable ZIP', () => {
    expect(isServiceableZip('00000')).toBe(false);
  });
});
