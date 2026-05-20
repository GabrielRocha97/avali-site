'use client';
import Link from 'next/link';
import { Star, Eye, Users, TrendingUp, CheckCircle, Edit3, Phone, Globe, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PROFESSIONALS } from '@/lib/data';

const pro = PROFESSIONALS[0];

const STATS = [
  { label: 'Visualizações (30d)', value: '247', icon: Eye, color: 'text-blue-500' },
  { label: 'Contatos recebidos', value: '12', icon: Phone, color: 'text-coral' },
  { label: 'Avaliações', value: String(pro.reviewCount), icon: Star, color: 'text-amber-500' },
  { label: 'Nota média', value: pro.rating.toFixed(1), icon: TrendingUp, color: 'text-green-500' },
];

export default function DashboardProfissionalPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-navy mb-1">Olá, {pro.name.split(' ')[0]} 👋</h1>
              <p className="text-gray-500 text-sm">Painel do profissional · Plano <span className="text-coral font-bold">Profissional</span></p>
            </div>
            <Link href="#perfil" className="btn-primary text-sm flex items-center gap-2 w-fit">
              <Edit3 size={14} /> Editar perfil
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="card text-center">
                <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
                <p className="text-2xl font-black text-navy">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="lg:col-span-2 space-y-6">

              {/* Profile preview */}
              <div className="card" id="perfil">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-navy text-lg">Seu perfil público</h2>
                  <span className="badge bg-green-50 text-green-700 flex items-center gap-1">
                    <CheckCircle size={11} /> Ativo
                  </span>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-cream-card rounded-2xl flex items-center justify-center font-black text-navy text-xl shrink-0">
                    {pro.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-navy text-lg">{pro.name}</p>
                    <p className="text-coral font-semibold text-sm">{pro.specialty}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {pro.city}, {pro.state}
                    </p>
                    {pro.bio && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{pro.bio}</p>}
                    {pro.specialties && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {pro.specialties.map(s => (
                          <span key={s} className="badge bg-cream-card text-navy">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-5 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Telefone / WhatsApp</label>
                    <input defaultValue={pro.phone || ''} placeholder="(11) 99999-9999" className="input text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Site / agendamento</label>
                    <input defaultValue={pro.website || ''} placeholder="https://..." className="input text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">CRP / CRO / Registro</label>
                    <input defaultValue="" placeholder="CRP 06/00000" className="input text-sm" />
                  </div>
                </div>
                <button className="btn-primary text-sm mt-4">Salvar alterações</button>
              </div>

              {/* Reviews received */}
              <div className="card">
                <h2 className="font-black text-navy text-lg mb-4 flex items-center gap-2">
                  <Star size={18} className="text-amber-400" /> Avaliações recebidas
                </h2>
                <div className="text-center py-8 text-gray-400">
                  <Star size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Ainda sem avaliações de pais</p>
                  <p className="text-xs mt-1">Elas aparecerão aqui quando famílias avaliarem seu atendimento</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Plan */}
              <div className="card bg-navy text-white">
                <p className="text-xs text-white/60 mb-1">Seu plano</p>
                <p className="text-xl font-black mb-1">Profissional</p>
                <p className="text-sm text-white/70 mb-4">R$ 50/mês · Renova em 20/02/2024</p>
                <div className="space-y-2 text-sm text-white/80 mb-4">
                  {['Perfil público verificado', 'Aparecer nas buscas', 'Receber contatos de pais', 'Dashboard de visualizações'].map(f => (
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

              {/* Visibility tip */}
              <div className="card">
                <h3 className="font-bold text-navy mb-2 flex items-center gap-2">
                  <Users size={16} className="text-coral" /> Aumente sua visibilidade
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {[
                    { done: true, text: 'Perfil criado' },
                    { done: !!pro.bio, text: 'Bio adicionada' },
                    { done: !!pro.phone, text: 'Telefone cadastrado' },
                    { done: false, text: 'Foto de perfil' },
                    { done: false, text: '5 avaliações recebidas' },
                  ].map(item => (
                    <li key={item.text} className="flex items-center gap-2">
                      <CheckCircle size={13} className={item.done ? 'text-green-500' : 'text-gray-200'} />
                      <span className={item.done ? 'text-navy' : 'text-gray-400'}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Link */}
              <div className="card border-2 border-dashed border-coral/30">
                <h3 className="font-bold text-navy mb-2 flex items-center gap-2">
                  <Globe size={16} className="text-coral" /> Seu link público
                </h3>
                <p className="text-xs text-gray-500 mb-2 break-all font-mono">avali.com.br/profissionais/{pro.id}</p>
                <button className="btn-secondary text-sm w-full">Copiar link</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
