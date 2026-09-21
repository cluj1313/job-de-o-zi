import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Send } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Messages() {
  const { currentUser, messages, users, sendMessage } = useStore();
  const navigate = useNavigate();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [text, setText] = useState('');

  const visible = useMemo(() => {
    if (!currentUser) return messages.filter((m) => m.broadcast);
    return messages.filter(
      (m) =>
        m.broadcast ||
        m.toId === currentUser.id ||
        m.fromId === currentUser.id ||
        m.toId === 'all',
    );
  }, [messages, currentUser]);

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
        {visible.length > 0 && (
          <div className="mt-8 text-left space-y-2">
            <h2 className="text-sm font-semibold text-gray-600">Anunțuri publice</h2>
            {visible.map((m) => (
              <div key={m.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm">
                <div className="flex items-center gap-1 text-amber-800 font-medium text-xs mb-1">
                  <Megaphone size={12} />
                  Broadcast
                </div>
                {m.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function send() {
    if (!text.trim() || !replyTo || !currentUser) return;
    sendMessage({
      fromId: currentUser.id,
      fromName: currentUser.name,
      toId: replyTo,
      text: text.trim(),
    });
    setText('');
    setReplyTo(null);
  }

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-xl font-bold mb-4">Mesaje</h1>
      <div className="space-y-2">
        {visible.map((m) => {
          const otherId = m.fromId === currentUser.id ? m.toId : m.fromId;
          const other = users.find((u) => u.id === otherId);
          return (
            <div
              key={m.id}
              className={`p-3 rounded-xl border text-sm ${
                m.broadcast
                  ? 'bg-amber-50 border-amber-100'
                  : m.fromId === currentUser.id
                    ? 'bg-terracotta/5 border-terracotta/10 ml-6'
                    : 'bg-white border-gray-100 mr-6'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs text-gray-600">
                  {m.broadcast ? (
                    <span className="inline-flex items-center gap-1 text-amber-800">
                      <Megaphone size={12} /> {m.fromName}
                    </span>
                  ) : (
                    m.fromName
                  )}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(m.createdAt).toLocaleString('ro-RO', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p>{m.text}</p>
              {!m.broadcast && m.fromId !== currentUser.id && (
                <button
                  type="button"
                  onClick={() => setReplyTo(m.fromId)}
                  className="mt-2 text-xs text-terracotta font-semibold"
                >
                  Răspunde {other?.name || ''}
                </button>
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">Niciun mesaj.</p>
        )}
      </div>

      {replyTo && (
        <div className="fixed bottom-20 inset-x-0 max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mesaj..."
              className="flex-1 h-10 text-sm border border-gray-200 rounded-xl px-3"
            />
            <button
              type="button"
              onClick={send}
              className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
