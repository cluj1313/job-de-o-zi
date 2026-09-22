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

/** Asymmetric receipts: admin/owner sees Livrat+Citit; others only Livrat on own outbound */
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
      <span className="inline-flex items-center gap-1 text-[10px] text-earth-muted">
        {read ? (
          <>
            <CheckCheck size={12} className="text-terracotta" /> Citit
          </>
        ) : delivered ? (
          <>
            <Check size={12} className="text-ochre" /> Livrat
          </>
        ) : (
          <>
            <Check size={12} /> Trimis
          </>
        )}
      </span>
    );
  }

  // Recipient / regular user: never reveal whether admin read their reply
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-earth-muted">
      {delivered ? (
        <>
          <Check size={12} className="text-ochre" /> Livrat
        </>
      ) : (
        <>
          <Check size={12} /> Trimis
        </>
      )}
    </span>
  );
}
