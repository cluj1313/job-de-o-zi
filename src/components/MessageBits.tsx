import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '../types';

export type ThreadKey = string;

export function peerOf(m: Message, meId: string): ThreadKey {
  if (m.broadcast || m.toId === 'all') return 'all';
  return m.fromId === meId ? m.toId : m.fromId;
}

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('ro-RO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Asymmetric receipts (WhatsApp-like, under bubble):
 * - Admin/owner: Livrat → Citit on own outbound
 * - Regular user: only „Livrat” on own outbound (never Citit for admin-read)
 */
export function Receipts({
  m,
  viewerIsAdmin,
  isMine,
}: {
  m: Message;
  viewerIsAdmin: boolean;
  isMine: boolean;
}) {
  if (!isMine) return null;
  const delivered = Boolean(m.deliveredAt);
  const read = Boolean(m.readAt);

  if (viewerIsAdmin) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium text-earth-muted"
        data-receipt={read ? 'citit' : delivered ? 'livrat' : 'trimis'}
      >
        {read ? (
          <>
            <CheckCheck size={14} className="text-terracotta shrink-0" aria-hidden />
            Citit
          </>
        ) : delivered ? (
          <>
            <Check size={14} className="text-ochre shrink-0" aria-hidden />
            Livrat
          </>
        ) : (
          <>
            <Check size={14} className="shrink-0" aria-hidden />
            Trimis
          </>
        )}
      </span>
    );
  }

  // User: mock delivers immediately — always show clear „Livrat”, never Citit
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold text-ochre"
      data-receipt="livrat"
      aria-label="Livrat"
    >
      <Check size={14} className="shrink-0" aria-hidden />
      Livrat
    </span>
  );
}
