import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useStore } from '../store/useStore';

export function OwnerPresentation() {
  const { settings, currentUser, updateSettings } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(settings.ownerPresentation);

  function save() {
    updateSettings({ ownerPresentation: draft });
    setEditing(false);
  }

  const lines = settings.ownerPresentation.split('\n');

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/setari"
          className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium"
        >
          <ArrowLeft size={16} />
          Înapoi
        </Link>
        {currentUser?.isAdmin && !editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(settings.ownerPresentation);
              setEditing(true);
            }}
            className="flex items-center gap-1 text-sm text-terracotta font-medium"
          >
            <Pencil size={14} />
            Editează
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={16}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-sm"
            >
              Anulează
            </button>
            <button
              type="button"
              onClick={save}
              className="flex-1 h-11 rounded-xl bg-terracotta text-white text-sm font-semibold"
            >
              Salvează
            </button>
          </div>
        </div>
      ) : (
        <article className="prose-sm space-y-2">
          {lines.map((line, i) => {
            if (line.startsWith('# '))
              return (
                <h1 key={i} className="text-2xl font-bold text-terracotta">
                  {line.slice(2)}
                </h1>
              );
            if (line.startsWith('## '))
              return (
                <h2 key={i} className="text-lg font-semibold mt-4">
                  {line.slice(3)}
                </h2>
              );
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return (
              <p key={i} className="text-sm text-gray-700 leading-relaxed">
                {line.replace(/\*\*(.*?)\*\*/g, '$1')}
              </p>
            );
          })}
        </article>
      )}
    </div>
  );
}
