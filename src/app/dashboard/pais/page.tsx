'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Star, Heart, Bell, BookOpen, TrendingUp, Search, CheckCircle, Loader2, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SavedSchool { school_id: string; school_name: string }

export default function DashboardPaisPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState<SavedSchool[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => { setSaved(Array.isArray(d) ? d : []); setLoadingSaved(false); })
      .catch(() => setLoadingSaved(false));
  }, []);

  async function removeSaved(schoolId: string) {
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId }),
    });
    setSaved(s => s.filter(x => x.school_id !== schoolId));
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'por aqui';
  const avatar = session?.user?.image;
  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Welcome */}
          <div className="mb-8 flex items-center gap-4">
            {avatar ? (
              <Image
                src={avatar}
                alt={session?.user?.name ?? ''}
                width={56}
                height={56}
                className="rounded-2xl object-cover shadow-sm ring-2 ring-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-coral flex items-center justify-center text-white font-black text-lg shadow-sm">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-navy mb-0.5">Olá, {firstName} 👋</h1>
              <p className="text-gray-500 text-sm">
                Painel do responsável · Plano <span className="text-coral font-bold">Gratuito</span>
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Search, label: 'Buscar escolas', href: '/buscar', color: 'text-coral' },
              { icon: Star,   label: 'Avaliar escola',  href: '/avaliar', color: 'text-amber-500' },
              { icon: Heart,  label: 'Favoritas',       href: '#favoritas', color: 'text-red-400' },
              { icon: Bell,   label: 'Alertas',         href: '#alertas', color: 'text-blue-500' },
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
                {loadingSaved ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-coral" />
                  </div>
                ) : saved.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Heart size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma escola salva ainda</p>
                    <Link href="/buscar" className="btn-primary text-sm mt-3 inline-block">Buscar escolas</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {saved.map(s => (
                      <div key={s.school_id} className="flex items-center justify-between gap-3 p-3 bg-cream-card rounded-xl">
                        <Link href={`/escola/${s.school_id}`} className="flex-1 min-w-0">
                          <p className="font-semibold text-navy text-sm truncate hover:text-coral transition-colors">{s.school_name}</p>
                        </Link>
                        <button onClick={() => removeSaved(s.school_id)} className="text-gray-400 hover:text-red-400 transition-colors shrink-0">
                          <X size={16} />
                        </button>
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
                <div className="text-center py-8 text-gray-400">
                  <Star size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Você ainda não avaliou nenhuma escola</p>
                  <Link href="/avaliar" className="btn-primary text-sm mt-3 inline-block">Avaliar agora</Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Profile card */}
              <div className="card bg-navy text-white">
                <div className="flex items-center gap-3 mb-4">
                  {avatar ? (
                    <Image src={avatar} alt="" width={44} height={44}
                      className="rounded-xl object-cover ring-2 ring-white/20" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-coral flex items-center justify-center text-white font-black text-sm">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-black text-white truncate">{session?.user?.name ?? '—'}</p>
                    <p className="text-xs text-white/60 truncate">{session?.user?.email ?? ''}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-white/80 mb-4">
                  {['Buscar e comparar escolas', 'Salvar favoritas', 'Publicar avaliações'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-coral shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/precos" className="btn-secondary w-full text-center text-sm block bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Ver planos
                </Link>
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
                <Link href="/buscar" className="text-xs text-coral font-bold mt-2 inline-block">
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
