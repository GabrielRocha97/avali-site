import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, Phone, CheckCircle,
  TrendingUp, AlertCircle, ExternalLink,
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewsSection from '@/components/ReviewsSection';
import SaveButton from '@/components/SaveButton';
import { getSchoolByIdOrSlug, getReviewsForSchool } from '@/lib/db';

const ADMIN_EMAIL = 'amarorocha97@gmail.com';

async function checkSaved(email: string, schoolId: string): Promise<boolean> {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
    const { data: profile } = await sb.from('profiles').select('id').eq('email', email).single();
    if (!profile) return false;
    const { data } = await sb.from('favorites').select('id').eq('profile_id', profile.id).eq('school_id', schoolId).single();
    return !!data;
  } catch {
    return false;
  }
}

export default async function EscolaPage({ params }: { params: { id: string } }) {
  const [school, session] = await Promise.all([
    getSchoolByIdOrSlug(params.id),
    getServerSession(authOptions),
  ]);
  if (!school) notFound();

  const isLoggedIn = !!session?.user?.email;
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const [reviews, isSaved] = await Promise.all([
    getReviewsForSchool(school.id),
    isLoggedIn ? checkSaved(session!.user!.email!, school.id) : Promise.resolve(false),
  ]);

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
                  <span className="badge bg-white/20 text-white">{TYPE_LABEL[school.type] ?? school.type}</span>
                  {school.stages.map(s => (
                    <span key={s} className="badge bg-white/10 text-white/80">{STAGE_LABEL[s] ?? s}</span>
                  ))}
                  {school.isVerified && <span className="badge bg-coral/80 text-white flex items-center gap-1"><CheckCircle size={10} /> Verificada</span>}
                  {school.isAutismFriendly && <span className="badge bg-blue-500/80 text-white">♿ Autismo-Friendly</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mb-2">{school.name}</h1>
                <p className="text-white/70 flex items-center gap-1.5 text-sm">
                  <MapPin size={14} /> {school.address}{school.address ? ', ' : ''}{school.neighborhood}{school.neighborhood ? ', ' : ''}{school.city} – {school.state}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <SaveButton schoolId={school.id} schoolName={school.name} initialSaved={isSaved} isLoggedIn={isLoggedIn} />
                <Link href={`/avaliar?schoolId=${school.id}&schoolName=${encodeURIComponent(school.name)}`} className="btn-primary text-sm">
                  Avaliar escola
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              <span className="font-black text-2xl text-navy">{school.rating > 0 ? school.rating.toFixed(1) : '–'}</span>
              <span className="text-sm text-gray-500">/5 · {school.reviewCount} avaliações</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Mensalidade (pais informam)</p>
              {school.avgPrice > 0 ? (
                <p className="font-bold text-navy">R$ {school.avgPrice.toLocaleString('pt-BR')}<span className="text-xs text-gray-400 font-normal">/mês</span></p>
              ) : (
                <p className="font-bold text-green-600">Gratuita / Sem dados</p>
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

          <div className="lg:col-span-2 space-y-6">

            {school.categories.length > 0 && (
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
            )}

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

            <ReviewsSection
              reviews={reviews}
              schoolId={school.id}
              schoolName={school.name}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />

            <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                As informações publicadas na Avali são fornecidas por usuários e podem variar. A Avali não substitui proposta oficial da instituição.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card bg-navy text-white">
              <h3 className="font-bold text-lg mb-2">Você conhece esta escola?</h3>
              <p className="text-white/70 text-sm mb-4">Compartilhe sua experiência com outros pais.</p>
              <Link href={`/avaliar?schoolId=${school.id}&schoolName=${encodeURIComponent(school.name)}`} className="btn-primary w-full text-center block">
                Avaliar esta escola
              </Link>
            </div>

            <div className="card p-0 overflow-hidden h-48">
              <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                <MapPin size={20} className="mr-2" />
                {school.city}, {school.state}
              </div>
            </div>

            {!school.isClaimed && (
              <div className="card border-2 border-dashed border-gray-200">
                <p className="font-bold text-navy text-sm mb-2">Esta escola ainda não foi reivindicada</p>
                <p className="text-xs text-gray-500 mb-3">Represente sua escola e tenha acesso ao painel de gestão de reputação.</p>
                <Link href="/precos#escolas" className="btn-secondary text-sm text-center block">Reivindicar perfil</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
