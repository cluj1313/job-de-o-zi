import type { HubLink } from '../types';
import { CIUBI_APPS } from '../data/ciubiApps';

/** True if link looks like a GitHub source/code card (not a Pages app). */
export function isGithubSourceLink(link: { title?: string; url?: string }): boolean {
  const title = (link.title || '').trim().toLowerCase();
  const url = (link.url || '').trim().toLowerCase();

  if (title === 'github' || title.includes('github source') || title.includes('cod surs')) {
    return true;
  }
  if (!url.includes('github.com')) return false;

  // github.io Pages apps are OK; raw github.com repo/source is not
  if (url.includes('github.io')) return false;

  // Strip repo source links (esp. this app's repo without Pages)
  if (
    /github\.com\/[^/]+\/[^/]+(?:\/(?:tree|blob|commits|issues|pulls|actions|settings))?/i.test(
      url,
    )
  ) {
    return true;
  }
  return url.includes('github.com');
}

export function hubLinksFromCiubiApps(): HubLink[] {
  return CIUBI_APPS.map((a) => ({
    id: a.id,
    title: a.title,
    url: a.url,
    description: a.description,
    photo: a.thumb || undefined,
  }));
}

/**
 * Migrate stored hub links: drop GitHub source cards; if leftovers are only
 * pitch + github (or empty), replace with full CIUBI_APPS list.
 */
export function migrateHubLinks(links: HubLink[] | undefined | null): HubLink[] {
  const raw = Array.isArray(links) ? links : [];
  const cleaned = raw.filter((l) => !isGithubSourceLink(l));

  if (cleaned.length === 0) {
    return hubLinksFromCiubiApps();
  }

  const nonPitch = cleaned.filter((l) => {
    const id = (l.id || '').toLowerCase();
    const title = (l.title || '').toLowerCase();
    const url = (l.url || '').toLowerCase();
    const isPitch =
      id === 'pitch' ||
      title.includes('pitch') ||
      url.includes('pitch-sponsor');
    const isSelf =
      title.includes('job de o zi') ||
      url.includes('job-de-o-zi');
    return !isPitch && !isSelf;
  });

  // Legacy: only pitch (and previously github which we stripped) → full seed
  if (nonPitch.length === 0 && cleaned.length <= 2) {
    return hubLinksFromCiubiApps();
  }

  return cleaned.filter((l) => {
    const title = (l.title || '').toLowerCase();
    const url = (l.url || '').toLowerCase();
    return !(title.includes('job de o zi') || /job-de-o-zi\/?(\?|$|#)/.test(url));
  });
}
