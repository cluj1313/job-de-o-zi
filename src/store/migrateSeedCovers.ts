import type { User, Job } from '../types';
import { seedUsers, seedJobs } from '../data/seed';

const KEYS = {
  users: 'jdoz_users',
  jobs: 'jdoz_jobs',
} as const;

/** Refresh demo job/user cover photos from seed (keeps user-created jobs). */
export function migrateSeedCoversInPlace() {
  try {
    const seedPhoto = new Map(seedJobs.map((j) => [j.id, j.photo]));
    const seedCover = new Map(seedUsers.map((u) => [u.id, u.cover]));

    const rawJobs = localStorage.getItem(KEYS.jobs);
    if (rawJobs) {
      const jobs = JSON.parse(rawJobs) as Job[];
      let changed = false;
      const next = jobs.map((j) => {
        const photo = seedPhoto.get(j.id);
        if (photo && j.photo !== photo) {
          changed = true;
          return { ...j, photo };
        }
        // Missing photo on any job → assign seed-style default by id if known, else leave
        if (!j.photo && photo) {
          changed = true;
          return { ...j, photo };
        }
        return j;
      });
      // Ensure all seed jobs exist (re-add missing demo cards)
      for (const sj of seedJobs) {
        if (!next.some((j) => j.id === sj.id)) {
          next.push(sj);
          changed = true;
        }
      }
      if (changed) localStorage.setItem(KEYS.jobs, JSON.stringify(next));
    }

    const rawUsers = localStorage.getItem(KEYS.users);
    if (rawUsers) {
      const users = JSON.parse(rawUsers) as User[];
      let changed = false;
      const next = users.map((u) => {
        const cover = seedCover.get(u.id);
        if (cover && u.cover !== cover) {
          changed = true;
          return { ...u, cover };
        }
        return u;
      });
      if (changed) localStorage.setItem(KEYS.users, JSON.stringify(next));
    }
  } catch {
    /* ignore */
  }
}
