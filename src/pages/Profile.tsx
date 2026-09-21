import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Star,
  Camera,
  Pencil,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { StarRating } from '../components/StarRating';
import { AvatarCapture } from './AvatarCapture';
import { resolveAsset, coverWatch } from '../utils/assets';

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const [search] = useSearchParams();
  const jobId = search.get('job');
  const navigate = useNavigate();
  const {
    getUser,
    currentUser,
    jobs,
    reviews,
    updateUser,
    addReview,
    replyReview,
    sendMessage,
  } = useStore();

  const user = getUser(id || '');
  const isOwn = currentUser?.id === user?.id;
  const [showAvatar, setShowAvatar] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [desc, setDesc] = useState(user?.description || '');
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [msgText, setMsgText] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Utilizator negăsit</p>
        <Link to="/" className="text-terracotta text-sm">
          Acasă
        </Link>
      </div>
    );
  }

  const userJobs = jobs.filter((j) => j.userId === user.id);
  const userReviews = reviews.filter((r) => r.targetUserId === user.id);
  const featuredJob = jobId ? jobs.find((j) => j.id === jobId) : userJobs[0];
  const canReply = isOwn && user.role === 'offerer';

  function saveDesc() {
    updateUser(user!.id, { description: desc });
    setEditingDesc(false);
  }

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !reviewText.trim()) return;
    addReview({
      targetUserId: user!.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      rating: reviewStars,
      text: reviewText.trim(),
    });
    setReviewText('');
  }

  function sendMsg() {
    if (!currentUser || !msgText.trim()) return;
    sendMessage({
      fromId: currentUser.id,
      fromName: currentUser.name,
      toId: user!.id,
      text: msgText.trim(),
    });
    setMsgText('');
    setShowMsg(false);
    navigate('/mesaje');
  }

  const wa = `https://wa.me/4${user.phone.replace(/\D/g, '')}`;
  const tel = `tel:${user.phone}`;

  return (
    <div className="pb-6">
      <div className="relative h-44 bg-gray-300">
        <img
          src={resolveAsset(user.cover || featuredJob?.photo || coverWatch)}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="px-4 -mt-12 relative">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-terracotta bg-terracotta/10">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          {isOwn && (
            <button
              type="button"
              onClick={() => setShowAvatar(true)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center shadow"
            >
              <Camera size={14} />
            </button>
          )}
        </div>

        <h1 className="mt-2 text-xl font-bold text-earth">{user.name}</h1>
        <p className="text-sm text-gray-500">
          {user.city} · {user.role === 'offerer' ? 'Oferă de lucru' : 'Caută de lucru'}
        </p>
        <div className="mt-1">
          <StarRating value={user.rating} count={user.ratingCount} />
        </div>

        {featuredJob && (
          <div className="mt-3 p-3 bg-terracotta/5 rounded-xl border border-terracotta/10">
            <p className="font-semibold text-sm text-earth">{featuredJob.title}</p>
            <p className="text-terracotta font-bold text-sm mt-0.5">
              {featuredJob.rate} lei/oră
            </p>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-gray-700">Despre</h2>
            {isOwn && (
              <button
                type="button"
                onClick={() => {
                  setDesc(user.description || '');
                  setEditingDesc(true);
                }}
                className="text-terracotta"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
          {editingDesc ? (
            <div className="space-y-2">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm"
              />
              <button
                type="button"
                onClick={saveDesc}
                className="h-9 px-4 rounded-lg bg-terracotta text-white text-sm font-medium"
              >
                Salvează
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {user.description || 'Fără descriere.'}
            </p>
          )}
        </div>

        {!isOwn && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <a
              href={tel}
              className="h-11 rounded-xl bg-terracotta text-white flex items-center justify-center gap-1.5 text-sm font-semibold"
            >
              <Phone size={16} />
              Call
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="h-11 rounded-xl bg-green-600 text-white flex items-center justify-center gap-1.5 text-sm font-semibold"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  navigate('/auth');
                  return;
                }
                setShowMsg(true);
              }}
              className="h-11 rounded-xl bg-white border-2 border-terracotta text-terracotta flex items-center justify-center gap-1.5 text-sm font-semibold"
            >
              Mesaj
            </button>
          </div>
        )}

        {showMsg && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 space-y-2">
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Scrie un mesaj..."
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg p-2"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMsg(false)}
                className="flex-1 h-9 text-sm text-gray-500"
              >
                Anulează
              </button>
              <button
                type="button"
                onClick={sendMsg}
                className="flex-1 h-9 rounded-lg bg-terracotta text-white text-sm font-medium"
              >
                Trimite
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Star size={14} className="text-gold" />
            Recenzii ({userReviews.length})
          </h2>

          {currentUser && !isOwn && (
            <form onSubmit={submitReview} className="mb-4 p-3 bg-white rounded-xl border border-gray-100 space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewStars(n)}
                    className="p-0.5"
                  >
                    <Star
                      size={20}
                      className={
                        n <= reviewStars
                          ? 'fill-gold text-gold'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Scrie o recenzie..."
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-lg p-2"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-terracotta text-white text-sm font-medium"
              >
                Publică
              </button>
            </form>
          )}

          <div className="space-y-3">
            {userReviews.map((r) => (
              <div key={r.id} className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.authorName}</span>
                  <StarRating value={r.rating} showValue={false} size={12} />
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.text}</p>
                {r.reply && (
                  <div className="mt-2 ml-3 pl-3 border-l-2 border-terracotta/30 text-sm text-gray-500">
                    <span className="font-medium text-terracotta">Răspuns: </span>
                    {r.reply}
                  </div>
                )}
                {canReply && !r.reply && (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={replyDrafts[r.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((d) => ({ ...d, [r.id]: e.target.value }))
                      }
                      placeholder="Răspunde..."
                      className="flex-1 h-8 text-sm border border-gray-200 rounded-lg px-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const t = replyDrafts[r.id]?.trim();
                        if (t) replyReview(r.id, t);
                      }}
                      className="h-8 px-3 rounded-lg bg-terracotta/10 text-terracotta text-xs font-semibold"
                    >
                      Răspunde
                    </button>
                  </div>
                )}
              </div>
            ))}
            {userReviews.length === 0 && (
              <p className="text-sm text-gray-400">Nicio recenzie încă. Rating de la 0.</p>
            )}
          </div>
        </div>
      </div>

      {showAvatar && (
        <AvatarCapture
          onCancel={() => setShowAvatar(false)}
          onSave={(dataUrl) => {
            updateUser(user.id, { avatar: dataUrl });
            setShowAvatar(false);
          }}
        />
      )}
    </div>
  );
}
