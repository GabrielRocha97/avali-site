import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function adminSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
}

async function checkOTP(phone: string, code: string) {
  const sid = process.env.TWILIO_VERIFY_SID;
  const creds = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const res = await fetch(`https://verify.twilio.com/v2/Services/${sid}/VerificationChecks`, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: phone, Code: code }),
  });
  const data = await res.json();
  return data.status === 'approved';
}

export async function POST(req: Request) {
  const { phone, code } = await req.json();
  if (!phone || !code) {
    return NextResponse.json({ error: 'Telefone e código são obrigatórios.' }, { status: 400 });
  }

  const approved = await checkOTP(phone, code);
  if (!approved) {
    return NextResponse.json({ error: 'Código inválido ou expirado.' }, { status: 400 });
  }

  const { error } = await adminSb().from('profiles').update({ phone_verified: true }).eq('phone', phone);
  if (error) return NextResponse.json({ error: 'Erro ao confirmar.' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
