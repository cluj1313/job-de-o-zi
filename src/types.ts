export type Role = 'offerer' | 'seeker';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password: string;
  city: string;
  role: Role;
  avatar?: string;
  cover?: string;
  description?: string;
  rating: number;
  ratingCount: number;
  blocked?: boolean;
  isAdmin?: boolean;
  isOwner?: boolean;
}

export interface Job {
  id: string;
  userId: string;
  type: 'offer' | 'seek';
  title: string;
  description: string;
  rate: number;
  city: string;
  photo?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  targetUserId: string;
  authorId: string;
  authorName: string;
  rating: number;
  text: string;
  reply?: string;
  createdAt: string;
}

/**
 * Message model — localStorage MVP, shaped for a future API.
 * - broadcast + toId:'all' = Job de o zi users only (not cross-app)
 * - hiddenFor = per-user ephemeral dismiss (recipient leave)
 * - deliveredAt / readAt = asymmetric receipts (admin sees both; users only Livrat)
 */
export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  text: string;
  createdAt: string;
  broadcast?: boolean;
  /** ISO — marked when recipient inbox sees the message */
  deliveredAt?: string;
  /** ISO — marked when recipient opens the thread (admin-visible Citit) */
  readAt?: string;
  /** User ids for whom this message is hidden on their side only */
  hiddenFor?: string[];
}

export interface HubLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  /** Optional thumb/photo URL — admin can edit */
  photo?: string;
}

export type TextSize = 'sm' | 'md' | 'lg';

export interface AppSettings {
  ownerPresentation: string;
  hubLinks: HubLink[];
  /** Mic / Normal / Mare — applied via html class + --text-scale */
  textSize?: TextSize;
}
