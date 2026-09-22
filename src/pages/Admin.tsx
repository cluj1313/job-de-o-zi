import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Ban, Trash2, Megaphone, Link2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { HubLink } from '../types';

type MsgMode = 'one' | 'all';

export function Admin() {
  const {
    currentUser, users, reviews, updateUser, deleteUser, deleteReview,
    sendMessage, settings, updateSettings,
  } = useStore();

  const [msgMode, setMsgMode] = useState<MsgMode>('one');
  const [msgUserId, setMsgUserId] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [msgText, setMsgText] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [links, setLinks] = useState<HubLink[]>(settings.hubLinks);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const recipients = useMemo(
    () => users.filter((u) => u.id !== currentUser?.id),
    [users, currentUser?.id],
  );

  const filtered = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return recipients;
    return recipients.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.city || '').toLowerCase().includes(q),
    );
  }, [recipients, userQuery]);

  if (!currentUser?.isAdmin) return <Navigate to="/cont" replace />;
  const admin = currentUser;

  function send() {
    const text = msgText.trim();
    if (!text) return;

    // Tuturor = all users of THIS app (Job de o zi) only — not cross-app
    if (msgMode === 'all') {
      sendMessage({
        fromId: admin.id,
        fromName: admin.name,
        toId: 'all',
        text,
        broadcast: true,
      });
      setMsgText('');
      setToast('Trimis tuturor.');
      return;
    }

    if (!msgUserId) {
      setToast('Alege un user.');
      return;
    }
    sendMessage({
      fromId: admin.id,
      fromName: admin.name,
      toId: msgUserId,
      text,
    });
    setMsgText('');
    setToast('Mesaj trimis.');
  }

  function saveLinks() {
    updateSettings({ hubLinks: links });
    setToast('Link-uri hub salvate');
  }

  const selected = recipients.find((u) => u.id === msgUserId);

  return (
    <div className="px-4 pt-4 pb-8 space-y-6 relative">
      <Link to="/cont" className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium">
        <ArrowLeft size={16} /> Înapoi
      </Link>
      <h1 className="text-xl font-bold">Panou Admin</h1>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Utilizatori ({users.length})</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {u.name}{' '}
                  {u.isAdmin && <span className="text-[10px] bg-terracotta text-white px-1.5 py-0.5 rounded">admin</span>}
                  {u.blocked && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-1">blocat</span>}
                </p>
                <p className="text-xs text-gray-500">{u.phone} · {u.city}</p>
                {u.email && <p className="text-[11px] text-earth-muted truncate">{u.email}</p>}
              </div>
              {!u.isAdmin && (
                <>
                  <button type="button" title="Blochează" onClick={() => updateUser(u.id, { blocked: !u.blocked })}
                    className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Ban size={16} />
                  </button>
                  <button type="button" title="Șterge" onClick={() => { if (confirm(`Ștergi pe ${u.name}?`)) deleteUser(u.id); }}
                    className="w-9 h-9 rounded-lg bg-peach/40 text-terracotta-dark flex items-center justify-center">
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <Megaphone size={14} /> Mesaje
        </h2>
        <p className="text-[11px] text-earth-muted mb-2">
          Mesaje doar pentru utilizatorii din Job de o zi.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={() => setMsgMode('one')}
            className={`h-12 rounded-xl text-sm font-semibold border ${
              msgMode === 'one'
                ? 'bg-terracotta text-white border-terracotta shadow'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Unui user
          </button>
          <button
            type="button"
            onClick={() => setMsgMode('all')}
            className={`h-12 rounded-xl text-sm font-semibold border ${
              msgMode === 'all'
                ? 'bg-terracotta text-white border-terracotta shadow'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Tuturor
          </button>
        </div>

        {msgMode === 'one' && (
          <div className="mb-3 space-y-2">
            <input
              type="search"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Caută după nume, telefon, oraș…"
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm"
            />
            {selected && (
              <p className="text-xs text-terracotta font-medium">
                Selectat: {selected.name} · {selected.phone}
              </p>
            )}
            <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-100 bg-white divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <p className="p-3 text-xs text-gray-400">Niciun user găsit.</p>
              ) : (
                filtered.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setMsgUserId(u.id)}
                    className={`w-full text-left px-3 py-2.5 text-sm ${
                      msgUserId === u.id ? 'bg-peach/40 text-terracotta font-semibold' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="block truncate">{u.name}</span>
                    <span className="block text-[11px] text-gray-500">{u.phone} · {u.city}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {msgMode === 'all' && (
          <p className="text-xs text-gray-500 mb-2">
            Mesajul ajunge la toți utilizatorii din această aplicație.
          </p>
        )}

        <textarea
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          placeholder={msgMode === 'all' ? 'Mesaj pentru toți din Job de o zi…' : 'Mesaj…'}
        />
        <button
          type="button"
          onClick={send}
          className="mt-2 w-full h-11 rounded-xl bg-terracotta text-white text-sm font-semibold"
        >
          Trimite
        </button>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <Link2 size={14} /> Link-uri hub (Setări)
        </h2>
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={link.id} className="p-3 bg-white rounded-xl border border-gray-100 space-y-2">
              <input value={link.title} onChange={(e) => { const n=[...links]; n[i]={...link,title:e.target.value}; setLinks(n); }}
                className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="Titlu" />
              <input value={link.url} onChange={(e) => { const n=[...links]; n[i]={...link,url:e.target.value}; setLinks(n); }}
                className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="URL" />
              <input value={link.description||''} onChange={(e) => { const n=[...links]; n[i]={...link,description:e.target.value}; setLinks(n); }}
                className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="Descriere" />
              <input value={link.photo||''} onChange={(e) => { const n=[...links]; n[i]={...link,photo:e.target.value}; setLinks(n); }}
                className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="Photo / thumb URL" />
            </div>
          ))}
          <button type="button" onClick={() => setLinks([...links,{id:'h'+Date.now(),title:'Link nou',url:'https://',description:''}])}
            className="text-sm text-terracotta font-medium">+ Adaugă link</button>
          <button type="button" onClick={saveLinks}
            className="block w-full h-10 rounded-xl bg-terracotta text-white text-sm font-semibold">Salvează link-uri</button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Recenzii ({reviews.length})</h2>
        <div className="space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="p-3 bg-white rounded-xl border border-gray-100 flex gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">
                  {r.authorName} → {users.find((u)=>u.id===r.targetUserId)?.name} · ★{r.rating}
                </p>
                <p className="text-sm truncate">{r.text}</p>
              </div>
              <button type="button" onClick={() => { if (confirm('Ștergi recenzia?')) deleteReview(r.id); }}
                className="w-9 h-9 rounded-lg bg-peach/40 text-terracotta-dark flex items-center justify-center shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

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
