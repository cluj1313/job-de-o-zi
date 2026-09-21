import { Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Job, User } from '../types';
import { StarRating } from './StarRating';
import { useStore } from '../store/useStore';
import { resolveAsset } from '../utils/assets';

interface Props {
  job: Job;
  user?: User;
}

export function JobCard({ job, user }: Props) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useStore();
  const liked = favorites.includes(job.id);

  return (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.99] transition"
      onClick={() => navigate(`/profil/${job.userId}?job=${job.id}`)}
    >
      <div className="relative h-36 bg-gray-200">
        <img
          src={resolveAsset(job.photo)}
          alt=""
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          aria-label="Favorite"
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(job.id);
          }}
        >
          <Heart
            size={18}
            className={liked ? 'fill-terracotta text-terracotta' : 'text-earth-muted'}
          />
        </button>
        <span className="absolute bottom-2 left-2 bg-terracotta text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {job.rate} lei/oră
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-earth text-base leading-snug line-clamp-2">
          {job.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-sm text-earth-muted font-medium">
          <MapPin size={14} />
          <span>{job.city}</span>
        </div>
        {user && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-earth font-medium truncate">{user.name}</span>
            <StarRating value={user.rating} count={user.ratingCount} size={12} />
          </div>
        )}
      </div>
    </article>
  );
}
