import { Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';

export function Favorites() {
  const { favorites, jobs, users } = useStore();
  const favJobs = jobs.filter((j) => favorites.includes(j.id));

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
        <Heart size={22} className="text-terracotta fill-terracotta" />
        Favorite
      </h1>
      <p className="text-sm text-earth-muted mb-4">
        Anunțurile salvate de tine
      </p>
      <div className="space-y-3">
        {favJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            user={users.find((u) => u.id === job.userId)}
          />
        ))}
        {favJobs.length === 0 && (
          <div className="text-center py-16 text-earth-muted text-sm">
            Niciun favorit încă. Apasă pe inimă pe un anunț.
          </div>
        )}
      </div>
    </div>
  );
}
