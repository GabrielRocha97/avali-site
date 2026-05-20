'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const NAV = [
  { label: 'Início', href: '/' },
  { label: 'Escolas', href: '/buscar' },
  { label: 'Para Pais', href: '/#para-pais' },
  { label: 'Para Escolas', href: '/precos#escolas' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 100 108" className="w-8 h-9" aria-hidden>
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
          <span className="font-black text-xl tracking-tight text-navy">
            aval<span className="text-coral">i</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="btn-ghost text-sm">{n.label}</Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-cream-card animate-pulse" />
          ) : session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-cream-card transition-colors">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.[0] ?? 'U'}
                  </div>
                )}
                <span className="text-sm font-semibold text-navy max-w-[120px] truncate">
                  {session.user.name?.split(' ')[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <Link href="/dashboard/pais" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-cream-card transition-colors">
                    <LayoutDashboard size={15} /> Meu painel
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">Entrar</Link>
              <Link href="/login" className="btn-primary text-sm py-2">Criar conta</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl hover:bg-cream-card" onClick={() => setOpen(!open)}>
          {open ? <X size={22} className="text-navy" /> : <Menu size={22} className="text-navy" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-2">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl hover:bg-cream-card font-semibold text-navy text-sm">
              {n.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-2">
            {session?.user ? (
              <>
                <Link href="/dashboard/pais" onClick={() => setOpen(false)} className="btn-secondary text-center text-sm">
                  Meu painel
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost text-center text-sm text-red-500">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary text-center text-sm">Entrar</Link>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-primary text-center text-sm">Criar conta grátis</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
