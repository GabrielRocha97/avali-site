import Link from 'next/link';
import { CheckCircle, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PLANS = [
  {
    name: 'Gratuito', price: 'R$ 0', period: '', for: 'pais', popular: false,
    desc: 'Para começar a explorar a plataforma',
    features: [
      { label: 'Buscar escolas', ok: true },
      { label: 'Ver nota geral das escolas', ok: true },
      { label: 'Ver avaliações resumidas', ok: false },
      { label: 'Publicar avaliações', ok: false },
      { label: 'Comparar escolas', ok: false },
      { label: 'Salvar favoritas', ok: false },
    ],
    cta: 'Criar conta grátis', href: '/login', style: 'btn-secondary',
  },
  {
    name: 'Pais', price: 'R$ 10', period: '/mês', for: 'pais', popular: true,
    desc: 'Para famílias que querem decidir melhor',
    features: [
      { label: 'Buscar escolas', ok: true },
      { label: 'Ver nota geral das escolas', ok: true },
      { label: 'Ver avaliações completas', ok: true },
      { label: 'Publicar avaliações', ok: true },
      { label: 'Comparar até 3 escolas', ok: true },
      { label: 'Salvar favoritas', ok: true },
    ],
    cta: 'Assinar agora', href: '/login', style: 'btn-primary',
  },
  {
    name: 'Profissional', price: 'R$ 50', period: '/mês', for: 'profissional', popular: false,
    desc: 'Para profissionais da área de educação e saúde',
    features: [
      { label: 'Perfil profissional público', ok: true },
      { label: 'Aparecer nas buscas regionais', ok: true },
      { label: 'Receber contatos de pais', ok: true },
      { label: 'Dashboard de visualizações', ok: true },
      { label: 'Adicionar especialidades', ok: true },
      { label: 'Link para agendamento', ok: true },
    ],
    cta: 'Criar perfil', href: '/login', style: 'btn-secondary',
  },
];

const SCHOOL_PLANS = [
  {
    name: 'Escola Essencial', price: 'R$ 5.000', period: '/ano', popular: false,
    features: [
      'Reivindicação de perfil verificado',
      'Atualização de informações institucionais',
      'Galeria de fotos (até 20 fotos)',
      'Métricas básicas de reputação',
      'Resposta institucional a avaliações',
      'Suporte por e-mail',
    ],
  },
  {
    name: 'Escola Premium', price: 'R$ 10.000', period: '/ano', popular: true,
    features: [
      'Tudo do plano Essencial',
      'Dashboard avançado de reputação',
      'Comparativo com escolas da região',
      'Relatórios de interesse dos pais',
      'Insights estratégicos de melhoria',
      'Destaque no perfil e nas buscas',
      'Relatório mensal em PDF',
      'Suporte prioritário',
    ],
  },
];

export default function PrecosPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">

        {/* Hero */}
        <section className="bg-navy text-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl font-black mb-4">Planos simples e transparentes</h1>
            <p className="text-white/70 text-lg">Comece grátis. Evolua quando sua família ou escola precisar.</p>
          </div>
        </section>

        {/* Pais e Profissionais */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-navy text-center mb-3">Para pais e profissionais</h2>
            <p className="text-gray-500 text-center mb-10 text-sm">Planos mensais, cancele quando quiser.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map(plan => (
                <div key={plan.name} className={`card flex flex-col ${plan.popular ? 'ring-2 ring-coral shadow-card-hover' : ''}`}>
                  {plan.popular && (
                    <span className="badge bg-coral text-white mb-3 w-fit">⭐ Mais popular</span>
                  )}
                  <h3 className="font-black text-navy text-xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-navy">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f.label} className="flex items-center gap-2.5 text-sm">
                        {f.ok
                          ? <CheckCircle size={15} className="text-green-500 shrink-0" />
                          : <X size={15} className="text-gray-300 shrink-0" />}
                        <span className={f.ok ? 'text-navy' : 'text-gray-400'}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={`${plan.style} text-center text-sm`}>{plan.cta}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Escolas */}
        <section id="escolas" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-navy text-center mb-3">Para escolas</h2>
            <p className="text-gray-500 text-center mb-2 text-sm">Gerencie sua reputação e conecte-se com famílias que buscam ativamente.</p>
            <p className="text-xs text-gray-400 text-center mb-10">Planos anuais · Nota fiscal emitida</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {SCHOOL_PLANS.map(plan => (
                <div key={plan.name} className={`card flex flex-col ${plan.popular ? 'ring-2 ring-navy' : ''}`}>
                  {plan.popular && (
                    <span className="badge bg-navy text-white mb-3 w-fit">Recomendado</span>
                  )}
                  <h3 className="font-black text-navy text-xl mb-1">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-navy">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="text-navy">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className={plan.popular ? 'btn-primary text-center text-sm' : 'btn-secondary text-center text-sm'}>
                    Contratar plano
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">Dúvidas sobre os planos de escola?</p>
              <a href="mailto:escolas@avali.com.br" className="text-coral font-bold text-sm hover:underline">
                Fale com nossa equipe comercial →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-cream">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-navy text-center mb-10">Dúvidas frequentes</h2>
            <div className="space-y-4">
              {[
                { q: 'Posso cancelar a qualquer momento?', a: 'Sim. Planos mensais (pais e profissionais) podem ser cancelados a qualquer momento sem multa. O acesso permanece até o fim do período pago.' },
                { q: 'As avaliações são realmente anônimas?', a: 'Sim. Quando você escolhe publicar anonimamente, seu nome não aparece para nenhum usuário, incluindo a escola. Mantemos dados de auditoria internamente apenas para segurança e moderação.' },
                { q: 'A escola pode ver quem me avaliou?', a: 'Não. Escolas visualizam dados agregados, tendências e notas, mas nunca a identidade de avaliadores anônimos.' },
                { q: 'Como funciona o plano gratuito?', a: 'O plano gratuito permite buscar escolas e ver notas gerais. Para ver avaliações completas e publicar, assine o plano Pais por R$ 10/mês.' },
              ].map(item => (
                <div key={item.q} className="card">
                  <p className="font-bold text-navy mb-2 text-sm">{item.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
