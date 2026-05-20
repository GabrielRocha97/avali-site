'use client';
import Link from 'next/link';
import {
  Star, Eye, TrendingUp, MessageSquare, CheckCircle,
  Edit3, AlertCircle, BarChart2, Users, ThumbsUp,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSchoolById, getReviewsBySchool } from '@/lib/data';

const school = getSchoolById('1')!;
const reviews = getReviewsBySchool('1');

const STATS = [
  { label: 'Visualizações (30d)', value: '1.240', icon: Eye, color: 'text-blue-500', change: '+18%' },
  { label: 'Avaliações', value: String(school.reviewCount), icon: Star, color: 'text-amber-500', change: '+2 este mês' },
  { label: 'Nota média', value: school.rating.toFixed(1), icon: TrendingUp, color: 'text-green-500', change: '▲ 0.2' },
  { label: 'Recomendam', value: '87%', icon: ThumbsUp, color: 'text-coral', change: 'dos avaliadores' },
];

const CATEGORY_LABELS: Record<string, string> = {
  'Infraestrutura': 'Infraestrutura',
  'Pedagógico': 'Pedagógico',
  'Segurança': 'Segurança',
  'Comunicação': 'Comunicação',
  'Inclusão': 'Inclusão',
};

export default function DashboardEscolaPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-navy mb-1">{school.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-500 text-sm">Painel da escola</span>
                {school.isVerified ? (
                  <span className="badge bg-green-50 text-green-700 flex items-center gap-1">
                    <CheckCircle size={11} /> Perfil verificado
                  </span>
                ) : (
                  <span className="badge bg-amber-50 text-amber-700 flex items-center gap-1">
                    <AlertCircle size={11} /> Perfil não reivindicado
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/escola/${school.id}`} className="btn-secondary text-sm">Ver perfil público</Link>
              <button className="btn-primary text-sm flex items-center gap-2">
                <Edit3 size={14} /> Editar informações
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="card">
                <div className="flex items-center justify-between mb-2">
                  <s.icon size={18} className={s.color} />
                  <span className="text-xs text-gray-400">{s.change}</span>
                </div>
                <p className="text-2xl font-black text-navy">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main */}
            <div className="lg:col-span-2 space-y-6">

              {/* Category breakdown */}
              <div className="card">
                <h2 className="font-black text-navy text-lg mb-5 flex items-center gap-2">
                  <BarChart2 size={20} className="text-coral" /> Notas por critério
                </h2>
                <div className="space-y-4">
                  {school.categories.map(c => (
                    <div key={c.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-navy">{c.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-navy">{c.value.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">/ 5.0</span>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${c.value >= 4 ? 'bg-green-500' : c.value >= 3 ? 'bg-coral' : 'bg-red-400'}`}
                          style={{ width: `${(c.value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    O critério <strong>Comunicação</strong> está abaixo da média regional. Responder avaliações pode melhorar essa percepção.
                  </p>
                </div>
              </div>

              {/* Recent reviews */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-navy text-lg flex items-center gap-2">
                    <MessageSquare size={18} className="text-coral" /> Avaliações recentes
                  </h2>
                  <Link href={`/escola/${school.id}`} className="text-sm text-coral font-bold hover:underline">
                    Ver todas
                  </Link>
                </div>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma avaliação ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map(r => (
                      <div key={r.id} className="border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="font-bold text-navy text-sm">{r.isAnonymous ? 'Responsável anônimo(a)' : r.authorName}</p>
                            <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                        <button className="text-xs text-coral font-bold mt-2 hover:underline">
                          Responder institucionalmente →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Plan */}
              <div className="card bg-navy text-white">
                <p className="text-xs text-white/60 mb-1">Plano atual</p>
                <p className="text-xl font-black mb-1">Escola Essencial</p>
                <p className="text-sm text-white/70 mb-4">R$ 5.000/ano · Renova em dez/2024</p>
                <Link href="/precos#escolas"
                  className="btn-secondary w-full text-center text-sm bg-white/10 border-white/20 text-white hover:bg-white/20 block">
                  Upgrade para Premium
                </Link>
              </div>

              {/* Checklist */}
              <div className="card">
                <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
                  <Users size={16} className="text-coral" /> Complete seu perfil
                </h3>
                <div className="space-y-2">
                  {[
                    { done: true, text: 'Perfil reivindicado' },
                    { done: true, text: 'Informações básicas' },
                    { done: !!school.description, text: 'Descrição da escola' },
                    { done: false, text: 'Galeria de fotos (0/20)' },
                    { done: false, text: 'Responder avaliações' },
                    { done: false, text: 'Adicionar eventos abertos' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2 text-xs">
                      <CheckCircle size={13} className={item.done ? 'text-green-500' : 'text-gray-200'} />
                      <span className={item.done ? 'text-navy' : 'text-gray-400'}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-gray-100 rounded-full h-2">
                  <div className="bg-coral h-2 rounded-full" style={{ width: '50%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">50% completo</p>
              </div>

              {/* LGPD notice */}
              <div className="flex gap-2 items-start bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <AlertCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Você visualiza apenas dados agregados. A identidade de avaliadores anônimos nunca é revelada, conforme a LGPD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
