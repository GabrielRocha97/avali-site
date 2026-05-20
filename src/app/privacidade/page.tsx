import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Política de Privacidade · Avali' };

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-black text-navy mb-2">Política de Privacidade</h1>
          <p className="text-gray-400 text-sm mb-2">Última atualização: 1º de janeiro de 2024</p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-10">
            <p className="text-sm text-blue-800 font-semibold">A Avali é construída com privacidade por design.</p>
            <p className="text-xs text-blue-700 mt-1">Sua identidade nunca é revelada a escolas avaliadas. Você controla sua privacidade.</p>
          </div>

          <div className="space-y-8">

            <Section title="1. Quem Somos">
              <p>A Avali é uma plataforma de avaliação e comparação de escolas operada no Brasil. Esta Política
              de Privacidade explica como coletamos, usamos e protegemos seus dados pessoais, em conformidade
              com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
            </Section>

            <Section title="2. Dados que Coletamos">
              <p><strong className="text-navy">Dados fornecidos por você:</strong></p>
              <ul>
                <li>Nome, e-mail e foto de perfil (via cadastro ou Google OAuth);</li>
                <li>Tipo de usuário (pai/responsável, profissional ou escola);</li>
                <li>Avaliações, comentários e conteúdo publicado;</li>
                <li>Informações sobre o filho (série, necessidades especiais) — opcional, para personalizar busca;</li>
                <li>Documentos comprobatórios (boletos, propostas) — apenas se você enviar, para fins de moderação.</li>
              </ul>
              <p><strong className="text-navy">Dados coletados automaticamente:</strong></p>
              <ul>
                <li>Endereço IP, tipo de dispositivo, navegador e sistema operacional;</li>
                <li>Páginas visitadas, tempo de sessão e interações na plataforma;</li>
                <li>Localização aproximada (baseada no IP, não GPS).</li>
              </ul>
            </Section>

            <Section title="3. Como Usamos seus Dados">
              <ul>
                <li>Fornecer e personalizar o Serviço;</li>
                <li>Processar avaliações e moderar conteúdo;</li>
                <li>Enviar notificações sobre suas avaliações e atividade;</li>
                <li>Melhorar a plataforma e desenvolver novos recursos;</li>
                <li>Cumprir obrigações legais e prevenir fraudes;</li>
                <li>Comunicações sobre planos e cobranças (usuários pagantes).</li>
              </ul>
            </Section>

            <Section title="4. Avaliações Anônimas — Proteção Especial">
              <p>Quando você publica uma avaliação como anônima:</p>
              <ul>
                <li>Seu nome <strong>nunca</strong> é exibido publicamente;</li>
                <li>A escola avaliada <strong>nunca</strong> recebe sua identidade;</li>
                <li>Visualizamos apenas dados agregados (nota, tendências) — não dados individuais;</li>
                <li>Mantemos dados de auditoria internos <strong>apenas</strong> para segurança e moderação — esses dados são acessados apenas em casos de denúncia comprovada de abuso;</li>
                <li>Esses dados de auditoria <strong>jamais</strong> são vendidos ou compartilhados comercialmente.</li>
              </ul>
            </Section>

            <Section title="5. Compartilhamento de Dados">
              <p>Não vendemos seus dados pessoais. Podemos compartilhar dados com:</p>
              <ul>
                <li><strong className="text-navy">Parceiros de pagamento</strong> (processamento de assinaturas);</li>
                <li><strong className="text-navy">Provedores de infraestrutura</strong> (hospedagem, CDN);</li>
                <li><strong className="text-navy">Autoridades competentes</strong> quando exigido por lei ou ordem judicial.</li>
              </ul>
              <p>Todos os parceiros estão sujeitos a acordos de confidencialidade compatíveis com a LGPD.</p>
            </Section>

            <Section title="6. Seus Direitos (LGPD)">
              <p>Você tem o direito de:</p>
              <ul>
                <li>Acessar seus dados pessoais armazenados;</li>
                <li>Corrigir dados incorretos ou desatualizados;</li>
                <li>Solicitar a exclusão dos seus dados ("direito ao esquecimento");</li>
                <li>Portabilidade dos seus dados;</li>
                <li>Revogar consentimentos anteriores;</li>
                <li>Opor-se ao tratamento de dados.</li>
              </ul>
              <p>Para exercer esses direitos: <a href="mailto:privacidade@avali.com.br" className="text-coral font-semibold hover:underline">privacidade@avali.com.br</a></p>
            </Section>

            <Section title="7. Retenção de Dados">
              <p>Mantemos seus dados pelo tempo necessário para fornecer o Serviço e cumprir obrigações legais.
              Ao excluir sua conta, seus dados pessoais são removidos em até 30 dias, exceto dados de auditoria
              de moderação, retidos por até 12 meses para segurança da comunidade.</p>
            </Section>

            <Section title="8. Segurança">
              <p>Utilizamos criptografia em trânsito (TLS) e em repouso, controle de acesso baseado em funções,
              e auditorias periódicas de segurança. Em caso de incidente, notificaremos a ANPD e os usuários
              afetados conforme exigido pela LGPD.</p>
            </Section>

            <Section title="9. Cookies">
              <p>Utilizamos cookies essenciais (autenticação, sessão) e cookies analíticos (com seu consentimento).
              Veja nossa <a href="/cookies" className="text-coral font-semibold hover:underline">Política de Cookies</a> para detalhes.</p>
            </Section>

            <Section title="10. Contato e DPO">
              <p>Encarregado de Proteção de Dados (DPO):{' '}
                <a href="mailto:privacidade@avali.com.br" className="text-coral font-semibold hover:underline">
                  privacidade@avali.com.br
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-black text-navy mb-3">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
