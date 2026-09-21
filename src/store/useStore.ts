import { useSyncExternalStore, useCallback } from 'react';
import type { User, Job, Review, Message, AppSettings, Role } from '../types';
import {
  seedUsers,
  seedJobs,
  seedReviews,
  seedMessages,
  seedSettings,
} from '../data/seed';

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
  return () => { listeners.delete(cb); };
}

function ensureSeeded() {
  if (!localStorage.getItem(KEYS.users)) save(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.jobs)) save(KEYS.jobs, seedJobs);
  if (!localStorage.getItem(KEYS.reviews)) save(KEYS.reviews, seedReviews);
  if (!localStorage.getItem(KEYS.messages)) save(KEYS.messages, seedMessages);
  if (!localStorage.getItem(KEYS.favorites)) save(KEYS.favorites, [] as string[]);
  if (!localStorage.getItem(KEYS.settings)) save(KEYS.settings, seedSettings);
}

ensureSeeded();

function getSnapshot() {
  return {
    users: load<User[]>(KEYS.users, seedUsers),
    jobs: load<Job[]>(KEYS.jobs, seedJobs),
    reviews: load<Review[]>(KEYS.reviews, seedReviews),
    messages: load<Message[]>(KEYS.messages, seedMessages),
    favorites: load<string[]>(KEYS.favorites, []),
    sessionId: load<string | null>(KEYS.session, null),
    settings: load<AppSettings>(KEYS.settings, seedSettings),
  };
}

let cached = getSnapshot();
function getCachedSnapshot() {
  const next = getSnapshot();
  if (JSON.stringify(next) !== JSON.stringify(cached)) cached = next;
  return cached;
}

export function useStore() {
  const state = useSyncExternalStore(subscribe, getCachedSnapshot, getCachedSnapshot);
  const currentUser = state.users.find((u) => u.id === state.sessionId) ?? null;

  const login = useCallback((phone: string, password: string): string | null => {
    const users = load<User[]>(KEYS.users, seedUsers);
    const user = users.find((u) => u.phone === phone && u.password === password);
    if (!user) return 'Telefon sau parolă greșită';
    if (user.blocked) return 'Contul este blocat';
    save(KEYS.session, user.id);
    return null;
  }, []);

  const register = useCallback((data: { name: string; phone: string; password: string; city: string; role: Role }): string | null => {
    const users = load<User[]>(KEYS.users, seedUsers);
    if (users.some((u) => u.phone === data.phone)) return 'Numărul de telefon există deja';
    const user: User = {
      id: 'u' + Date.now(), name: data.name, phone: data.phone, password: data.password,
      city: data.city, role: data.role, rating: 0, ratingCount: 0, description: '',
    };
    save(KEYS.users, [...users, user]);
    save(KEYS.session, user.id);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEYS.session);
    listeners.forEach((l) => l());
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    save(KEYS.users, load<User[]>(KEYS.users, seedUsers).map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const deleteUser = useCallback((id: string) => {
    save(KEYS.users, load<User[]>(KEYS.users, seedUsers).filter((u) => u.id !== id));
    save(KEYS.jobs, load<Job[]>(KEYS.jobs, seedJobs).filter((j) => j.userId !== id));
  }, []);

  const toggleFavorite = useCallback((jobId: string) => {
    const favs = load<string[]>(KEYS.favorites, []);
    save(KEYS.favorites, favs.includes(jobId) ? favs.filter((f) => f !== jobId) : [...favs, jobId]);
  }, []);

  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt'>) => {
    const full: Job = { ...job, id: 'j' + Date.now(), createdAt: new Date().toISOString() };
    save(KEYS.jobs, [full, ...load<Job[]>(KEYS.jobs, seedJobs)]);
    return full;
  }, []);

  const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
    const full: Review = { ...review, id: 'r' + Date.now(), createdAt: new Date().toISOString() };
    const reviews = [full, ...load<Review[]>(KEYS.reviews, seedReviews)];
    save(KEYS.reviews, reviews);
    const targetReviews = reviews.filter((r) => r.targetUserId === review.targetUserId);
    const avg = targetReviews.reduce((s, r) => s + r.rating, 0) / (targetReviews.length || 1);
    updateUser(review.targetUserId, { rating: Math.round(avg * 10) / 10, ratingCount: targetReviews.length });
  }, [updateUser]);

  const replyReview = useCallback((reviewId: string, reply: string) => {
    save(KEYS.reviews, load<Review[]>(KEYS.reviews, seedReviews).map((r) => (r.id === reviewId ? { ...r, reply } : r)));
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    save(KEYS.reviews, load<Review[]>(KEYS.reviews, seedReviews).filter((r) => r.id !== reviewId));
  }, []);

  const sendMessage = useCallback((msg: Omit<Message, 'id' | 'createdAt'>) => {
    const full: Message = { ...msg, id: 'm' + Date.now(), createdAt: new Date().toISOString() };
    save(KEYS.messages, [full, ...load<Message[]>(KEYS.messages, seedMessages)]);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    save(KEYS.settings, { ...load<AppSettings>(KEYS.settings, seedSettings), ...patch });
  }, []);

  const getUser = useCallback((id: string) => state.users.find((u) => u.id === id), [state.users]);

  return {
    ...state, currentUser, login, register, logout, updateUser, deleteUser,
    toggleFavorite, addJob, addReview, replyReview, deleteReview, sendMessage, updateSettings, getUser,
  };
}

export function resetDemoData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  ensureSeeded();
  listeners.forEach((l) => l());
}
