/** Bundled cover paths under public/covers/ (warm labor mockups). */
export const COVER_FILES = [
  'covers/construction.svg',
  'covers/catering.svg',
  'covers/warehouse.svg',
  'covers/painting.svg',
  'covers/moving.svg',
  'covers/care.svg',
  'covers/cleaning.svg',
  'covers/hostess.svg',
  'covers/gardening.svg',
] as const;

const base = import.meta.env.BASE_URL;

function withBase(path: string): string {
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}

/** Default Home / jobs hero — construction collage */
export const coverJobs = withBase('covers/construction.svg');
export const coverWatch = withBase('covers/gardening.svg');

/** Map thematic keys / legacy refs → local cover file. */
const LEGACY_MAP: Record<string, string> = {
  'cover-jobs': 'covers/construction.svg',
  'cover-home': 'covers/construction.svg',
  'cover-watch': 'covers/gardening.svg',
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
    const m = src.match(/covers\/[\w-]+\.svg/);
    if (m) return coverUrl(m[0]);
  }
  // Absolute site path like /assets/... or covers/...
  if (src.startsWith('/') || src.startsWith('assets/') || src.startsWith('covers/')) {
    return withBase(src);
  }
  return src;
}
