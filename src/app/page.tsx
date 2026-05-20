'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Search, MapPin, Star, Shield, CheckCircle, Users, Building2,
  TrendingUp, Heart, BookOpen, ChevronRight, AlertCircle, ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DEMO_CATEGORIES = [
  { label: 'Atendimento', value: 4.8 },
  { label: 'Pedagogia', value: 4.9 },
  { label: 'Estrutura', value: 4.6 },
  { label: 'Segurança', value: 4.7 },
  { label: 'Inclusão', value: 3.8 },
  { label: 'Custo-benefício', value: 4.2 },
];

const STEPS = [
  { icon: Search, title: 'Busque escolas', desc: 'Pesquise por cidade, bairro, CEP ou nome. Filtre por tipo, etapa, preço e avaliação.' },
  { icon: Star, title: 'Compare com dados reais', desc: 'Veja mensalidades, notas por categoria e avaliações escritas de pais que já matricularam.' },
  { icon: CheckCircle, title: 'Decida com segurança', desc: 'Salve favoritas, compare lado a lado e tome a melhor decisão para o seu filho.' },
];

const AUDIENCES = [
  {
    icon: Heart, color: 'coral', title: 'Para pais e responsáveis',
    items: ['Avaliações reais de outros pais', 'Mensalidades informadas pela comunidade', 'Mapa com escolas perto de você', 'Filtro autismo-friendly', 'Comparação lado a lado'],
    cta: 'Buscar escolas', href: '/buscar',
  },
  {
    icon: Users, color: 'blue', title: 'Para profissionais',
    items: ['Perfil profissional visível', 'Apareça nas buscas regionais', 'Receba contatos de famílias', 'Psicólogos, fonoaudiólogos, psicopedagogos e mais'],
    cta: 'Criar perfil', href: '/login',
  },
  {
    icon: Building2, color: 'navy', title: 'Para escolas',
    items: ['Dashboard de reputação', 'Métricas e tendências', 'Resposta institucional a avaliações', 'Relatórios de interesse dos pais', 'Destaque no perfil'],
    cta: 'Ver planos', href: '/precos',
  },
];

const PLANS = [
  { name: 'Pais', price: 'R$ 10', period: '/mês', color: 'coral', items: ['Ver avaliações completas', 'Publicar avaliações', 'Comparar escolas', 'Salvar favoritas'] },
  { name: 'Profissional', price: 'R$ 50', period: '/mês', color: 'navy', items: ['Perfil profissional', 'Aparecer nas buscas', 'Receber contatos', 'Dashboard'] },
  { name: 'Escola Essencial', price: 'R$ 5.000', period: '/ano', color: 'gray', items: ['Reivindicar perfil', 'Galeria de fotos', 'Métricas básicas', 'Resposta a avaliações'] },
];

