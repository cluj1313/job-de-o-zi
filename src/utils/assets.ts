const base = import.meta.env.BASE_URL;

export const coverJobs = `${base}assets/cover-jobs.svg`;
export const coverWatch = `${base}assets/cover-watch.svg`;

/** Resolve known cover paths / legacy refs to covers. */
export function resolveAsset(src?: string): string {
  if (!src) return coverJobs;
  if (src.startsWith('data:')) return src;
  if (src.includes('cover-watch')) return coverWatch;
  if (src.includes('cover-jobs')) return coverJobs;
  return src;
}
