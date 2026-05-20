import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

function adminSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Faça login para enviar uma avaliação' }, { status: 401 });
  }

  const body = await req.json();
  const { schoolId, stage, year, overallRating, ratings, comment, pros, cons, wouldRecommend, isAnonymous, monthlyFee } = body;

  if (!overallRating || overallRating < 1 || overallRating > 5) {
    return NextResponse.json({ error: 'Nota geral obrigatória (1–5)' }, { status: 400 });
  }

  const sb = adminSb();
  const { data: profile } = await sb
    .from('profiles')
    .select('id, name')
    .eq('email', session.user.email)
    .single();

  const categories = Object.entries((ratings as Record<string, number>) || {}).map(
    ([label, value]) => ({ label, value }),
  );

  const { error } = await sb.from('reviews').insert({
    school_id: schoolId || null,
    profile_id: profile?.id ?? null,
    author_name: isAnonymous ? 'Anônimo' : (profile?.name ?? session.user.name ?? 'Usuário'),
    is_anonymous: isAnonymous ?? false,
    rating: overallRating,
    categories,
    comment: comment || '',
    pros: pros || '',
    cons: cons || '',
    would_recommend: wouldRecommend ?? true,
    monthly_fee: Number(monthlyFee) || 0,
    stage: stage || '',
    year: Number(year) || new Date().getFullYear(),
    status: 'published',
  });

  if (error) {
    console.error('[reviews POST]', error);
    return NextResponse.json({ error: 'Erro ao salvar avaliação' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