export default function Home() {
  const [search, setSearch] = useState('');

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="pt-16 bg-gradient-to-br from-navy via-navy-light to-[#2A4080] min-h-[90vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Star size={12} className="text-amber-300 fill-amber-300" />
                +50.000 avaliações de pais em todo o Brasil
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                Encontre, compare e avalie escolas com{' '}
                <span className="text-coral">informações reais</span>{' '}
                de outros pais.
              </h1>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                A Avali centraliza avaliações, valores, estrutura, localização e experiências reais sobre escolas em todo o Brasil.
              </p>

              {/* Search bar */}
              <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-xl mb-6 max-w-lg">
                <div className="flex-1 flex items-center gap-2 px-2">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por escola, bairro ou cidade..."
                    className="flex-1 outline-none text-sm text-navy bg-transparent placeholder-gray-400"
                  />
                </div>
                <Link href={`/buscar${search ? `?q=${encodeURIComponent(search)}` : ''}`}
                  className="btn-primary shrink-0 py-2 text-sm">
                  Buscar escolas
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/buscar" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors">
                  <MapPin size={14} /> Perto de mim
                </Link>
                <Link href="/avaliar" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors">
                  <Star size={14} /> Quero avaliar uma escola
                </Link>
              </div>
            </div>

            {/* Right: demo school card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="badge bg-navy/10 text-navy text-xs">Particular</span>
                      <span className="badge bg-blue-100 text-blue-700 text-xs">♿ Autismo-Friendly</span>
                    </div>
                    <h3 className="font-bold text-navy text-base">Colégio Santos Dumont</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> Pinheiros, São Paulo – SP
                      <span className="text-coral font-medium ml-1">· 1.2 km</span>
                    </p>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-cream-card">
                    <Heart size={16} className="text-gray-300" />
                  </button>
                </div>

                {/* Rating + price row */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-black text-xl text-navy">4.7</span>
                  </div>
                  <span className="text-xs text-gray-500">128 avaliações</span>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400">Mensalidade</p>
                    <p className="font-bold text-navy">R$ 2.800<span className="text-xs font-normal text-gray-400">/mês</span></p>
                  </div>
                </div>

                {/* Category bars */}
                <div className="space-y-2 mb-4">
                  {DEMO_CATEGORIES.map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-28 shrink-0">{c.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-coral h-1.5 rounded-full" style={{ width: `${(c.value / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-navy w-5 text-right">{c.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link href="/escola/1" className="flex-1 btn-primary text-center text-sm py-2.5">Ver perfil</Link>
                  <button className="px-4 border-2 border-gray-100 rounded-xl hover:border-coral/30 transition-colors">
                    <Heart size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 text-xs font-bold text-navy hidden lg:block">
                ✓ Avaliação verificada
              </div>
              <div className="absolute -bottom-4 -left-4 bg-coral text-white rounded-2xl shadow-lg px-4 py-2 text-xs font-bold hidden lg:block">
                128 pais avaliaram
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────── */}
        <section className="bg-cream-card border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '50.000+', label: 'Escolas cadastradas' },
              { value: '200.000+', label: 'Avaliações publicadas' },
              { value: '500+', label: 'Cidades cobertas' },
              { value: '4.2★', label: 'Nota média da plataforma' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-navy">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA ──────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black text-navy mb-3">Como funciona</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Três passos simples para encontrar a escola certa para seu filho.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <div key={s.title} className="text-center">
                  <div className="w-16 h-16 bg-coral/10 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                    <s.icon size={28} className="text-coral" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-navy text-white text-xs font-black rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA CADA AUDIÊNCIA ────────────────────────────────── */}
        <section id="para-pais" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black text-navy mb-3">Uma plataforma para todos</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Pais, profissionais e escolas em um único ecossistema de inteligência educacional.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AUDIENCES.map(a => {
                const colorMap: Record<string, string> = {
                  coral: 'bg-coral/10 text-coral', blue: 'bg-blue-100 text-blue-700', navy: 'bg-navy/10 text-navy',
                };
                const btnMap: Record<string, string> = {
                  coral: 'bg-coral text-white hover:bg-coral-dark', blue: 'bg-blue-600 text-white hover:bg-blue-700', navy: 'bg-navy text-white hover:bg-navy-dark',
                };
                return (
                  <div key={a.title} className="card border border-gray-100">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${colorMap[a.color]}`}>
                      <a.icon size={22} />
                    </div>
                    <h3 className="font-bold text-navy text-lg mb-4">{a.title}</h3>
                    <ul className="space-y-2 mb-6">
                      {a.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href={a.href}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all ${btnMap[a.color]}`}>
                      {a.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ────────────────────────────────────────── */}
        <section className="py-10 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-4 items-start">
            <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Informação importante:</strong> As informações publicadas na Avali são fornecidas por usuários da plataforma e podem variar conforme unidade, período, série, condições comerciais e política interna de cada escola. A Avali não substitui uma proposta oficial da instituição de ensino. Sempre consulte diretamente a escola antes de tomar decisões.
            </p>
          </div>
        </section>

        {/* ── PLANOS ────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black text-navy mb-3">Planos simples e transparentes</h2>
              <p className="text-gray-500">Comece gratuitamente. Evolua quando precisar.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PLANS.map((p, i) => (
                <div key={p.name} className={`card text-center ${i === 1 ? 'ring-2 ring-navy scale-105' : ''}`}>
                  {i === 1 && (
                    <span className="badge bg-navy text-white text-xs mb-3 mx-auto">Mais popular</span>
                  )}
                  <h3 className="font-bold text-navy text-lg mb-2">{p.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-navy">{p.price}</span>
                    <span className="text-gray-500 text-sm">{p.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-left">
                    {p.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/precos" className={`w-full py-2.5 rounded-xl font-bold text-sm block text-center transition-all ${i === 1 ? 'btn-primary' : 'btn-secondary text-sm'}`}>
                    Começar agora
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-sm text-gray-500">
              <Link href="/precos" className="text-coral font-bold hover:underline">Ver comparativo completo dos planos →</Link>
            </p>
          </div>
        </section>

        {/* ── LGPD / PRIVACIDADE ────────────────────────────────── */}
        <section className="py-14 bg-navy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            {[
              { icon: Shield, title: 'Privacy by design', desc: 'Construída com LGPD desde o primeiro dia. Dados pessoais protegidos por padrão.' },
              { icon: CheckCircle, title: 'Anonimato garantido', desc: 'Avaliações anônimas são realmente protegidas. Escolas nunca veem quem avaliou.' },
              { icon: BookOpen, title: 'Transparência total', desc: 'Política clara, consentimento explícito e canal dedicado para seus direitos LGPD.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={22} className="text-coral" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────── */}
        <section className="py-20 bg-cream text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-black text-navy mb-4">Pronto para encontrar a escola certa?</h2>
            <p className="text-gray-500 mb-8">Junte-se a milhares de famílias que já usam a Avali para decidir melhor.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/buscar" className="btn-primary text-base px-8 py-3">Buscar escolas agora</Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-3">Criar conta grátis</Link>
            </div>
            <p className="text-xs text-gray-400 mt-6">Sem cartão de crédito. Crie sua conta em 30 segundos com Google.</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
