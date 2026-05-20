'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Star, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Upload, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CATEGORIES = [
  { id: 'atendimento', label: 'Atendimento aos pais', desc: 'Como a escola se comunica e atende as demandas dos pais' },
  { id: 'pedagogia', label: 'Qualidade pedagógica', desc: 'Qualidade do ensino, metodologia e preparo dos professores' },
  { id: 'estrutura', label: 'Estrutura física', desc: 'Instalações, espaços, salas de aula e áreas de lazer' },
  { id: 'seguranca', label: 'Segurança', desc: 'Portaria, câmeras, controle de acesso e ambiente seguro' },
  { id: 'comunicacao', label: 'Comunicação', desc: 'Frequência e clareza das comunicações com os responsáveis' },
  { id: 'inclusao', label: 'Inclusão', desc: 'Suporte a alunos com necessidades especiais e diversidade' },
  { id: 'custo', label: 'Custo-benefício', desc: 'Relação entre mensalidade e qualidade oferecida' },
  { id: 'alimentacao', label: 'Alimentação', desc: 'Qualidade, variedade e cuidado com a merenda ou cantina' },
  { id: 'atividades', label: 'Atividades extracurriculares', desc: 'Esporte, arte, cultura e atividades complementares' },
];

const STAGES = ['Ed. Infantil', 'Fundamental I', 'Fundamental II', 'Ensino Médio', 'Técnico'];
const YEARS = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

interface RatingState { [key: string]: number }

const STEPS = [
  { label: 'Escola', num: 1 },
  { label: 'Notas', num: 2 },
  { label: 'Comentário', num: 3 },
  { label: 'Dados', num: 4 },
  { label: 'Confirmar', num: 5 },
];

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(v => (
        <button key={v} type="button" onClick={() => onChange(v)} className="transition-transform hover:scale-110">
          <Star size={24} className={v <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
        </button>
      ))}
    </div>
  );
}

function AvaliarContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    schoolId: params.get('schoolId') ?? '',
    schoolName: params.get('schoolName') ?? '',
    city: '', unit: '', stage: '', year: '',
    monthlyFee: '', enrollment: '', material: '', meals: '',
    overallRating: 0, ratings: {} as RatingState,
    comment: '', pros: '', cons: '', wouldRecommend: true,
    isAnonymous: false, acceptTerms: false, confirmTruth: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key: string, val: unknown) => setData(d => ({ ...d, [key]: val }));
  const setRating = (key: string, val: number) => setData(d => ({ ...d, ratings: { ...d.ratings, [key]: val } }));

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolId: data.schoolId,
        stage: data.stage,
        year: data.year,
        overallRating: data.overallRating,
        ratings: data.ratings,
        comment: data.comment,
        pros: data.pros,
        cons: data.cons,
        wouldRecommend: data.wouldRecommend,
        isAnonymous: data.isAnonymous,
        monthlyFee: data.monthlyFee,
      }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
        return;
      }
      setSubmitError(json.error ?? 'Erro ao enviar avaliação');
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Header />
        <div className="pt-16 min-h-screen bg-cream flex items-center justify-center">
          <div className="card text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-navy mb-2">Avaliação enviada!</h2>
            <p className="text-gray-500 mb-6">
              Obrigado por contribuir com a comunidade Avali. Sua avaliação já está publicada no perfil da escola.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {data.schoolId && (
                <a href={`/escola/${data.schoolId}`} className="btn-primary text-sm">Ver avaliações da escola</a>
              )}
              <a href="/buscar" className="btn-secondary text-sm">Buscar outras escolas</a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center gap-1 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                    ${step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-coral text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > s.num ? <CheckCircle size={14} /> : s.num}
                  </div>
                  <span className={`text-xs hidden sm:block ${step === s.num ? 'text-navy font-bold' : 'text-gray-400'}`}>{s.label}</span>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${step > s.num ? 'bg-green-400' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="card">

            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-1">Qual escola você quer avaliar?</h2>
                <p className="text-sm text-gray-500 mb-6">Busque pelo nome ou informe os dados manualmente.</p>
                <div className="space-y-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input value={data.schoolName} onChange={e => set('schoolName', e.target.value)}
                      placeholder="Nome da escola..." className="input pl-10" />
                  </div>
                  <input value={data.city} onChange={e => set('city', e.target.value)}
                    placeholder="Cidade" className="input" />
                  <input value={data.unit} onChange={e => set('unit', e.target.value)}
                    placeholder="Unidade (se houver)" className="input" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={data.stage} onChange={e => set('stage', e.target.value)} className="input">
                      <option value="">Etapa do aluno</option>
                      {STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select value={data.year} onChange={e => set('year', e.target.value)} className="input">
                      <option value="">Ano da experiência</option>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-1">Como você avalia esta escola?</h2>
                <p className="text-sm text-gray-500 mb-4">Dê uma nota de 1 a 5 estrelas para cada critério.</p>
                <div className="mb-6 p-4 bg-cream-card rounded-2xl">
                  <p className="font-bold text-navy text-sm mb-2">Nota geral</p>
                  <StarInput value={data.overallRating} onChange={v => set('overallRating', v)} />
                </div>
                <div className="space-y-4">
                  {CATEGORIES.map(c => (
                    <div key={c.id} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-navy text-sm">{c.label}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                      </div>
                      <StarInput value={data.ratings[c.id] || 0} onChange={v => setRating(c.id, v)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-1">Conte sua experiência</h2>
                <p className="text-sm text-gray-500 mb-6">Seja específico para ajudar outros pais a decidirem melhor.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-navy block mb-2">Comentário geral *</label>
                    <textarea value={data.comment} onChange={e => set('comment', e.target.value)}
                      rows={4} placeholder="Descreva sua experiência com a escola..." className="input resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-green-700 block mb-2">✓ Pontos positivos</label>
                    <textarea value={data.pros} onChange={e => set('pros', e.target.value)}
                      rows={2} placeholder="O que a escola faz muito bem?"
                      className="input resize-none border-green-200 focus:border-green-400" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-red-600 block mb-2">✗ Pontos negativos</label>
                    <textarea value={data.cons} onChange={e => set('cons', e.target.value)}
                      rows={2} placeholder="O que poderia melhorar?"
                      className="input resize-none border-red-200 focus:border-red-400" />
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-navy">Você recomendaria esta escola?</span>
                    <button onClick={() => set('wouldRecommend', true)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${data.wouldRecommend ? 'bg-green-100 border-green-400 text-green-700' : 'border-gray-200 text-gray-500'}`}>
                      Sim ✓
                    </button>
                    <button onClick={() => set('wouldRecommend', false)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${!data.wouldRecommend ? 'bg-red-100 border-red-400 text-red-600' : 'border-gray-200 text-gray-500'}`}>
                      Não ✗
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-1">Dados financeiros</h2>
                <p className="text-sm text-gray-500 mb-6">Ajude outros pais com informações sobre custos. Todos os campos são opcionais.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-1">Mensalidade</label>
                      <input value={data.monthlyFee} onChange={e => set('monthlyFee', e.target.value)}
                        placeholder="R$ 0,00" className="input" type="number" min="0" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-1">Matrícula</label>
                      <input value={data.enrollment} onChange={e => set('enrollment', e.target.value)}
                        placeholder="R$ 0,00" className="input" type="number" min="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-1">Material escolar</label>
                      <input value={data.material} onChange={e => set('material', e.target.value)}
                        placeholder="R$ 0,00" className="input" type="number" min="0" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-1">Alimentação/mês</label>
                      <input value={data.meals} onChange={e => set('meals', e.target.value)}
                        placeholder="R$ 0,00" className="input" type="number" min="0" />
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                    <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-navy mb-1">Enviar proposta da escola (opcional)</p>
                    <p className="text-xs text-gray-400">Dados pessoais serão removidos automaticamente antes da publicação</p>
                    <button className="text-xs text-coral font-bold mt-2 hover:underline">Selecionar PDF</button>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">Não envie documentos com dados pessoais de crianças ou responsáveis.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-xl font-black text-navy mb-1">Quase pronto!</h2>
                <p className="text-sm text-gray-500 mb-6">Revise suas configurações de privacidade e confirme o envio.</p>
                <div className="bg-cream-card rounded-2xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Escola</span>
                    <span className="font-semibold text-navy">{data.schoolName || '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Nota geral</span>
                    <span className="font-semibold text-navy">{data.overallRating}/5 ⭐</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Etapa</span>
                    <span className="font-semibold text-navy">{data.stage || '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mensalidade informada</span>
                    <span className="font-semibold text-navy">R$ {Number(data.monthlyFee || 0).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={data.isAnonymous} onChange={e => set('isAnonymous', e.target.checked)}
                      className="accent-coral mt-0.5 w-4 h-4" />
                    <div>
                      <p className="font-semibold text-navy text-sm">Publicar como anônimo</p>
                      <p className="text-xs text-gray-500">Seu nome não aparecerá na avaliação.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={data.acceptTerms} onChange={e => set('acceptTerms', e.target.checked)}
                      className="accent-coral mt-0.5 w-4 h-4" />
                    <p className="text-xs text-gray-500">
                      Li e aceito os <a href="/termos" className="text-coral font-bold">Termos de Uso</a> e a{' '}
                      <a href="/privacidade" className="text-coral font-bold">Política de Privacidade</a> da Avali.
                    </p>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={data.confirmTruth} onChange={e => set('confirmTruth', e.target.checked)}
                      className="accent-coral mt-0.5 w-4 h-4" />
                    <p className="text-xs text-gray-500">
                      Confirmo que as informações são verdadeiras e baseadas na minha experiência real com esta escola.
                    </p>
                  </label>
                </div>
                {submitError && <p className="text-red-500 text-sm mt-4">{submitError}</p>}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 btn-ghost text-sm">
                  <ChevronLeft size={16} /> Voltar
                </button>
              ) : <div />}
              {step < 5 ? (
                <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 btn-primary text-sm">
                  Continuar <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  disabled={!data.acceptTerms || !data.confirmTruth || submitting}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {submitting ? 'Enviando...' : 'Enviar avaliação'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function AvaliarPage() {
  return (
    <Suspense>
      <AvaliarContent />
    </Suspense>
  );
}
