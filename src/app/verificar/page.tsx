'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Header from '@/components/Header';
import { CheckCircle, Loader2 } from 'lucide-react';

function VerificarContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get('phone') ?? '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  function handleDigit(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  async function handleVerify() {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/verify-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: fullCode }),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error); setLoading(false); return; }

    // Auto sign-in with stored credentials
    const email = sessionStorage.getItem('reg_email');
    const password = sessionStorage.getItem('reg_password');
    if (email && password) {
      const result = await signIn('credentials', { email, password, redirect: false });
      sessionStorage.removeItem('reg_email');
      sessionStorage.removeItem('reg_password');
      if (result?.ok) { router.push('/dashboard/pais'); return; }
    }
    router.push('/login');
  }

  async function handleResend() {
    setResending(true);
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, resend: true }),
    });
    setResending(false);
  }

  const phoneDisplay = phone.replace(/(\+55)(\d{2})(\d{5})(\d{4})/, '$1 ($2) $3-$4');

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-coral/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h1 className="font-black text-2xl text-navy mb-2">Verifique seu celular</h1>
            <p className="text-sm text-gray-500">
              Enviamos um código de 6 dígitos para<br />
              <strong className="text-navy">{phoneDisplay || phone}</strong>
            </p>
          </div>

          <div className="card">
            <div className="flex gap-2 justify-center mb-6">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el; }}
                  value={d}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-12 h-14 text-center text-2xl font-black border-2 border-gray-200 rounded-xl
                    focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 text-navy transition-all"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || code.join('').length < 6}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {loading ? 'Verificando...' : 'Confirmar código'}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-coral font-semibold hover:underline disabled:opacity-50">
                {resending ? 'Enviando...' : 'Reenviar código'}
              </button>
              <p className="text-xs text-gray-400 mt-1">O código expira em 10 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function VerificarPage() {
  return (
    <Suspense>
      <VerificarContent />
    </Suspense>
  );
}
