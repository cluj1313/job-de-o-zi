import {
  PHOTO_BY_KEY,
  photoHome,
  photoGardening,
  photoConstruction,
  photoCatering,
  photoWarehouse,
  photoPainting,
  photoMoving,
  photoCare,
  photoCleaning,
  photoHostess,
} from '../assets/photoCovers';

/** Ordered thematic covers (photographic data URLs). */
export const COVER_URLS = [
  photoConstruction,
  photoCatering,
  photoWarehouse,
  photoPainting,
  photoMoving,
  photoCare,
  photoCleaning,
  photoHostess,
  photoGardening,
] as const;

/** Default Home / jobs hero — warm jobs + pocket-watch collage */
export const coverJobs = photoHome;
export const coverWatch = photoGardening;

const KEY_ALIASES: Record<string, string> = {
  'cover-jobs': 'home',
  'cover-home': 'home',
  'cover-watch': 'gardening',
  construction: 'construction',
  catering: 'catering',
  warehouse: 'warehouse',
  painting: 'painting',
  moving: 'moving',
  care: 'care',
  cleaning: 'cleaning',
  hostess: 'hostess',
  gardening: 'gardening',
  home: 'home',
};

function photoForKey(key: string): string | undefined {
  const k = KEY_ALIASES[key] || key;
  return PHOTO_BY_KEY[k];
}

/** Pick a stable cover by job id hash. */
export function coverForJobId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % COVER_URLS.length;
  return COVER_URLS[idx];
}

/**
 * Resolve known cover paths / legacy refs to photographic data URLs.
 */
export function resolveAsset(src?: string): string {
  if (!src) return coverJobs;
  if (
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('http://') ||
    src.startsWith('https://')
  ) {
    return src;
  }
  // covers/foo.jpg|svg or bare foo
  const m = src.match(/(?:covers\/)?([\w-]+)\.(?:jpg|jpeg|webp|png|svg)/i);
  if (m) {
    const hit = photoForKey(m[1].toLowerCase());
    if (hit) return hit;
  }
  for (const key of Object.keys(KEY_ALIASES)) {
    if (src.includes(key)) {
      const hit = photoForKey(key);
      if (hit) return hit;
    }
  }
  return coverJobs;
}

/** @deprecated path helper kept for any callers expecting site-relative URLs */
export function coverUrl(file: string): string {
  const m = file.match(/([\w-]+)\./);
  if (m) {
    const hit = photoForKey(m[1]);
    if (hit) return hit;
  }
  return coverJobs;
}
