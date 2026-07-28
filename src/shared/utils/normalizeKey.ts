export function normalizeKey(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val).trim().toLowerCase();
}

export function isEqualNormalized(valA: unknown, valB: unknown): boolean {
  return normalizeKey(valA) === normalizeKey(valB);
}
