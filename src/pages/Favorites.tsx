import { Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';

export function Favorites() {
  const { favorites, jobs, users } = useStore();
  const favJobs = jobs.filter((j) => favorites.includes(j.id));

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
        <Heart className="text-maroon fill-maroon" size={22} />
        Favorite
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        {favJobs.length} anunț{favJobs.length === 1 ? '' : 'uri'} salvate
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
          <div className="text-center py-16 text-gray-400 text-sm">
            <Heart size={40} className="mx-auto mb-3 opacity-30" />
            Apasă pe inimă pe un anunț pentru a-l salva aici.
          </div>
        )}
      </div>
    </div>
  );
}
