'use client';
import Link from 'next/link';
import { Star, MessageSquare, Lock } from 'lucide-react';
import type { Review } from '@/lib/types';

interface Props {
  reviews: Review[];
  schoolId: string;
  schoolName: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export default function ReviewsSection({ reviews, schoolId, schoolName, isLoggedIn, isAdmin }: Props) {
  const avaliarHref = `/avaliar?schoolId=${schoolId}&schoolName=${encodeURIComponent(schoolName)}`;

  if (!isLoggedIn) {
    return (
      <div className="card">
        <h2 className="font-bold text-navy text-lg flex items-center gap-2 mb-5">
          <MessageSquare size={20} className="text-coral" /> Avaliações dos pais
        </h2>
        <div className="relative">
          <div className="space-y-4 blur-sm pointer-events-none select-none" aria-hidden>
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
            <Lock size={28} className="text-navy mb-3" />
            <p className="font-black text-navy text-base mb-1">Faça login para ver as avaliações</p>
            <p className="text-sm text-gray-500 mb-4 text-center px-4">
              Crie sua conta gratuita e acesse avaliações reais de outros pais.
            </p>
            <Link href="/login" className="btn-primary text-sm">Criar conta grátis</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-navy text-lg flex items-center gap-2">
          <MessageSquare size={20} className="text-coral" /> Avaliações dos pais
        </h2>
        <Link href={avaliarHref} className="text-sm font-bold text-coral hover:underline">+ Avaliar</Link>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhuma avaliação ainda</p>
          <p className="text-sm mt-1">Seja o primeiro a avaliar esta escola</p>
          <Link href={avaliarHref} className="btn-primary text-sm mt-4 inline-block">Avaliar agora</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-cream-card rounded-full flex items-center justify-center font-bold text-navy text-sm shrink-0">
                  {isAdmin && !r.isAnonymous ? r.authorName[0] : 'A'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-bold text-navy text-sm">
                      {isAdmin && !r.isAnonymous ? r.authorName : 'Avaliador verificado'}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {r.stage}{r.stage ? ' · ' : ''}{r.year}
                    {r.monthlyFee > 0 ? ` · R$ ${r.monthlyFee.toLocaleString('pt-BR')}/mês` : ''}
                  </p>
                </div>
              </div>
              {r.comment && <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.comment}</p>}
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
                {r.wouldRecommend && <span className="text-xs text-green-600 font-semibold">✓ Recomenda</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
