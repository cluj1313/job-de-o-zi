import { Ban, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function AdminUsers() {
  const { users, updateUser, deleteUser } = useStore();
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Utilizatori ({users.length})</h2>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {u.name}{' '}
                {u.isAdmin && <span className="text-[10px] bg-terracotta text-white px-1.5 py-0.5 rounded">admin</span>}
                {u.blocked && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-1">blocat</span>}
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
  );
}
