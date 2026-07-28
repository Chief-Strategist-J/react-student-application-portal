import { describe, it, expect } from 'vitest';
import { normalizeKey, isEqualNormalized } from '../../utils/normalizeKey';

describe('normalizeKey Utility Unit Tests', () => {
  it('normalizes string cases: string, String, STRING, sTring are equal', () => {
    expect(normalizeKey('string')).toBe('string');
    expect(normalizeKey('String')).toBe('string');
    expect(normalizeKey('STRING')).toBe('string');
    expect(normalizeKey('sTring')).toBe('string');
  });

  it('isEqualNormalized returns true for case-insensitive string variations', () => {
    expect(isEqualNormalized('string', 'String')).toBe(true);
    expect(isEqualNormalized('STRING', 'sTring')).toBe(true);
    expect(isEqualNormalized('Pending', 'PENDING')).toBe(true);
    expect(isEqualNormalized('Approved', 'approved')).toBe(true);
  });
});
