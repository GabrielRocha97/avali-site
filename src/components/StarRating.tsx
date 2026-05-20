import { Star } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({ value, max = 5, size = 16, showValue = false, className }: Props) {
  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = value >= i + 1;
        const partial = !filled && value > i;
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-200" fill="currentColor" />
            {(filled || partial) && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: partial ? `${(value - i) * 100}%` : '100%' }}>
                <Star size={size} className="text-amber-400" fill="currentColor" />
              </div>
            )}
          </div>
        );
      })}
      {showValue && <span className="font-bold text-navy ml-1" style={{ fontSize: size }}>{value.toFixed(1)}</span>}
    </div>
  );
}
