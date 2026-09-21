const base = import.meta.env.BASE_URL;

/** Home / jobs cover — warm collage (jobs + pocket watch) */
export const coverJobs = `${base}assets/cover-jobs.jpg`;
export const coverWatch = `${base}assets/cover-watch.jpg`;

/** Resolve known cover paths / legacy refs to covers. */
export function resolveAsset(src?: string): string {
  if (!src) return coverJobs;
  if (src.startsWith('data:')) return src;
  if (src.includes('cover-watch')) return coverWatch;
  if (src.includes('cover-jobs') || src.includes('cover-home')) return coverJobs;
  return src;
}
