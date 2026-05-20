import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, Phone, Globe, CheckCircle, Heart,
  MessageSquare, TrendingUp, AlertCircle, ExternalLink,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import { getSchoolById, getReviewsBySchool, PROFESSIONALS } from '@/lib/data';

export default function EscolaPage({ params }: { params: { id: string } }) {
  const school = getSchoolById(params.id);
  if (!school) notFound();

  const reviews = getReviewsBySchool(school.id);
  const nearbyPros = PROFESSIONALS.slice(0, 3);

  const TYPE_LABEL: Record<string, string> = {
    particular: 'Particular', publica: 'Pública', bilingue: 'Bilíngue',
    estadual: 'Estadual', municipal: 'Municipal', federal: 'Federal',
  };
  const STAGE_LABEL: Record<string, string> = {
    infantil: 'Ed. Infantil', fundamental: 'Fundamental', medio: 'Médio', integral: 'Integral',
  };

  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">

        {/* Hero */}
        <div className="bg-navy text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-white/20 text-white">{TYPE_LABEL[school.type]}</span>
                  {school.stages.map(s => (
                    <span key={s} className="badge bg-white/10 text-white/80">{STAGE_LABEL[s]}</span>
                  ))}
                  {school.isVerified && <span className="badge bg-coral/80 text-white"><CheckCircle size={10} /> Verificada</span>}
                  {school.isAutismFriendly && <span className="badge bg-blue-500/80 text-white">♿ Autismo-Friendly</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mb-2">{school.name}</h1>
                <p className="text-white/70 flex items-center gap-1.5 text-sm">
                  <MapPin size={14} /> {school.address}, {school.neighborhood}, {school.city} – {school.state}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  <Heart size={16} /> Salvar
                </button>
                <Link href="/avaliar" className="btn-primary text-sm">Avaliar escola</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              <span className="font-black text-2xl text-navy">{school.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">/5 · {school.reviewCount} avaliações</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Mensalidade (pais informam)</p>
              {school.avgPrice > 0 ? (
                <p className="font-bold text-navy">R$ {school.avgPrice.toLocaleString('pt-BR')}<span className="text-xs text-gray-400 font-normal">/mês</span></p>
              ) : (
                <p className="font-bold text-green-600">Gratuita</p>
              )}
            </div>
            {school.priceMin > 0 && (
              <div>
                <p className="text-xs text-gray-400">Faixa de valores</p>
                <p className="font-semibold text-sm text-navy">
                  R$ {school.priceMin.toLocaleString('pt-BR')} – R$ {school.priceMax.toLocaleString('pt-BR')}
                </p>
              </div>
            )}
            <div className="ml-auto flex gap-3 items-center">
              {school.phone && (
                <a href={`tel:${school.phone}`} className="flex items-center gap-1.5 text-sm text-navy font-semibold hover:text-coral transition-colors">
                  <Phone size={14} /> {school.phone}
                </a>
              )}
              {school.website && (
                <a href={school.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-navy font-semibold hover:text-coral transition-colors">
                  <ExternalLink size={14} /> Site oficial
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Category ratings */}
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-5 flex items-center gap-2">
                <TrendingUp size={20} className="text-coral" /> Avaliação por critério
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {school.categories.map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-navy">{c.label}</span>
                      <span className="font-bold text-navy">{c.value.toFixed(1)}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="bg-coral h-2 rounded-full" style={{ width: `${(c.value / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {school.description && (
              <div className="card">
                <h2 className="font-bold text-navy text-lg mb-3">Sobre a escola</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{school.description}</p>
                {school.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {school.highlights.map(h => (
                      <span key={h} className="badge bg-cream-card text-navy">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg flex items-center gap-2">
                  <MessageSquare size={20} className="text-coral" /> Avaliações dos pais
                </h2>
                <Link href="/avaliar" className="text-sm font-bold text-coral hover:underline">+ Avaliar</Link>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Nenhuma avaliação ainda</p>
                  <p className="text-sm mt-1">Seja o primeiro a avaliar esta escola</p>
                  <Link href="/avaliar" className="btn-primary text-sm mt-4 inline-block">Avaliar agora</Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {reviews.map(r => (
                    <div key={r.id} className="border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 bg-cream-card rounded-full flex items-center justify-center font-bold text-navy text-sm shrink-0">
                          {r.isAnonymous ? '?' : r.authorName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="font-bold text-navy text-sm">{r.isAnonymous ? 'Pai/Mãe anônimo(a)' : r.authorName}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">{r.stage} · {r.year} · Mensalidade: R$ {r.monthlyFee.toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.comment}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {r.pros && (
                          <div className="bg-green-50 rounded-xl p-3">
                            <p className="text-xs font-bold text-green-700 mb-1">✓ Pontos positivos</p>
                            <p className="text-xs text-green-600">{r.pros}</p>
                          </div>
                        )}
                        {r.cons && (
                          <div className="bg-red-50 rounded-xl p-3">
                            <p className="text-xs font-bold text-red-600 mb-1">✗ Pontos negativos</p>
                            <p className="text-xs text-red-500">{r.cons}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</p>
                        <div className="flex items-center gap-3">
                          {r.wouldRecommend && <span className="text-xs text-green-600 font-semibold">✓ Recomenda</span>}
                          <button className="text-xs text-gray-400 hover:text-navy transition-colors">👍 {r.helpful} útil</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                As informações publicadas na Avali são fornecidas por usuários e podem variar. A Avali não substitui proposta oficial da instituição.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* CTA card */}
            <div className="card bg-navy text-white">
              <h3 className="font-bold text-lg mb-2">Você conhece esta escola?</h3>
              <p className="text-white/70 text-sm mb-4">Compartilhe sua experiência com outros pais.</p>
              <Link href="/avaliar" className="btn-primary w-full text-center block">Avaliar esta escola</Link>
            </div>

            {/* Map */}
            <div className="card p-0 overflow-hidden h-48">
              <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                <MapPin size={20} className="mr-2" />
                {school.city}, {school.state}
              </div>
            </div>

            {/* Not claimed */}
            {!school.isClaimed && (
              <div className="card border-2 border-dashed border-gray-200">
                <p className="font-bold text-navy text-sm mb-2">Esta escola ainda não foi reivindicada</p>
                <p className="text-xs text-gray-500 mb-3">Represente sua escola e tenha acesso ao painel de gestão de reputação.</p>
                <Link href="/precos#escolas" className="btn-secondary text-sm text-center block">Reivindicar perfil</Link>
              </div>
            )}

            {/* Nearby professionals */}
            <div className="card">
              <h3 className="font-bold text-navy mb-4">Profissionais próximos</h3>
              <div className="space-y-3">
                {nearbyPros.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream-card rounded-full flex items-center justify-center font-bold text-navy text-sm shrink-0">
                      {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.specialty} · {p.city}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-navy">{p.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/profissionais" className="text-sm text-coral font-bold hover:underline mt-4 block">
                Ver todos os profissionais →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
