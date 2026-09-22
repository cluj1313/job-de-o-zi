/** Bundled cover paths under public/covers/ (photographic JPG downloaded at build). */
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

/** Default Home hero — warm collage / lifestyle photo */
export const coverJobs = withBase('covers/home.jpg');
export const coverWatch = withBase('covers/gardening.jpg');

const LEGACY_MAP: Record<string, string> = {
  'cover-jobs': 'covers/home.jpg',
  'cover-home': 'covers/home.jpg',
  'cover-watch': 'covers/gardening.jpg',
};

export function coverUrl(file: string): string {
  return withBase(file.replace(/^\//, ''));
}

export function coverForJobId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return coverUrl(COVER_FILES[Math.abs(h) % COVER_FILES.length]);
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
  for (const [key, file] of Object.entries(LEGACY_MAP)) {
    if (src.includes(key)) return coverUrl(file);
  }
  if (src.includes('covers/')) {
    const m = src.match(/covers\/[\w-]+\.(?:jpg|jpeg|webp|png|svg)/i);
    if (m) return coverUrl(m[0].replace(/\.svg$/i, '.jpg'));
  }
  if (src.startsWith('/') || src.startsWith('assets/') || src.startsWith('covers/')) {
    return withBase(src.replace(/\.svg$/i, '.jpg'));
  }
  return src;
}
