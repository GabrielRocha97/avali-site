import Link from 'next/link';
import { MapPin, Heart, Star, CheckCircle } from 'lucide-react';
import type { School } from '@/lib/types';
import clsx from 'clsx';

const TYPE_LABEL: Record<string, string> = {
  particular: 'Particular', publica: 'Pública', bilingue: 'Bilíngue',
  federal: 'Federal', estadual: 'Estadual', municipal: 'Municipal',
};

interface Props {
  school: School;
  distance?: string;
  compact?: boolean;
}

export default function SchoolCard({ school, distance, compact = false }: Props) {
  return (
    <div className={clsx('card hover:shadow-card-hover transition-all group', compact && 'p-4')}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={clsx('badge', school.type === 'particular' ? 'bg-navy/10 text-navy' : school.type === 'bilingue' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700')}>
              {TYPE_LABEL[school.type]}
            </span>
            {school.isVerified && (
              <span className="badge bg-coral/10 text-coral">
                <CheckCircle size={10} /> Verificada
              </span>
            )}
            {school.isAutismFriendly && (
              <span className="badge bg-blue-100 text-blue-700">♿ Autismo-Friendly</span>
            )}
          </div>
          <h3 className="font-bold text-navy text-base leading-tight truncate group-hover:text-coral transition-colors">
            {school.name}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {school.neighborhood}, {school.city} – {school.state}
            {distance && <span className="ml-1 text-coral font-medium">· {distance}</span>}
          </p>
        </div>
        <button className="p-2 rounded-xl hover:bg-cream-card ml-2 shrink-0" aria-label="Salvar escola">
          <Heart size={16} className="text-gray-400 hover:text-coral transition-colors" />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Star size={15} className="text-amber-400 fill-amber-400" />
          <span className="font-bold text-navy text-base">{school.rating.toFixed(1)}</span>
        </div>
        <span className="text-xs text-gray-500">{school.reviewCount} avaliações</span>
        <div className="ml-auto text-right">
          {school.avgPrice > 0 ? (
            <>
              <p className="text-xs text-gray-500">Mensalidade</p>
              <p className="font-bold text-navy text-sm">R$ {school.avgPrice.toLocaleString('pt-BR')}<span className="text-xs font-normal text-gray-400">/mês</span></p>
            </>
          ) : (
            <span className="badge bg-green-100 text-green-700 text-xs">Gratuita</span>
          )}
        </div>
      </div>

      {/* Category bars */}
      {!compact && (
        <div className="space-y-1.5 mb-4">
          {school.categories.slice(0, 4).map(c => (
            <div key={c.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-24 shrink-0">{c.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="bg-coral h-1.5 rounded-full rating-bar-fill" style={{ width: `${(c.value / 5) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-navy w-6 text-right">{c.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}

      <Link href={`/escola/${school.id}`} className="btn-primary w-full text-center text-sm py-2.5 block">
        Ver perfil completo
      </Link>
    </div>
  );
}
