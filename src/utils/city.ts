/** Strip Romanian (and general Latin) diacritics for search matching. */
export function stripDiacritics(s: string): string {
  return s
    .replace(/ș|ş/gi, 's')
    .replace(/ț|ţ/gi, 't')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Normalize city for strict matching: trim + case-insensitive + aliases. */
const CITY_ALIASES: Record<string, string> = {
  cluj: 'cluj-napoca',
  'cluj napoca': 'cluj-napoca',
  'cluj-napoca': 'cluj-napoca',
};

export function normalizeCity(city: string): string {
  const t = stripDiacritics(city.trim().toLowerCase()).replace(/\s+/g, ' ');
  return CITY_ALIASES[t] ?? t;
}

/** Exact match on seeded/normalized names (Cluj ≈ Cluj-Napoca via alias map). */
export function citiesMatch(a: string, b: string): boolean {
  if (!a.trim() || !b.trim()) return false;
  return normalizeCity(a) === normalizeCity(b);
}

/** Major Romanian cities + Transylvania towns near Cluj (even if no jobs yet). */
export const ALL_CITIES: string[] = [
  'Aiud',
  'Alba Iulia',
  'Alexandria',
  'Arad',
  'Bacău',
  'Baia Mare',
  'Bistrița',
  'Blaj',
  'Botoșani',
  'Brașov',
  'Brăila',
  'București',
  'Buzău',
  'Călărași',
  'Câmpia Turzii',
  'Câmpulung',
  'Cluj-Napoca',
  'Constanța',
  'Craiova',
  'Dej',
  'Deva',
  'Drobeta-Turnu Severin',
  'Făgăraș',
  'Focșani',
  'Galați',
  'Gherla',
  'Giurgiu',
  'Hunedoara',
  'Huedin',
  'Iași',
  'Lugoj',
  'Mediaș',
  'Miercurea Ciuc',
  'Ocna Mureș',
  'Oradea',
  'Petroșani',
  'Piatra Neamț',
  'Pitești',
  'Ploiești',
  'Reghin',
  'Reșița',
  'Roman',
  'Satu Mare',
  'Sebeș',
  'Sfântu Gheorghe',
  'Sibiu',
  'Sighișoara',
  'Slatina',
  'Slobozia',
  'Suceava',
  'Târgoviște',
  'Târgu Jiu',
  'Târgu Mureș',
  'Timișoara',
  'Tulcea',
  'Turda',
  'Vaslui',
  'Zalău',
];
