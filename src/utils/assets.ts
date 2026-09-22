/** Bundled cover paths under public/covers/ (photographic stock + collage). */
export const COVER_FILES = [
  'covers/construction.jpg',
  'covers/catering.jpg',
  'covers/warehouse.jpg',
  'covers/painting.jpg',
  'covers/moving.jpg',
  'covers/care.jpg',
  'covers/cleaning.jpg',
  'covers/hostess.jpg',
  'covers/gardening.jpg',
] as const;

const base = import.meta.env.BASE_URL;

function withBase(path: string): string {
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}

/** Default Home / jobs hero — warm jobs + pocket-watch collage */
export const coverJobs = withBase('covers/home.jpg');
export const coverWatch = withBase('covers/gardening.jpg');

/** Map thematic keys / legacy refs → local cover file. */
const LEGACY_MAP: Record<string, string> = {
  'cover-jobs': 'covers/home.jpg',
  'cover-home': 'covers/home.jpg',
  'cover-watch': 'covers/gardening.jpg',
  'construction.svg': 'covers/construction.jpg',
  'catering.svg': 'covers/catering.jpg',
  'warehouse.svg': 'covers/warehouse.jpg',
  'painting.svg': 'covers/painting.jpg',
  'moving.svg': 'covers/moving.jpg',
  'care.svg': 'covers/care.jpg',
  'cleaning.svg': 'covers/cleaning.jpg',
  'hostess.svg': 'covers/hostess.jpg',
  'gardening.svg': 'covers/gardening.jpg',
};

export function coverUrl(file: string): string {
  return withBase(file.replace(/^\//, ''));
}

/** Pick a stable cover by job id hash. */
export function coverForJobId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % COVER_FILES.length;
  return coverUrl(COVER_FILES[idx]);
}

/**
 * Resolve known cover paths / legacy refs to bundled covers (base-aware for GH Pages).
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
  for (const [key, file] of Object.entries(LEGACY_MAP)) {
    if (src.includes(key)) return coverUrl(file);
  }
  if (src.includes('covers/')) {
    const m = src.match(/covers\/[\w-]+\.(?:jpg|jpeg|webp|png|svg)/i);
    if (m) {
      const path = m[0].replace(/\.svg$/i, '.jpg');
      return coverUrl(path);
    }
  }
  // Absolute site path like /assets/... or covers/...
  if (src.startsWith('/') || src.startsWith('assets/') || src.startsWith('covers/')) {
    return withBase(src.replace(/\.svg$/i, '.jpg'));
  }
  return src;
}
