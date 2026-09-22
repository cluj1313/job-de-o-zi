import { useMemo, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Message } from '../types';

export function AdminThreads({ onToast }: { onToast: (msg: string) => void }) {
  const { currentUser, users, messages, deleteMessage } = useStore();
  const [threadPeer, setThreadPeer] = useState<string | null>(null);
  const admin = currentUser;

  const adminThreads = useMemo(() => {
    const map = new Map<string, Message[]>();
    for (const m of messages) {
      let key: string;
      if (m.broadcast || m.toId === 'all') {
        key = 'all';
      } else {
        const a = m.fromId;
        const b = m.toId;
        key = [a, b].sort().join('::');
      }
      const list = map.get(key) || [];
      list.push(m);
      map.set(key, list);
    }
    return Array.from(map.entries())
      .map(([key, list]) => {
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        if (key === 'all') {
          return {
            key,
            label: 'Tuturor (broadcast)',
            count: sorted.length,
            latest: sorted[0],
            messages: [...list].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            ),
          };
        }
        const [idA, idB] = key.split('::');
        const nameA = users.find((u) => u.id === idA)?.name || idA;
        const nameB = users.find((u) => u.id === idB)?.name || idB;
        return {
          key,
          label: `${nameA} ↔ ${nameB}`,
          count: sorted.length,
          latest: sorted[0],
          messages: [...list].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.latest?.createdAt || 0).getTime() -
          new Date(a.latest?.createdAt || 0).getTime(),
      );
  }, [messages, users]);

  const openThread = adminThreads.find((t) => t.key === threadPeer) || null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Conversații ({adminThreads.length})
      </h2>
      <p className="text-[11px] text-earth-muted mb-2">
        Persistente pe partea admin. Poți șterge orice mesaj din fir. Vezi Livrat și Citit.
      </p>

      {openThread && admin ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setThreadPeer(null)}
            className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium"
          >
            <ArrowLeft size={14} /> Lista conversații
          </button>
          <p className="text-sm font-semibold">{openThread.label}</p>
          {openThread.messages.map((m) => {
            const mine = m.fromId === admin.id;
            return (
              <div
                key={m.id}
                className={`p-3 rounded-xl border text-sm ${
                  m.broadcast
                    ? 'bg-amber-50 border-amber-100'
                    : mine
                      ? 'bg-terracotta/5 border-terracotta/15'
                      : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 truncate">{m.fromName}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {new Date(m.createdAt).toLocaleString('ro-RO', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  {mine ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-earth-muted">
                      {m.readAt ? (
                        <>
                          <CheckCheck size={12} className="text-terracotta" /> Citit
                        </>
                      ) : m.deliveredAt ? (
                        <>
                          <Check size={12} className="text-ochre" /> Livrat
                        </>
                      ) : (
                        <>
                          <Check size={12} /> Trimis
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-[10px] text-earth-muted">
                      {m.readAt ? 'Citit de tine' : m.deliveredAt ? 'Livrat' : ''}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Ștergi acest mesaj?')) {
                        deleteMessage(m.id);
                        onToast('Mesaj șters.');
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-dark"
                  >
                    <Trash2 size={12} /> Șterge mesaj
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {adminThreads.length === 0 ? (
            <p className="text-xs text-gray-400 p-2">Nicio conversație încă.</p>
          ) : (
            adminThreads.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setThreadPeer(t.key)}
                className="w-full text-left p-3 rounded-xl border border-gray-100 bg-white hover:bg-peach/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{t.label}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">{t.count} msg</span>
                </div>
                <p className="text-xs text-earth-muted truncate mt-0.5">{t.latest?.text}</p>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}
