import { Type } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { TextSize } from '../types';

const OPTIONS: { key: TextSize; label: string }[] = [
  { key: 'sm', label: 'Mic' },
  { key: 'md', label: 'Normal' },
  { key: 'lg', label: 'Mare' },
];

export function TextSizeControl() {
  const { settings, updateSettings } = useStore();
  const current: TextSize =
    settings.textSize === 'sm' || settings.textSize === 'lg' ? settings.textSize : 'md';

  return (
    <div className="px-3 py-3 rounded-xl">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="w-9 h-9 rounded-xl bg-tan/40 flex items-center justify-center text-earth-muted">
          <Type size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-earth">Mărime text</p>
          <p className="text-[12px] text-earth-muted mt-0.5">Mic · Normal · Mare</p>
        </div>
      </div>
      <div className="flex gap-2">
        {OPTIONS.map(({ key, label }) => {
          const active = current === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => updateSettings({ textSize: key })}
              className={[
                'flex-1 h-11 rounded-xl text-sm font-semibold border transition-colors',
                active
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-white text-earth border-tan hover:border-terracotta/40',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
