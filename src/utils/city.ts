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

/** Major Romanian cities for the city picker (scrollable full list). */
export const ALL_CITIES: string[] = [
  'Alba Iulia',
  'Alexandria',
  'Arad',
  'Bacău',
  'Baia Mare',
  'Bistrița',
  'Botoșani',
  'Brașov',
  'Brăila',
  'București',
  'Buzău',
  'Călărași',
  'Cluj-Napoca',
  'Constanța',
  'Craiova',
  'Deva',
  'Drobeta-Turnu Severin',
  'Focșani',
  'Galați',
  'Giurgiu',
  'Iași',
  'Miercurea Ciuc',
  'Oradea',
  'Piatra Neamț',
  'Pitești',
  'Ploiești',
  'Reșița',
  'Roman',
  'Satu Mare',
  'Sfântu Gheorghe',
  'Sibiu',
  'Slatina',
  'Slobozia',
  'Suceava',
  'Târgoviște',
  'Târgu Jiu',
  'Târgu Mureș',
  'Timișoara',
  'Tulcea',
  'Vaslui',
  'Zalău',
];
