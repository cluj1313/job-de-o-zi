import { useSyncExternalStore, useCallback } from 'react';
import type { User, Job, Review, Message, AppSettings, Role } from '../types';
import {
  seedUsers,
  seedJobs,
  seedReviews,
  seedMessages,
  seedSettings,
} from '../data/seed';
import { migrateHubLinks } from '../utils/hubMigrate';
import { migrateSeedCoversInPlace, migrateAdminIdentityInPlace } from './migrateSeedCovers';
import {
  buildMessage,
  withHiddenFor,
  withDelivered,
  withRead,
  type SendMessageInput,
} from '../utils/messagesApi';

const KEYS = {
  users: 'jdoz_users',
  jobs: 'jdoz_jobs',
  reviews: 'jdoz_reviews',
  messages: 'jdoz_messages',
  favorites: 'jdoz_favorites',
  session: 'jdoz_session',
  settings: 'jdoz_settings',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function migrateSettingsInPlace() {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return;
    const cur = JSON.parse(raw) as AppSettings;
    const migrated = migrateHubLinks(cur.hubLinks);
    const before = JSON.stringify(cur.hubLinks ?? []);
    const after = JSON.stringify(migrated);
    if (before !== after) {
      const next: AppSettings = { ...cur, hubLinks: migrated };
      localStorage.setItem(KEYS.settings, JSON.stringify(next));
    }
  } catch {
    /* ignore corrupt settings */
  }
}

function ensureSeeded() {
  if (!localStorage.getItem(KEYS.users)) save(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.jobs)) save(KEYS.jobs, seedJobs);
  if (!localStorage.getItem(KEYS.reviews)) save(KEYS.reviews, seedReviews);
  if (!localStorage.getItem(KEYS.messages)) save(KEYS.messages, seedMessages);
  if (!localStorage.getItem(KEYS.favorites)) save(KEYS.favorites, [] as string[]);
  if (!localStorage.getItem(KEYS.settings)) save(KEYS.settings, seedSettings);
  migrateSettingsInPlace();
  migrateSeedCoversInPlace();
  migrateAdminIdentityInPlace();
}

ensureSeeded();

function loadSettings(): AppSettings {
  const cur = load<AppSettings>(KEYS.settings, seedSettings);
  const migrated = migrateHubLinks(cur.hubLinks);
  const textSize = cur.textSize === 'sm' || cur.textSize === 'lg' ? cur.textSize : 'md';
  const next: AppSettings = { ...cur, hubLinks: migrated, textSize };
  if (
    JSON.stringify(cur.hubLinks ?? []) !== JSON.stringify(migrated) ||
    cur.textSize !== textSize
  ) {
    localStorage.setItem(KEYS.settings, JSON.stringify(next));
  }
  return next;
}

function getSnapshot() {
  return {
    users: load<User[]>(KEYS.users, seedUsers),
    jobs: load<Job[]>(KEYS.jobs, seedJobs),
    reviews: load<Review[]>(KEYS.reviews, seedReviews),
    messages: load<Message[]>(KEYS.messages, seedMessages),
    favorites: load<string[]>(KEYS.favorites, []),
    sessionId: load<string | null>(KEYS.session, null),
    settings: loadSettings(),
  };
}

let cached = getSnapshot();
function getCachedSnapshot() {
  const next = getSnapshot();
  // shallow compare keys by JSON for simplicity
  if (JSON.stringify(next) !== JSON.stringify(cached)) {
    cached = next;
  }
  return cached;
}

