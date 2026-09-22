import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Megaphone, Send, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { peerOf, formatWhen, Receipts, type ThreadKey } from '../components/MessageBits';

export function MessagesThread({
  activeThread,
  onBack,
}: {
  activeThread: ThreadKey;
  onBack: () => void;
}) {
  const {
    currentUser,
    messages,
    users,
    sendMessage,
    deleteMessage,
    hideMessagesForUser,
    markMessagesRead,
  } = useStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [text, setText] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const lastOutboundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const isAdmin = Boolean(currentUser?.isAdmin || currentUser?.isOwner);
  const me = currentUser;

  const visible = useMemo(() => {
    if (!me) return [];
    return messages.filter((m) => {
      const involved =
        m.broadcast ||
        m.toId === 'all' ||
        m.toId === me.id ||
        m.fromId === me.id;
      if (!involved) return false;
      if (isAdmin) return true;
      return !(m.hiddenFor || []).includes(me.id);
    });
  }, [messages, me, isAdmin]);

  const threadMessages = useMemo(() => {
    if (!me) return [];
    return visible
      .filter((m) => peerOf(m, me.id) === activeThread)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [visible, me, activeThread]);

  const lastOutboundId = useMemo(() => {
    if (!me) return null;
    for (let i = threadMessages.length - 1; i >= 0; i--) {
      if (threadMessages[i].fromId === me.id) return threadMessages[i].id;
    }
    return null;
  }, [threadMessages, me]);

  useEffect(() => {
    if (!me) return;
    const toRead = threadMessages
      .filter((m) => m.fromId !== me.id && !m.readAt)
      .map((m) => m.id);
    if (toRead.length) markMessagesRead(toRead);
  }, [activeThread, threadMessages, me, markMessagesRead]);

  // Keep last bubble (and Livrat under outbound) in view while thread is open
  useEffect(() => {
    const target = lastOutboundRef.current || endRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [threadMessages.length, lastOutboundId, activeThread]);

  if (!me) return null;
  const user = me;

  function leaveThread() {
    if (!isAdmin) {
      hideMessagesForUser(threadMessages.map((m) => m.id), user.id);
    }
    onBack();
  }

  function sendReply() {
    if (!text.trim() || activeThread === 'all') {
      if (activeThread === 'all') setToast('Nu poti raspunde la anuntul Tuturor aici.');
      return;
    }
    sendMessage({
      fromId: user.id,
      fromName: user.name,
      toId: activeThread,
      text: text.trim(),
    });
    setText('');
    setReplyOpen(false);
    // User must see Livrat before Inapoi — toast reinforces tick under bubble
    setToast(isAdmin ? 'Mesaj trimis.' : 'Livrat');
  }

  function onDelete(id: string) {
    if (!isAdmin) return;
    if (!confirm('Stergi acest mesaj din conversatie?')) return;
    deleteMessage(id);
    setToast('Mesaj sters.');
  }

  const peer = activeThread === 'all' ? null : users.find((u) => u.id === activeThread);
  const title = activeThread === 'all' ? 'Anunturi (Tuturor)' : peer?.name || 'Conversatie';
  const canReply = activeThread !== 'all';

  return (
    <div className="px-4 pt-4 pb-24 relative min-h-[70vh]">
      {canReply && (
        <button
          type="button"
          onClick={() => setReplyOpen((v) => !v)}
          className="w-full h-12 mb-2 rounded-xl bg-terracotta text-white text-sm font-semibold shadow"
        >
          Raspunde
        </button>
      )}
      <button
        type="button"
        onClick={leaveThread}
        className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium mb-3"
      >
        <ArrowLeft size={16} /> Inapoi
      </button>
      <h1 className="text-lg font-bold mb-1">{title}</h1>
      {peer && (
        <p className="text-xs text-earth-muted mb-4">
          {peer.phone}{peer.city ? ` · ${peer.city}` : ''}
        </p>
      )}
      {activeThread === 'all' && (
        <p className="text-xs text-earth-muted mb-4">
          Anunturi catre toti utilizatorii Job de o zi.
        </p>
      )}
      {!isAdmin && (
        <p className="text-[11px] text-earth-muted mb-3 rounded-lg bg-peach/30 px-3 py-2">
          La Inapoi, mesajele dispar doar pe ecranul tau. Adminul le pastreaza.
          Statusul <span className="font-semibold text-ochre">Livrat</span> apare sub
          raspunsul tau cat timp ecranul e deschis.
        </p>
      )}
      {replyOpen && canReply && (
        <div className="mb-4 p-3 rounded-2xl border border-peach bg-white shadow-sm space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Scrie raspunsul…"
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={sendReply}
            className="w-full h-11 rounded-xl bg-terracotta text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            <Send size={16} /> Trimite
          </button>
        </div>
      )}
      <div className="space-y-2">
        {threadMessages.map((m) => {
          const mine = m.fromId === user.id;
          const isLastOutbound = mine && m.id === lastOutboundId;
          return (
            <div
              key={m.id}
              ref={isLastOutbound ? lastOutboundRef : undefined}
              className={`p-3 rounded-xl border text-sm ${
                m.broadcast
                  ? 'bg-amber-50 border-amber-100'
                  : mine
                    ? 'bg-terracotta/5 border-terracotta/15 ml-4'
                    : 'bg-white border-gray-100 mr-4'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium text-xs text-gray-600 truncate">
                  {m.broadcast ? (
                    <span className="inline-flex items-center gap-1 text-amber-800">
                      <Megaphone size={12} /> {m.fromName}
                    </span>
                  ) : (
                    m.fromName
                  )}
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">{formatWhen(m.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>
              <div className="mt-1.5 flex items-center justify-end gap-3">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => onDelete(m.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-dark"
                  >
                    <Trash2 size={12} /> Sterge mesaj
                  </button>
                )}
                <Receipts m={m} viewerIsAdmin={isAdmin} isMine={mine} />
              </div>
            </div>
          );
        })}
        {threadMessages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">Niciun mesaj.</p>
        )}
        <div ref={endRef} aria-hidden className="h-1" />
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
