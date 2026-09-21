/** Cover asset paths (files in public/assets). */
export const coverJobs = '/assets/cover-jobs.jpg';
export const coverWatch = '/assets/cover-watch.jpg';

/** Resolve known cover paths to public assets. */
export function resolveAsset(src?: string): string {
  if (!src) return coverJobs;
  if (src.includes('cover-watch')) return coverWatch;
  if (src.includes('cover-jobs')) return coverJobs;
  return src;
}
