import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';

export function JobList() {
  const { tip } = useParams<{ tip: string }>();
  const type = tip === 'caut' ? 'seek' : 'offer';
  const { jobs, users } = useStore();

  const [city, setCity] = useState('');
  const [minRate, setMinRate] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(
    () => [...new Set(jobs.filter((j) => j.type === type).map((j) => j.city))].sort(),
    [jobs, type],
  );

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => j.type === type)
      .filter((j) => !city || j.city === city)
      .filter((j) => !minRate || j.rate >= Number(minRate))
      .filter((j) => {
        if (!minRating) return true;
        const u = users.find((x) => x.id === j.userId);
        return (u?.rating ?? 0) >= Number(minRating);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [jobs, users, type, city, minRate, minRating]);

  const title = type === 'offer' ? 'Oferte de lucru' : 'Caută de lucru';

  return (
    <div className="px-4 pt-4 pb-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium mb-3"
      >
        <ArrowLeft size={16} />
        Înapoi la pagina principală
      </Link>

      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-earth">{title}</h1>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-1 text-sm text-terracotta font-medium px-2 py-1 rounded-lg bg-terracotta/5"
        >
          <SlidersHorizontal size={16} />
          Filtre
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 space-y-3 shadow-sm">
          <div>
            <label className="text-xs font-medium text-gray-500">Oraș</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white"
            >
              <option value="">Toate</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Min lei/oră</label>
              <input
                type="number"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                placeholder="0"
                className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Min rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white"
              >
                <option value="">Oricare</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCity('');
              setMinRate('');
              setMinRating('');
            }}
            className="text-xs text-gray-500 underline"
          >
            Resetează filtrele
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
        <Filter size={14} />
        {filtered.length} anunț{filtered.length === 1 ? '' : 'uri'}
      </p>

      <div className="space-y-3">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            user={users.find((u) => u.id === job.userId)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            Niciun anunț nu corespunde filtrelor.
          </div>
        )}
      </div>
    </div>
  );
}
