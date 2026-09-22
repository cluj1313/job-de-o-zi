import { photoHome } from '../assets/photo_home';

/** Photographic stock covers (Unsplash JPG) — not SVG drawings. */
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photoConstruction = U('photo-1504307651254-35680f356dfd');
export const photoCatering = U('photo-1414235077428-338989a2e8c0');
export const photoWarehouse = U('photo-1586528116311-ad8dd3c8310d');
export const photoPainting = U('photo-1562259949-e8e7689d7828');
export const photoMoving = U('photo-1600518464441-9154a4dea21b');
export const photoCare = U('photo-1576765608535-5f04d1e3f289');
export const photoCleaning = U('photo-1581578731548-c64695cc6952');
export const photoHostess = U('photo-1559339352-11d035aa65de');
export const photoGardening = U('photo-1416879595882-3373a0480b5b');
export { photoHome };

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

export const coverJobs = photoHome;
export const coverWatch = photoGardening;

const PHOTO_BY_KEY: Record<string, string> = {
  home: photoHome,
  construction: photoConstruction,
  catering: photoCatering,
  warehouse: photoWarehouse,
  painting: photoPainting,
  moving: photoMoving,
  care: photoCare,
  cleaning: photoCleaning,
  hostess: photoHostess,
  gardening: photoGardening,
};

const KEY_ALIASES: Record<string, string> = {
  'cover-jobs': 'home',
  'cover-home': 'home',
  'cover-watch': 'gardening',
};

function photoForKey(key: string): string | undefined {
  const k = KEY_ALIASES[key] || key;
  return PHOTO_BY_KEY[k];
}

export function coverForJobId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return COVER_URLS[Math.abs(h) % COVER_URLS.length];
}

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
  const m = src.match(/(?:covers\/)?([\w-]+)\.(?:jpg|jpeg|webp|png|svg)/i);
  if (m) {
    const hit = photoForKey(m[1].toLowerCase());
    if (hit) return hit;
  }
  for (const key of Object.keys({ ...KEY_ALIASES, ...PHOTO_BY_KEY })) {
    if (src.includes(key)) {
      const hit = photoForKey(key);
      if (hit) return hit;
    }
  }
  return coverJobs;
}

export function coverUrl(file: string): string {
  const m = file.match(/([\w-]+)\./);
  if (m) {
    const hit = photoForKey(m[1]);
    if (hit) return hit;
  }
  return coverJobs;
}
