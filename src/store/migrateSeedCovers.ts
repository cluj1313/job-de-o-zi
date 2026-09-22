import type { User, Job, AppSettings, Message } from '../types';
import { seedUsers, seedJobs } from '../data/seed';
import {
  DEMO_ADMIN_NAME,
  DEMO_ADMIN_PHONE,
  DEMO_ADMIN_EMAIL,
} from '../data/seedUsersData';
import { seedSettings } from '../data/seedMeta';
import { hubLinksFromCiubiApps } from '../utils/hubMigrate';

const KEYS = {
  users: 'jdoz_users',
  jobs: 'jdoz_jobs',
  settings: 'jdoz_settings',
  messages: 'jdoz_messages',
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
        if (!j.photo && photo) {
          changed = true;
          return { ...j, photo };
        }
        if (j.photo && j.photo.includes('.svg')) {
          changed = true;
          return { ...j, photo: j.photo.replace(/\.svg$/i, '.jpg') };
        }
        return j;
      });
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

/** Sync seeded admin identity + hub Produse/Pitch thumbs for existing localStorage. */
export function migrateAdminIdentityInPlace() {
  try {
    const adminSeed = seedUsers.find((u) => u.id === 'admin');
    const rawUsers = localStorage.getItem(KEYS.users);
    if (rawUsers && adminSeed) {
      const users = JSON.parse(rawUsers) as User[];
      let changed = false;
      const next = users.map((u) => {
        if (u.id !== 'admin' && !u.isOwner) return u;
        const patch: User = {
          ...u,
          name: DEMO_ADMIN_NAME,
          phone: DEMO_ADMIN_PHONE,
          email: DEMO_ADMIN_EMAIL,
          description: adminSeed.description,
          isAdmin: true,
          isOwner: true,
        };
        if (
          u.name !== patch.name ||
          u.phone !== patch.phone ||
          u.email !== patch.email ||
          u.description !== patch.description
        ) {
          changed = true;
          return patch;
        }
        return u;
      });
      if (!next.some((u) => u.id === 'admin')) {
        next.unshift(adminSeed);
        changed = true;
      }
      if (changed) localStorage.setItem(KEYS.users, JSON.stringify(next));
    }

    const rawSettings = localStorage.getItem(KEYS.settings);
    if (rawSettings) {
      const cur = JSON.parse(rawSettings) as AppSettings;
      const seeded = hubLinksFromCiubiApps();
      const byId = new Map(seeded.map((h) => [h.id, h]));
      let hubChanged = false;
      const hub = (cur.hubLinks || []).map((h) => {
        const s =
          byId.get(h.id) ||
          seeded.find((x) => x.title.toLowerCase() === h.title.toLowerCase());
        if (!s) return h;
        const photo = s.photo || h.photo;
        const description = s.description || h.description;
        if (photo !== h.photo || description !== h.description) {
          hubChanged = true;
          return { ...h, photo, description };
        }
        return h;
      });
      for (const need of ['produse', 'pitch']) {
        if (!hub.some((h) => h.id === need)) {
          const s = byId.get(need);
          if (s) {
            hub.push(s);
            hubChanged = true;
          }
        }
      }
      const ownerPresentation = seedSettings.ownerPresentation;
      const ownerChanged = !cur.ownerPresentation?.includes('Cioban Iosif Gabriel');
      if (hubChanged || ownerChanged) {
        localStorage.setItem(
          KEYS.settings,
          JSON.stringify({
            ...cur,
            hubLinks: hub,
            ownerPresentation: ownerChanged ? ownerPresentation : cur.ownerPresentation,
          }),
        );
      }
    }

    const rawMsg = localStorage.getItem(KEYS.messages);
    if (rawMsg) {
      const msgs = JSON.parse(rawMsg) as Message[];
      let changed = false;
      const next = msgs.map((m) => {
        if (m.fromId === 'admin' && m.fromName !== DEMO_ADMIN_NAME) {
          changed = true;
          return { ...m, fromName: DEMO_ADMIN_NAME };
        }
        return m;
      });
      if (changed) localStorage.setItem(KEYS.messages, JSON.stringify(next));
    }
  } catch {
    /* ignore */
  }
}
