import { Star } from 'lucide-react';

interface Props {
  value: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

export function StarRating({ value, size = 14, showValue = true, count }: Props) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? 'fill-gold text-gold'
              : i === full && half
                ? 'fill-gold/50 text-gold'
                : 'fill-gray-200 text-gray-300'
          }
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs text-gray-600">
          {value > 0 ? value.toFixed(1) : '0'}
          {count !== undefined ? ` (${count})` : ''}
        </span>
      )}
    </div>
  );
}
