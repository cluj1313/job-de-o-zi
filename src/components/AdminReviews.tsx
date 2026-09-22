import { Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function AdminReviews() {
  const { users, reviews, deleteReview } = useStore();
  return (
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
  );
}
