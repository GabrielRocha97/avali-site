'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

const PROFILES = [
  { id: 'pai', label: 'Pai ou responsável', desc: 'Buscar, avaliar e comparar escolas', icon: '👨‍👩‍👧' },
  { id: 'profissional', label: 'Profissional', desc: 'Criar perfil e aparecer nas buscas', icon: '🩺' },
  { id: 'escola', label: 'Escola', desc: 'Gerenciar perfil e ver métricas', icon: '🏫' },
];

const REDIRECT: Record<string, string> = {
  escola: '/dashboard/escola',
  profissional: '/dashboard/profissional',
  pai: '/dashboard/pais',
};

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'login' | 'profile'>('login');
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
  }

  function handleContinue() {
    if (!profile) return;
    router.push(REDIRECT[profile] ?? '/');
  }

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          {/* Logo */}
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

          <div className="card">
            {step === 'login' ? (
              <>
                <h2 className="text-xl font-black text-navy mb-2 text-center">Entrar na Avali</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Crie sua conta em 2 cliques com Google</p>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-bold text-navy hover:bg-gray-50 transition-all mb-4 disabled:opacity-60">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continuar com Google
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative text-center text-xs text-gray-400 bg-white px-3 mx-auto w-fit">ou</div>
                </div>

                <div className="space-y-3">
                  <input placeholder="E-mail" className="input" type="email" />
                  <input placeholder="Senha" className="input" type="password" />
                  <button onClick={() => setStep('profile')} className="btn-primary w-full">Entrar</button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Não tem conta?{' '}
                  <button onClick={() => setStep('profile')} className="text-coral font-bold">Criar agora</button>
                </p>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Ao continuar, você aceita os{' '}
                  <Link href="/termos" className="underline">Termos de Uso</Link> e a{' '}
                  <Link href="/privacidade" className="underline">Política de Privacidade</Link>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-black text-navy mb-2 text-center">Como você vai usar a Avali?</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Escolha seu perfil para personalizar a experiência</p>

                <div className="space-y-3 mb-6">
                  {PROFILES.map(p => (
                    <button key={p.id} onClick={() => setProfile(p.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                        ${profile === p.id ? 'border-coral bg-coral/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <p className="font-bold text-navy text-sm">{p.label}</p>
                        <p className="text-xs text-gray-500">{p.desc}</p>
                      </div>
                      {profile === p.id && <CheckCircle size={18} className="text-coral ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleContinue}
                  className={`btn-primary w-full text-center block ${!profile ? 'opacity-50 pointer-events-none' : ''}`}>
                  Continuar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
