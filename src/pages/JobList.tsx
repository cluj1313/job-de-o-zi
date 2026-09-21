import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';
import { citiesMatch } from '../utils/city';
import type { Job, User } from '../types';

type SortKey = 'distance' | 'rate' | 'rating' | 'recommend' | 'favorites';

const SORT_TABS: { key: SortKey; label: string }[] = [
  { key: 'distance', label: 'Distanță' },
  { key: 'rate', label: 'Lei/oră' },
  { key: 'rating', label: 'Rating' },
  { key: 'recommend', label: 'Recomandări' },
  { key: 'favorites', label: 'Favorite' },
];

function userRating(users: User[], userId: string): number {
  return users.find((x) => x.id === userId)?.rating ?? 0;
}

export function JobList() {
  const { tip } = useParams<{ tip: string }>();
  const type = tip === 'caut' ? 'seek' : 'offer';
  const { jobs, users, favorites, currentUser } = useStore();

  const [city, setCity] = useState('');
  const [minRate, setMinRate] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortKey>('distance');

  const cities = useMemo(
    () => [...new Set(jobs.filter((j) => j.type === type).map((j) => j.city))].sort(),
    [jobs, type],
  );

  const filtered = useMemo(() => {
    let list: Job[] = jobs.filter((j) => j.type === type);

    // Strict city filter (normalize: trim, case-insensitive; Cluj ≈ Cluj-Napoca)
    if (city) {
      list = list.filter((j) => citiesMatch(j.city, city));
    }

    if (minRate) {
      list = list.filter((j) => j.rate >= Number(minRate));
    }
    if (minRating) {
      list = list.filter((j) => userRating(users, j.userId) >= Number(minRating));
    }

    if (sort === 'favorites') {
      list = list.filter((j) => favorites.includes(j.id));
    }

    const refCity = city || currentUser?.city || '';

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'rate':
          return b.rate - a.rate;
        case 'rating':
          return userRating(users, b.userId) - userRating(users, a.userId);
        case 'recommend': {
          const score = (j: Job) => {
            const u = users.find((x) => x.id === j.userId);
            const r = u?.rating ?? 0;
            const c = u?.ratingCount ?? 0;
            return r * 10 + c + j.rate / 100;
          };
          return score(b) - score(a);
        }
        case 'favorites':
          return b.createdAt.localeCompare(a.createdAt);
        case 'distance':
        default: {
          // Stub: city match first (selected or user's city), then by createdAt
          if (refCity) {
            const am = citiesMatch(a.city, refCity) ? 0 : 1;
            const bm = citiesMatch(b.city, refCity) ? 0 : 1;
            if (am !== bm) return am - bm;
          }
          return b.createdAt.localeCompare(a.createdAt);
        }
      }
    });

    return list;
  }, [jobs, users, type, city, minRate, minRating, sort, favorites, currentUser]);

  const title = type === 'offer' ? 'Oferte de lucru' : 'Caută de lucru';

  const emptyMsg = city
    ? `Niciun anunț în ${city}. Schimbă orașul sau resetează filtrul.`
    : sort === 'favorites'
      ? 'Niciun anunț favorit nu corespunde filtrelor.'
      : 'Niciun anunț nu corespunde filtrelor.';

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

      {/* City selector — always visible */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-500">Oraș</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full h-11 rounded-xl border border-gray-200 px-3 text-sm bg-white font-medium text-earth shadow-sm"
        >
          <option value="">Toate orașele</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Sort tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 -mx-1 px-1 scrollbar-none">
        {SORT_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSort(t.key)}
            className={[
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              sort === t.key
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-white text-earth-muted border-gray-200 hover:border-terracotta/40',
            ].join(' ')}
          >
            {t.key === 'rating' ? (
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="fill-gold text-gold" />
                {t.label}
              </span>
            ) : (
              t.label
            )}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 space-y-3 shadow-sm">
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
              setSort('distance');
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
        {city ? ` în ${city}` : ''}
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
          <div className="text-center py-12 text-gray-500 text-sm px-2">{emptyMsg}</div>
        )}
      </div>
    </div>
  );
}
