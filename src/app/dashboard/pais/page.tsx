'use client';
import Link from 'next/link';
import { Star, Heart, Bell, BookOpen, TrendingUp, Search, ChevronRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SCHOOLS } from '@/lib/data';

const SAVED_IDS = ['1', '3'];
const savedSchools = SCHOOLS.filter(s => SAVED_IDS.includes(s.id));

const RECENT_REVIEWS = [
  { schoolName: 'Colégio Montessori SP', rating: 4, date: '2024-01-15', status: 'publicada' },
];

export default function DashboardPaisPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-navy mb-1">Olá, João 👋</h1>
            <p className="text-gray-500 text-sm">Painel do responsável · Plano <span className="text-coral font-bold">Pais</span></p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Search, label: 'Buscar escolas', href: '/buscar', color: 'text-coral' },
              { icon: Star, label: 'Avaliar escola', href: '/avaliar', color: 'text-amber-500' },
              { icon: Heart, label: 'Favoritas', href: '#favoritas', color: 'text-red-400' },
              { icon: Bell, label: 'Alertas', href: '#alertas', color: 'text-blue-500' },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className="card flex flex-col items-center gap-2 py-5 hover:shadow-card-hover transition-shadow text-center">
                <a.icon size={22} className={a.color} />
                <span className="text-xs font-semibold text-navy">{a.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Saved schools */}
              <div className="card" id="favoritas">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-navy text-lg flex items-center gap-2">
                    <Heart size={18} className="text-red-400" /> Escolas salvas
                  </h2>
                  <Link href="/buscar" className="text-sm text-coral font-bold hover:underline">+ Adicionar</Link>
                </div>
                {savedSchools.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Heart size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma escola salva ainda</p>
                    <Link href="/buscar" className="btn-primary text-sm mt-3 inline-block">Buscar escolas</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedSchools.map(s => (
                      <div key={s.id} className="flex items-center gap-4 p-3 rounded-2xl bg-cream-card">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-navy text-sm truncate">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.city} · R$ {s.avgPrice.toLocaleString('pt-BR')}/mês</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold text-navy">{s.rating.toFixed(1)}</span>
                        </div>
                        <Link href={`/escola/${s.id}`} className="text-coral shrink-0">
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My reviews */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-navy text-lg flex items-center gap-2">
                    <Star size={18} className="text-amber-400" /> Minhas avaliações
                  </h2>
                  <Link href="/avaliar" className="text-sm text-coral font-bold hover:underline">+ Nova</Link>
                </div>
                {RECENT_REVIEWS.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Star size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Você ainda não avaliou nenhuma escola</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {RECENT_REVIEWS.map((r, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-cream-card">
                        <div className="flex-1">
                          <p className="font-bold text-navy text-sm">{r.schoolName}</p>
                          <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} size={11} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                          ))}
                        </div>
                        <span className="badge bg-green-50 text-green-700 text-xs flex items-center gap-1">
                          <CheckCircle size={10} /> {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Plan card */}
              <div className="card bg-navy text-white">
                <p className="text-xs text-white/60 mb-1">Seu plano</p>
                <p className="text-xl font-black mb-1">Pais</p>
                <p className="text-sm text-white/70 mb-4">R$ 10/mês · Renova em 20/02/2024</p>
                <div className="space-y-2 text-sm text-white/80 mb-4">
                  {['Avaliações completas', 'Comparar 3 escolas', 'Salvar favoritas', 'Publicar avaliações'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-coral shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary w-full text-center text-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Gerenciar assinatura
                </button>
              </div>

              {/* Tips */}
              <div className="card">
                <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-coral" /> Dica da semana
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Ao comparar escolas, verifique não só a nota geral mas também o critério <strong>Inclusão</strong> —
                  especialmente relevante para crianças no espectro autista.
                </p>
                <Link href="/buscar?autismFriendly=true" className="text-xs text-coral font-bold mt-2 inline-block">
                  Ver escolas Autismo-Friendly →
                </Link>
              </div>

              {/* Compare */}
              <div className="card border-2 border-dashed border-coral/30">
                <h3 className="font-bold text-navy mb-2 flex items-center gap-2">
                  <TrendingUp size={16} className="text-coral" /> Comparar escolas
                </h3>
                <p className="text-xs text-gray-500 mb-3">Adicione até 3 escolas e compare lado a lado.</p>
                <Link href="/buscar" className="btn-primary w-full text-center text-sm block">
                  Selecionar escolas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
