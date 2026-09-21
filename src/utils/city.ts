/** Normalize city for strict matching: trim + case-insensitive. */
const CITY_ALIASES: Record<string, string> = {
  cluj: 'cluj-napoca',
  'cluj napoca': 'cluj-napoca',
  'cluj-napoca': 'cluj-napoca',
};

export function normalizeCity(city: string): string {
  const t = city.trim().toLowerCase().replace(/\s+/g, ' ');
  return CITY_ALIASES[t] ?? t;
}

/** Exact match on seeded/normalized names (Cluj ≈ Cluj-Napoca via alias map). */
export function citiesMatch(a: string, b: string): boolean {
  if (!a.trim() || !b.trim()) return false;
  return normalizeCity(a) === normalizeCity(b);
}
