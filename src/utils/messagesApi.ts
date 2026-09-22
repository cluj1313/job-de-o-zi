import type { Message } from '../types';

/** Shape for a future HTTP API — keep localStorage ops behind this surface. */
export type SendMessageInput = Omit<
  Message,
  'id' | 'createdAt' | 'deliveredAt' | 'readAt' | 'hiddenFor'
>;

export function buildMessage(msg: SendMessageInput): Message {
  const now = new Date().toISOString();
  return {
    ...msg,
    id: 'm' + Date.now() + Math.random().toString(36).slice(2, 6),
    createdAt: now,
    // MVP: mark delivered immediately (same-device mock). Ready for API later.
    deliveredAt: now,
  };
}

export function withHiddenFor(m: Message, userId: string): Message {
  const hiddenFor = Array.from(new Set([...(m.hiddenFor || []), userId]));
  return { ...m, hiddenFor };
}

export function withDelivered(m: Message, at: string): Message {
  if (m.deliveredAt) return m;
  return { ...m, deliveredAt: at };
}

export function withRead(m: Message, at: string): Message {
  if (m.readAt) return m;
  return { ...m, deliveredAt: m.deliveredAt || at, readAt: at };
}

export function peerKey(m: Message, meId?: string): string {
  if (m.broadcast || m.toId === 'all') return 'all';
  if (meId) return m.fromId === meId ? m.toId : m.fromId;
  const a = m.fromId;
  const b = m.toId;
  return [a, b].sort().join('::');
}
