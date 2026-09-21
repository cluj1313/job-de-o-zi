import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, MapPin, Search, X } from 'lucide-react';
import { ALL_CITIES } from '../utils/city';

type Props = {
  value: string;
  onChange: (city: string) => void;
  /** Extra cities from data (jobs/users) merged into the list */
  extraCities?: string[];
  label?: string;
};

export function CityPicker({
  value,
  onChange,
  extraCities = [],
  label = 'Oraș',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const cities = useMemo(() => {
    const set = new Set<string>([...ALL_CITIES, ...extraCities.filter(Boolean)]);
    return [...set].sort((a, b) => a.localeCompare(b, 'ro'));
  }, [extraCities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const t = window.setTimeout(() => searchRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const pick = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div>
      <label className="text-sm font-semibold text-earth-muted">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1.5 w-full min-h-12 rounded-xl border border-tan bg-white px-3.5 py-3 text-base font-semibold text-earth shadow-sm flex items-center gap-2 text-left active:bg-peach/30"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <MapPin size={20} className="text-terracotta shrink-0" />
        <span className="flex-1 truncate">{value || 'Toate orașele'}</span>
        <ChevronDown size={20} className="text-earth-muted shrink-0" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/45"
          role="dialog"
          aria-modal="true"
          aria-label="Alege orașul"
          onClick={() => setOpen(false)}
        >
          <div
            className="mt-auto max-w-lg mx-auto w-full max-h-[92vh] flex flex-col rounded-t-3xl bg-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center gap-2 px-4 pt-4 pb-2 border-b border-tan/70">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-tan" />
              <h2 className="flex-1 text-lg font-bold text-earth pt-1">Alege orașul</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-earth-muted hover:bg-peach/50"
                aria-label="Închide"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center gap-2 h-12 rounded-xl border border-tan bg-white px-3">
                <Search size={18} className="text-earth-muted shrink-0" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Caută oraș..."
                  className="flex-1 bg-transparent outline-none text-base text-earth placeholder:text-earth-muted/70"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-6 overscroll-contain">
              <button
                type="button"
                onClick={() => pick('')}
                className={[
                  'w-full flex items-center gap-3 px-4 min-h-14 rounded-xl text-left text-base font-semibold transition-colors',
                  !value
                    ? 'bg-terracotta/15 text-terracotta'
                    : 'text-earth hover:bg-peach/40 active:bg-peach/50',
                ].join(' ')}
              >
                <span className="flex-1">Toate orașele</span>
                {!value && <Check size={20} className="text-terracotta shrink-0" />}
              </button>

              {filtered.map((c) => {
                const active = value === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => pick(c)}
                    className={[
                      'w-full flex items-center gap-3 px-4 min-h-14 rounded-xl text-left text-base font-medium transition-colors',
                      active
                        ? 'bg-terracotta/15 text-terracotta font-semibold'
                        : 'text-earth hover:bg-peach/40 active:bg-peach/50',
                    ].join(' ')}
                  >
                    <MapPin
                      size={18}
                      className={active ? 'text-terracotta' : 'text-earth-muted'}
                    />
                    <span className="flex-1">{c}</span>
                    {active && <Check size={20} className="text-terracotta shrink-0" />}
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <p className="text-center py-10 text-base text-earth-muted px-4">
                  Niciun oraș găsit pentru „{query}”.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
