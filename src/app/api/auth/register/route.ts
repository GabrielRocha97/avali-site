import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

function adminSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
}

async function sendOTP(phone: string) {
  const sid = process.env.TWILIO_VERIFY_SID;
  const creds = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const res = await fetch(`https://verify.twilio.com/v2/Services/${sid}/Verifications`, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: phone, Channel: 'sms' }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  const { name, email, password, phone } = await req.json();

  if (!name || !email || !password || !phone) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Senha deve ter pelo menos 8 caracteres.' }, { status: 400 });
  }

  const sb = adminSb();
  const { data: existing } = await sb.from('profiles').select('id').eq('email', email).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const { error } = await sb.from('profiles').insert({
    name, email, password_hash: hash, phone,
    provider: 'email', phone_verified: false, role: 'pai',
  });

  if (error) return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 });

  const sent = await sendOTP(phone);
  if (!sent) {
    await sb.from('profiles').delete().eq('email', email);
    return NextResponse.json({ error: 'Não foi possível enviar o SMS. Verifique o número.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
