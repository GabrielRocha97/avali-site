import Link from 'next/link';

const LINKS = {
  Plataforma: [
    { label: 'Buscar escolas', href: '/buscar' },
    { label: 'Profissionais', href: '/profissionais' },
    { label: 'Avaliar escola', href: '/avaliar' },
    { label: 'Comparar escolas', href: '/buscar' },
  ],
  'Para Escolas': [
    { label: 'Planos e preços', href: '/precos' },
    { label: 'Reivindicar perfil', href: '/precos#escolas' },
    { label: 'Dashboard', href: '/dashboard/escola' },
    { label: 'Solicitar correção', href: '/correcao' },
  ],
  Suporte: [
    { label: 'Central de ajuda', href: '#' },
    { label: 'Canal de privacidade', href: '/privacidade#canal' },
    { label: 'Denunciar conteúdo', href: '/denuncia' },
    { label: 'Contato', href: '#' },
  ],
  Legal: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Política de Cookies', href: '/cookies' },
    { label: 'LGPD', href: '/privacidade#lgpd' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 100 108" className="w-8 h-9">
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
              <span className="font-black text-xl text-white">aval<span className="text-coral">i</span></span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Central de inteligência educacional para famílias brasileiras.
            </p>
            <p className="text-xs text-white/40 mt-4 font-semibold tracking-widest uppercase">
              AVALIE. COMPARE. ESCOLHA MELHOR.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-bold text-white/80 mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2025 Avali. Todos os direitos reservados.</p>
          <p className="text-center">
            Dados fornecidos por usuários. A Avali não substitui proposta oficial das instituições.
            Protegido pela LGPD (Lei 13.709/2018).
          </p>
        </div>
      </div>
    </footer>
  );
}
