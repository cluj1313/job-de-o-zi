import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Message } from '../types';
import { peerOf, formatWhen, type ThreadKey } from '../components/MessageBits';
import { MessagesThread } from '../components/MessagesThread';

export function Messages() {
  const {
    currentUser,
    messages,
    users,
    markMessagesDelivered,
  } = useStore();
  const navigate = useNavigate();
  const [activeThread, setActiveThread] = useState<ThreadKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const isAdmin = Boolean(currentUser?.isAdmin || currentUser?.isOwner);

  const visible = useMemo(() => {
    if (!currentUser) return messages.filter((m) => m.broadcast);
    return messages.filter((m) => {
      const involved =
        m.broadcast ||
        m.toId === 'all' ||
        m.toId === currentUser.id ||
        m.fromId === currentUser.id;
      if (!involved) return false;
      if (isAdmin) return true;
      return !(m.hiddenFor || []).includes(currentUser.id);
    });
  }, [messages, currentUser, isAdmin]);

  useEffect(() => {
    if (!currentUser || isAdmin) return;
    const pending = visible
      .filter(
        (m) =>
          !m.deliveredAt &&
          m.fromId !== currentUser.id &&
          (m.toId === currentUser.id || m.broadcast || m.toId === 'all'),
      )
      .map((m) => m.id);
    if (pending.length) markMessagesDelivered(pending);
  }, [visible, currentUser, isAdmin, markMessagesDelivered]);

  const threads = useMemo(() => {
    if (!currentUser) return [] as { key: ThreadKey; label: string; preview: string; at: string; unread: number }[];
    const map = new Map<ThreadKey, Message[]>();
    for (const m of visible) {
      const key = peerOf(m, currentUser.id);
      const list = map.get(key) || [];
      list.push(m);
      map.set(key, list);
    }
    return Array.from(map.entries())
      .map(([key, list]) => {
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const latest = sorted[0];
        const peer = key === 'all' ? null : users.find((u) => u.id === key);
        const label =
          key === 'all' ? 'Anunțuri (Tuturor)' : peer?.name || latest.fromName || key;
        const unread = sorted.filter((m) => m.fromId !== currentUser.id && !m.readAt).length;
        return { key, label, preview: latest.text, at: latest.createdAt, unread };
      })
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [visible, currentUser, users]);

  if (!currentUser) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-sm text-gray-500 mb-4">Autentifică-te pentru mesaje.</p>
        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="h-11 px-6 rounded-xl bg-terracotta text-white font-semibold text-sm"
        >
          Login
        </button>
      </div>
    );
  }

  if (activeThread) {
    return (
      <MessagesThread
        activeThread={activeThread}
        onBack={() => setActiveThread(null)}
      />
    );
  }

  return (
    <div className="px-4 pt-6 pb-6 relative">
      <h1 className="text-xl font-bold mb-1">Mesaje</h1>
      {isAdmin ? (
        <p className="text-[11px] text-earth-muted mb-4">
          Vizualizare admin: conversațiile rămân persistente. Livrat + Citit vizibile.
        </p>
      ) : (
        <p className="text-[11px] text-earth-muted mb-4">
          Deschide un mesaj; la Înapoi dispare doar pe partea ta.
        </p>
      )}
      <div className="space-y-2">
        {threads.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveThread(t.key)}
            className="w-full text-left p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:bg-peach/20 transition"
          >
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-semibold text-sm truncate inline-flex items-center gap-1.5">
                {t.key === 'all' && <Megaphone size={14} className="text-ochre shrink-0" />}
                {t.label}
              </span>
              <span className="text-[10px] text-gray-400 shrink-0">{formatWhen(t.at)}</span>
            </div>
            <p className="text-xs text-earth-muted truncate">{t.preview}</p>
            {t.unread > 0 && (
              <span className="mt-1 inline-block text-[10px] font-semibold bg-terracotta/15 text-terracotta px-1.5 py-0.5 rounded">
                {t.unread} nou{t.unread > 1 ? 'e' : ''}
              </span>
            )}
          </button>
        ))}
        {threads.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">Niciun mesaj.</p>
        )}
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-[90%] px-4 py-2.5 rounded-full bg-earth text-white text-sm font-medium shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
