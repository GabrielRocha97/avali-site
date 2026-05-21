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

async function getProfileId(email: string): Promise<string | null> {
  const { data } = await adminSb().from('profiles').select('id').eq('email', email).single();
  return data?.id ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([]);
  const profileId = await getProfileId(session.user.email);
  if (!profileId) return NextResponse.json([]);

  const { data } = await adminSb()
    .from('favorites')
    .select('school_id, school_name')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Login necessário' }, { status: 401 });
  const { schoolId, schoolName } = await req.json();
  const profileId = await getProfileId(session.user.email);
  if (!profileId) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });

  await adminSb().from('favorites').upsert(
    { profile_id: profileId, school_id: schoolId, school_name: schoolName ?? '' },
    { onConflict: 'profile_id,school_id' },
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Login necessário' }, { status: 401 });
  const { schoolId } = await req.json();
  const profileId = await getProfileId(session.user.email);
  if (!profileId) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });

  await adminSb().from('favorites').delete().eq('profile_id', profileId).eq('school_id', schoolId);
  return NextResponse.json({ ok: true });
}