export function useStore() {
  const state = useSyncExternalStore(subscribe, getCachedSnapshot, getCachedSnapshot);

  const currentUser = state.users.find((u) => u.id === state.sessionId) ?? null;

  const login = useCallback((phone: string, password: string): string | null => {
    const users = load<User[]>(KEYS.users, seedUsers);
    const digits = phone.replace(/[.\s-]/g, '');
    const user = users.find(
      (u) => u.password === password && (u.phone === phone || u.phone === digits || u.phone.replace(/[.\s-]/g, '') === digits),
    );
    if (!user) return 'Telefon sau parolă greșită';
    if (user.blocked) return 'Contul este blocat';
    save(KEYS.session, user.id);
    return null;
  }, []);

  const register = useCallback(
    (data: {
      name: string;
      phone: string;
      password: string;
      city: string;
      role: Role;
    }): string | null => {
      const users = load<User[]>(KEYS.users, seedUsers);
      if (users.some((u) => u.phone === data.phone)) {
        return 'Numărul de telefon există deja';
      }
      const user: User = {
        id: 'u' + Date.now(),
        name: data.name,
        phone: data.phone,
        password: data.password,
        city: data.city,
        role: data.role,
        rating: 0,
        ratingCount: 0,
        description: '',
      };
      save(KEYS.users, [...users, user]);
      save(KEYS.session, user.id);
      return null;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(KEYS.session);
    // Also write explicit null so any stale non-JSON session values are overwritten
    try {
      localStorage.setItem(KEYS.session, JSON.stringify(null));
      localStorage.removeItem(KEYS.session);
    } catch {
      /* ignore */
    }
    cached = getSnapshot();
    listeners.forEach((l) => l());
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    const users = load<User[]>(KEYS.users, seedUsers).map((u) =>
      u.id === id ? { ...u, ...patch } : u,
    );
    save(KEYS.users, users);
  }, []);

  const deleteUser = useCallback((id: string) => {
    save(
      KEYS.users,
      load<User[]>(KEYS.users, seedUsers).filter((u) => u.id !== id),
    );
    save(
      KEYS.jobs,
      load<Job[]>(KEYS.jobs, seedJobs).filter((j) => j.userId !== id),
    );
  }, []);

  const toggleFavorite = useCallback((jobId: string) => {
    const favs = load<string[]>(KEYS.favorites, []);
    const next = favs.includes(jobId) ? favs.filter((f) => f !== jobId) : [...favs, jobId];
    save(KEYS.favorites, next);
  }, []);

  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt'>) => {
    const full: Job = {
      ...job,
      id: 'j' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    save(KEYS.jobs, [full, ...load<Job[]>(KEYS.jobs, seedJobs)]);
    return full;
  }, []);

  const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
    const full: Review = {
      ...review,
      id: 'r' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const reviews = [full, ...load<Review[]>(KEYS.reviews, seedReviews)];
    save(KEYS.reviews, reviews);
    // update target rating
    const targetReviews = reviews.filter((r) => r.targetUserId === review.targetUserId);
    const avg =
      targetReviews.reduce((s, r) => s + r.rating, 0) / (targetReviews.length || 1);
    updateUser(review.targetUserId, {
      rating: Math.round(avg * 10) / 10,
      ratingCount: targetReviews.length,
    });
  }, [updateUser]);

  const replyReview = useCallback((reviewId: string, reply: string) => {
    const reviews = load<Review[]>(KEYS.reviews, seedReviews).map((r) =>
      r.id === reviewId ? { ...r, reply } : r,
    );
    save(KEYS.reviews, reviews);
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    save(
      KEYS.reviews,
      load<Review[]>(KEYS.reviews, seedReviews).filter((r) => r.id !== reviewId),
    );
  }, []);

  const sendMessage = useCallback((msg: SendMessageInput) => {
    const full = buildMessage(msg);
    save(KEYS.messages, [full, ...load<Message[]>(KEYS.messages, seedMessages)]);
    return full;
  }, []);

  /** Hard-delete — admin/owner can remove any message from middle of a thread */
  const deleteMessage = useCallback((messageId: string) => {
    save(
      KEYS.messages,
      load<Message[]>(KEYS.messages, seedMessages).filter((m) => m.id !== messageId),
    );
  }, []);

  /** Recipient leave: hide only on their side; admin still sees the thread */
  const hideMessageForUser = useCallback((messageId: string, userId: string) => {
    const next = load<Message[]>(KEYS.messages, seedMessages).map((m) =>
      m.id === messageId ? withHiddenFor(m, userId) : m,
    );
    save(KEYS.messages, next);
  }, []);

  const hideMessagesForUser = useCallback((messageIds: string[], userId: string) => {
    if (!messageIds.length) return;
    const idSet = new Set(messageIds);
    const next = load<Message[]>(KEYS.messages, seedMessages).map((m) =>
      idSet.has(m.id) ? withHiddenFor(m, userId) : m,
    );
    save(KEYS.messages, next);
  }, []);

  /** Mark delivered when recipient's inbox lists the message */
  const markMessagesDelivered = useCallback((messageIds: string[]) => {
    if (!messageIds.length) return;
    const idSet = new Set(messageIds);
    const now = new Date().toISOString();
    let changed = false;
    const next = load<Message[]>(KEYS.messages, seedMessages).map((m) => {
      if (!idSet.has(m.id) || m.deliveredAt) return m;
      changed = true;
      return withDelivered(m, now);
    });
    if (changed) save(KEYS.messages, next);
  }, []);

  /** Mark read when recipient opens the thread (Citit — admin-visible) */
  const markMessagesRead = useCallback((messageIds: string[]) => {
    if (!messageIds.length) return;
    const idSet = new Set(messageIds);
    const now = new Date().toISOString();
    let changed = false;
    const next = load<Message[]>(KEYS.messages, seedMessages).map((m) => {
      if (!idSet.has(m.id) || m.readAt) return m;
      changed = true;
      return withRead(m, now);
    });
    if (changed) save(KEYS.messages, next);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    const cur = load<AppSettings>(KEYS.settings, seedSettings);
    save(KEYS.settings, { ...cur, ...patch });
  }, []);

  const getUser = useCallback(
    (id: string) => state.users.find((u) => u.id === id),
    [state.users],
  );

  return {
    ...state,
    currentUser,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
    toggleFavorite,
    addJob,
    addReview,
    replyReview,
    deleteReview,
    sendMessage,
    deleteMessage,
    hideMessageForUser,
    hideMessagesForUser,
    markMessagesDelivered,
    markMessagesRead,
    updateSettings,
    getUser,
  };
}

export function resetDemoData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  ensureSeeded();
  listeners.forEach((l) => l());
}
