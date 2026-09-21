import { coverJobs, coverWatch } from '../assets/covers';

/** Resolve known cover paths to embedded assets (works without static file hosting). */
export function resolveAsset(src?: string): string {
  if (!src) return coverJobs;
  if (src.includes('cover-watch')) return coverWatch;
  if (src.includes('cover-jobs')) return coverJobs;
  return src;
}

export { coverJobs, coverWatch };
