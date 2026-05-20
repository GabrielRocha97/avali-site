'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Star, MapPin, X, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PROFESSIONALS } from '@/lib/data';

const SPECIALTIES = [
  '', 'Psicopedagogia', 'Terapia Ocupacional', 'Fonoaudiologia',
  'Psicologia', 'Neuropsicologia', 'ABA', 'Fisioterapia',
];

export default function ProfissionaisPage() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('');

  const filtered = useMemo(() => {
    return PROFESSIONALS.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) &&
          !p.city.toLowerCase().includes(query.toLowerCase()) &&
          !p.specialty.toLowerCase().includes(query.toLowerCase())) return false;
      if (specialty && p.specialty !== specialty) return false;
      return true;
    });
  }, [query, specialty]);

  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">

        {/* Hero */}
        <section className="bg-navy text-white py-14 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl font-black mb-3">Profissionais de educação e saúde</h1>
            <p className="text-white/70 text-lg">Psicopedagogos, fonoaudiólogos, terapeutas e mais — perto de você.</p>
          </div>
        </section>

        {/* Search */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-coral/30 focus-within:border-coral bg-white">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Buscar por nome, especialidade ou cidade..."
                className="flex-1 outline-none text-sm text-navy placeholder-gray-400 bg-transparent" />
              {query && <button onClick={() => setQuery('')}><X size={16} className="text-gray-400" /></button>}
            </div>
            <select value={specialty} onChange={e => setSpecialty(e.target.value)}
              className="input text-sm sm:w-60">
              <option value="">Todas as especialidades</option>
              {SPECIALTIES.filter(Boolean).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-sm text-gray-500 mb-6">
            <strong className="text-navy">{filtered.length}</strong> profissional{filtered.length !== 1 ? 'is' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-4">
            {filtered.map(p => (
              <div key={p.id} className="card flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Avatar */}
                <div className="w-16 h-16 bg-cream-card rounded-2xl flex items-center justify-center font-black text-navy text-xl shrink-0">
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-black text-navy text-lg">{p.name}</h2>
                    {p.isVerified && (
                      <span className="badge bg-green-50 text-green-700 flex items-center gap-1">
                        <CheckCircle size={11} /> Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-coral font-semibold mb-1">{p.specialty}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {p.city}, {p.state}
                  </p>
                  {p.bio && <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">{p.bio}</p>}
                  {p.specialties && p.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.specialties.map(s => (
                        <span key={s} className="badge bg-cream-card text-navy text-xs">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rating + CTA */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-black text-navy text-lg">{p.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({p.reviewCount})</span>
                  </div>
                  <Link href={`/profissionais/${p.id}`} className="btn-primary text-sm">
                    Ver perfil
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Search size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold">Nenhum profissional encontrado</p>
                <p className="text-sm mt-1">Tente outros filtros ou termos de busca</p>
              </div>
            )}
          </div>

          {/* CTA for professionals */}
          <div className="mt-12 card bg-navy text-white text-center">
            <h3 className="font-black text-xl mb-2">Você é profissional da área?</h3>
            <p className="text-white/70 text-sm mb-4">Crie seu perfil e apareça nas buscas de famílias da sua região.</p>
            <Link href="/precos" className="btn-primary inline-block">Ver plano profissional</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
