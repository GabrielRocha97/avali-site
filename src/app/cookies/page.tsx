import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Política de Cookies · Avali' };

const COOKIE_TABLE = [
  { name: 'avali_session', type: 'Essencial', purpose: 'Manter sua sessão ativa', duration: 'Sessão', canOpt: false },
  { name: 'avali_auth', type: 'Essencial', purpose: 'Autenticação segura', duration: '30 dias', canOpt: false },
  { name: 'avali_consent', type: 'Essencial', purpose: 'Registrar suas preferências de cookies', duration: '1 ano', canOpt: false },
  { name: '_ga', type: 'Analítico', purpose: 'Google Analytics — medir uso da plataforma (dados anonimizados)', duration: '2 anos', canOpt: true },
  { name: '_ga_*', type: 'Analítico', purpose: 'Google Analytics — identificar sessões', duration: '2 anos', canOpt: true },
];

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-black text-navy mb-2">Política de Cookies</h1>
          <p className="text-gray-400 text-sm mb-10">Última atualização: 1º de janeiro de 2024</p>

          <div className="space-y-8">

            <section>
              <h2 className="text-lg font-black text-navy mb-3">O que são cookies?</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site.
                Eles permitem que a plataforma lembre suas preferências e melhore sua experiência.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-navy mb-3">Tipos de cookies que usamos</h2>

              <div className="space-y-4">
                <div className="card border-l-4 border-l-green-500">
                  <h3 className="font-bold text-navy text-sm mb-1">Cookies Essenciais</h3>
                  <p className="text-xs text-gray-500">Necessários para o funcionamento básico da plataforma.
                  Não podem ser desativados pois comprometem funções como login e segurança.</p>
                </div>
                <div className="card border-l-4 border-l-blue-400">
                  <h3 className="font-bold text-navy text-sm mb-1">Cookies Analíticos</h3>
                  <p className="text-xs text-gray-500">Coletados com seu consentimento. Nos ajudam a entender
                  como a plataforma é usada para melhorá-la. Todos os dados são anonimizados antes do processamento.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-navy mb-4">Detalhamento dos cookies</h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-cream-card">
                      <th className="text-left text-navy font-bold px-4 py-3">Nome</th>
                      <th className="text-left text-navy font-bold px-4 py-3">Tipo</th>
                      <th className="text-left text-navy font-bold px-4 py-3">Finalidade</th>
                      <th className="text-left text-navy font-bold px-4 py-3">Duração</th>
                      <th className="text-left text-navy font-bold px-4 py-3">Opcional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIE_TABLE.map((row, i) => (
                      <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-cream/30'}>
                        <td className="px-4 py-3 font-mono text-navy">{row.name}</td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${row.type === 'Essencial' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{row.purpose}</td>
                        <td className="px-4 py-3 text-gray-500">{row.duration}</td>
                        <td className="px-4 py-3 text-center">{row.canOpt ? '✓' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-navy mb-3">Gerenciar suas preferências</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Você pode gerenciar cookies analíticos a qualquer momento. Cookies essenciais não podem
                ser desativados pois são necessários para o funcionamento da plataforma.
              </p>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy text-sm">Cookies analíticos</p>
                    <p className="text-xs text-gray-500">Google Analytics anonimizado</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-coral/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral" />
                  </label>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-navy mb-3">Como desativar cookies no navegador</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Você também pode desativar cookies diretamente nas configurações do seu navegador.
                Observe que desativar cookies essenciais pode impedir o funcionamento correto do login e de
                outras funções de segurança.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Chrome', 'Firefox', 'Safari', 'Edge'].map(b => (
                  <span key={b} className="badge bg-cream-card text-navy">{b}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-navy mb-3">Contato</h2>
              <p className="text-gray-600 text-sm">
                Dúvidas:{' '}
                <a href="mailto:privacidade@avali.com.br" className="text-coral font-semibold hover:underline">
                  privacidade@avali.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
