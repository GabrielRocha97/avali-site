'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';

const Logo = () => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center gap-2 mb-2">
      <svg viewBox="0 0 100 108" className="w-10 h-11">
        <rect x="4" y="4" width="86" height="83" rx="20" fill="#FFF0E5"/>
        <rect x="10" y="69" width="37" height="16" rx="3" fill="#1B2D5B"/>
        <rect x="53" y="69" width="37" height="16" rx="3" fill="#1B2D5B"/>
        <rect x="45" y="66" width="10" height="20" rx="2" fill="#E8694A" opacity="0.75"/>
        <rect x="13" y="50" width="13" height="19" rx="3.5" fill="#E8694A"/>
        <rect x="34" y="36" width="13" height="33" rx="3.5" fill="#E8694A"/>
        <rect x="55" y="21" width="13" height="48" rx="3.5" fill="#E8694A"/>
        <path d="M14,31 L24,40 L46,15" stroke="#1B2D5B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M64,87 L81,107 L81,87 Z" fill="#E8694A"/>
      </svg>
      <span className="font-black text-2xl text-navy">aval<span className="text-coral">i</span></span>
    </div>
    <p className="text-gray-500 text-sm">Central de inteligência educacional</p>
  </div>
);

const GoogleButton = ({ loading, onClick }: { loading: boolean; onClick: () => void }) => (
  <button onClick={onClick} disabled={loading}
    className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-bold text-navy hover:bg-gray-50 transition-all disabled:opacity-60">
    {loading
      ? <Loader2 size={18} className="animate-spin" />
      : <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
    }
    Continuar com Google
  </button>
);

const Divider = () => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
    <div className="relative text-center text-xs text-gray-400 bg-white px-3 mx-auto w-fit">ou</div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'entrar' | 'criar'>('entrar');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  const [googleLoading, setGoogleLoading] = useState(false);

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
  }

  function toE164(formatted: string) {
    const digits = formatted.replace(/\D/g, '');
    return `+55${digits}`;
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard/pais' });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const result = await signIn('credentials', {
      email: loginEmail, password: loginPassword, redirect: false,
    });
    setLoginLoading(false);
    if (result?.error) {
      setLoginError('E-mail ou senha incorretos, ou conta não verificada.');
    } else {
      router.push('/dashboard/pais');
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    const phone = toE164(regPhone);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, phone }),
    });
    const data = await res.json();
    setRegLoading(false);

    if (!res.ok) { setRegError(data.error); return; }

    // Store credentials temporarily for auto-login after phone verification
    sessionStorage.setItem('reg_email', regEmail);
    sessionStorage.setItem('reg_password', regPassword);
    router.push(`/verificar?phone=${encodeURIComponent(phone)}`);
  }

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Logo />

          <div className="card">
            {/* Tabs */}
            <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
              {(['entrar', 'criar'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${tab === t ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
                  {t === 'entrar' ? 'Entrar' : 'Criar conta'}
                </button>
              ))}
            </div>

            {tab === 'entrar' ? (
              <>
                <GoogleButton loading={googleLoading} onClick={handleGoogleSignIn} />
                <Divider />
                <form onSubmit={handleLogin} className="space-y-3">
                  <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    placeholder="E-mail" type="email" required className="input" />
                  <div className="relative">
                    <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Senha" type={showLoginPw ? 'text' : 'password'} required className="input pr-10" />
                    <button type="button" onClick={() => setShowLoginPw(!showLoginPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
                  <button type="submit" disabled={loginLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    {loginLoading && <Loader2 size={15} className="animate-spin" />}
                    Entrar
                  </button>
                </form>
              </>
            ) : (
              <>
                <GoogleButton loading={googleLoading} onClick={handleGoogleSignIn} />
                <Divider />
                <form onSubmit={handleRegister} className="space-y-3">
                  <input value={regName} onChange={e => setRegName(e.target.value)}
                    placeholder="Nome completo" type="text" required className="input" />
                  <input value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    placeholder="E-mail" type="email" required className="input" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">🇧🇷</span>
                    <input value={regPhone}
                      onChange={e => setRegPhone(formatPhone(e.target.value))}
                      placeholder="(11) 99999-9999" type="tel" required
                      className="input pl-9" maxLength={15} />
                  </div>
                  <div className="relative">
                    <input value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="Senha (mín. 8 caracteres)" type={showRegPw ? 'text' : 'password'}
                      required minLength={8} className="input pr-10" />
                    <button type="button" onClick={() => setShowRegPw(!showRegPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {regError && <p className="text-red-500 text-xs">{regError}</p>}
                  <button type="submit" disabled={regLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    {regLoading && <Loader2 size={15} className="animate-spin" />}
                    {regLoading ? 'Criando conta...' : 'Criar conta e verificar celular'}
                  </button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Vamos enviar um SMS para confirmar seu número
                </p>
              </>
            )}

            <p className="text-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
              Ao continuar, você aceita os{' '}
              <Link href="/termos" className="underline">Termos de Uso</Link> e a{' '}
              <Link href="/privacidade" className="underline">Política de Privacidade</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
