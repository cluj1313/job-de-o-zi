import { useState } from 'react';
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
  const [msgText, setMsgText] = useState('');
  const [links, setLinks] = useState<HubLink[]>(settings.hubLinks);

  if (!currentUser?.isAdmin) return <Navigate to="/cont" replace />;

  function send() {
    const text = msgText.trim();
    if (!text) return;

    if (msgMode === 'all') {
      sendMessage({
        fromId: currentUser!.id,
        fromName: currentUser!.name,
        toId: 'all',
        text,
        broadcast: true,
      });
      setMsgText('');
      alert('Trimis tuturor.');
      return;
    }

    if (!msgUserId) {
      alert('Alege un user.');
      return;
    }
    sendMessage({
      fromId: currentUser!.id,
      fromName: currentUser!.name,
      toId: msgUserId,
      text,
    });
    setMsgText('');
    alert('Mesaj trimis.');
  }

  function saveLinks() {
    updateSettings({ hubLinks: links });
    alert('Link-uri hub salvate');
  }

  const recipients = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="px-4 pt-4 pb-8 space-y-6">
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

        <div className="flex rounded-xl bg-gray-100 p-1 mb-3">
          <button
            type="button"
            onClick={() => setMsgMode('one')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
              msgMode === 'one' ? 'bg-white shadow text-terracotta' : 'text-gray-500'
            }`}
          >
            Unui user
          </button>
          <button
            type="button"
            onClick={() => setMsgMode('all')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
              msgMode === 'all' ? 'bg-white shadow text-terracotta' : 'text-gray-500'
            }`}
          >
            Tuturor
          </button>
        </div>

        {msgMode === 'one' && (
          <select
            value={msgUserId}
            onChange={(e) => setMsgUserId(e.target.value)}
            className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm mb-2"
          >
            <option value="">Alege user...</option>
            {recipients.map((u) => (
              <option key={u.id} value={u.id}>{u.name} · {u.phone}</option>
            ))}
          </select>
        )}

        <textarea
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          placeholder={msgMode === 'all' ? 'Mesaj pentru toți...' : 'Mesaj...'}
        />
        <button
          type="button"
          onClick={send}
          className="mt-2 h-10 px-4 rounded-xl bg-terracotta text-white text-sm font-semibold"
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
    </div>
  );
}
