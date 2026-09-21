import { coverJobs } from './coverJobs';
import { coverWatch } from './coverWatch';

export { coverJobs, coverWatch };

/** Resolve known cover paths / legacy refs to embedded covers. */
export function resolveAsset(src?: string): string {
  if (!src) return coverJobs;
  if (src.startsWith('data:')) return src;
  if (src.includes('cover-watch')) return coverWatch;
  if (src.includes('cover-jobs')) return coverJobs;
  return src;
}
