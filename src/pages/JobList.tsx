import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';
import { CityPicker } from '../components/CityPicker';
import { citiesMatch } from '../utils/city';
import type { Job, User } from '../types';

type SortKey = 'distance' | 'rate' | 'rating' | 'recommend' | 'favorites';

const SORT_TABS: { key: SortKey; label: string }[] = [
  { key: 'favorites', label: 'Favorite' },
  { key: 'distance', label: 'Distanță' },
  { key: 'rate', label: 'Lei/oră' },
  { key: 'rating', label: 'Rating' },
  { key: 'recommend', label: 'Recomandări' },
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

  const citiesFromJobs = useMemo(
    () => [...new Set(jobs.filter((j) => j.type === type).map((j) => j.city))],
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
        className="inline-flex items-center gap-1.5 text-base text-terracotta font-semibold mb-3"
      >
        <ArrowLeft size={18} />
        Înapoi la pagina principală
      </Link>

      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold text-earth tracking-tight">{title}</h1>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-1 text-sm text-terracotta font-semibold px-2.5 py-1.5 rounded-lg bg-terracotta/5"
        >
          <SlidersHorizontal size={16} />
          Filtre
        </button>
      </div>

      {/* City picker — bottom sheet with all cities */}
      <div className="mb-3">
        <CityPicker
          value={city}
          onChange={setCity}
          extraCities={citiesFromJobs}
        />
      </div>

      {/* Sort tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 -mx-1 px-1 scrollbar-none">
        {SORT_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSort(t.key)}
            className={[
              'shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors',
              sort === t.key
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-white text-earth-muted border-tan hover:border-terracotta/40',
            ].join(' ')}
          >
            {t.key === 'rating' ? (
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="fill-gold text-gold" />
                {t.label}
              </span>
            ) : (
              t.label
            )}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="mb-4 p-3 bg-white rounded-xl border border-tan/60 space-y-3 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-earth-muted">Min lei/oră</label>
              <input
                type="number"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                placeholder="0"
                className="mt-1 w-full h-11 rounded-lg border border-tan px-3 text-base text-earth bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-earth-muted">Min rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="mt-1 w-full h-11 rounded-lg border border-tan px-3 text-base bg-white text-earth"
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
            className="text-sm text-earth-muted underline font-medium"
          >
            Resetează filtrele
          </button>
        </div>
      )}

      <p className="text-base text-earth-muted mb-3 flex items-center gap-1.5 font-medium">
        <Filter size={16} />
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
          <div className="text-center py-12 text-earth-muted text-base px-2 font-medium">
            {emptyMsg}
          </div>
        )}
      </div>
    </div>
  );
}
