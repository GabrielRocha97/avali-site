import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'Avali — Encontre a escola certa', template: '%s | Avali' },
  description: 'A Avali centraliza avaliações, valores, estrutura, localização e experiências reais sobre escolas em todo o Brasil.',
  keywords: ['escola', 'avaliação escola', 'mensalidade escola', 'escola particular', 'escola pública', 'autismo escola'],
  openGraph: {
    title: 'Avali — Encontre a escola certa',
    description: 'Avaliações reais de pais sobre escolas em todo o Brasil.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased"><Providers>{children}</Providers></body>
    </html>
  );
}
