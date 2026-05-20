import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Termos de Uso · Avali' };

export default function TermosPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-black text-navy mb-2">Termos de Uso</h1>
          <p className="text-gray-400 text-sm mb-10">Última atualização: 1º de janeiro de 2024</p>

          <div className="space-y-8 prose-like">

            <Section title="1. Aceitação dos Termos">
              <p>Ao acessar ou usar a plataforma Avali ("Serviço"), você concorda com estes Termos de Uso. Se não concordar,
              não utilize o Serviço. Estes termos se aplicam a todos os usuários: pais/responsáveis, profissionais de
              educação e saúde, e instituições de ensino.</p>
            </Section>

            <Section title="2. Descrição do Serviço">
              <p>A Avali é uma plataforma de inteligência educacional que permite:</p>
              <ul>
                <li>Buscar e comparar escolas com base em avaliações de outros pais;</li>
                <li>Publicar avaliações anônimas ou identificadas sobre escolas;</li>
                <li>Identificar escolas com práticas inclusivas para crianças no espectro autista;</li>
                <li>Conectar famílias a profissionais de educação e saúde;</li>
                <li>Permitir que escolas gerenciem sua reputação e dados institucionais.</li>
              </ul>
            </Section>

            <Section title="3. Cadastro e Conta">
              <p>Para publicar avaliações ou acessar recursos premium, você precisa criar uma conta. Você é responsável
              por manter a confidencialidade das suas credenciais e por todas as atividades realizadas em sua conta.
              Informações fornecidas devem ser verdadeiras e atualizadas.</p>
            </Section>

            <Section title="4. Avaliações e Conteúdo do Usuário">
              <p>Ao publicar conteúdo (avaliações, comentários, informações), você declara que:</p>
              <ul>
                <li>Tem experiência direta com a escola ou serviço avaliado;</li>
                <li>O conteúdo é verdadeiro, preciso e não difamatório;</li>
                <li>Não viola direitos de terceiros;</li>
                <li>Não contém spam, publicidade não autorizada ou conteúdo ofensivo.</li>
              </ul>
              <p>A Avali reserva-se o direito de moderar, editar ou remover conteúdo que viole estas diretrizes.</p>
            </Section>

            <Section title="5. Anonimato e Privacidade">
              <p>A Avali oferece a opção de publicar avaliações anonimamente. Ao escolher esta opção, seu nome não
              será exibido publicamente nem revelado à escola avaliada. Para fins de segurança e moderação, mantemos
              dados de auditoria internos que permitem identificar o autor em casos de abuso comprovado, mas esses
              dados nunca são compartilhados comercialmente.</p>
            </Section>

            <Section title="6. Planos e Pagamentos">
              <p>Alguns recursos são oferecidos mediante assinatura paga. Planos mensais podem ser cancelados a
              qualquer momento, com acesso mantido até o fim do período pago. Planos anuais para escolas possuem
              condições específicas descritas no contrato. Preços podem ser alterados com aviso prévio de 30 dias.</p>
            </Section>

            <Section title="7. Limitação de Responsabilidade">
              <p>As informações publicadas na Avali são fornecidas por usuários e não foram verificadas
              independentemente. A Avali não garante a exatidão, completude ou atualidade das informações. A plataforma
              não substitui visitas presenciais ou propostas oficiais das instituições. O uso das informações é de
              responsabilidade do usuário.</p>
            </Section>

            <Section title="8. Propriedade Intelectual">
              <p>O conteúdo original da Avali (design, marca, software) é protegido por direitos autorais. Ao publicar
              conteúdo na plataforma, você concede à Avali uma licença não exclusiva para exibir, reproduzir e
              distribuir esse conteúdo no contexto do Serviço.</p>
            </Section>

            <Section title="9. Alterações nos Termos">
              <p>Podemos atualizar estes Termos periodicamente. Notificaremos usuários cadastrados sobre mudanças
              significativas por e-mail. O uso continuado do Serviço após a notificação constitui aceitação dos
              novos termos.</p>
            </Section>

            <Section title="10. Contato">
              <p>Dúvidas sobre estes Termos:{' '}
                <a href="mailto:legal@avali.com.br" className="text-coral font-semibold hover:underline">
                  legal@avali.com.br
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
