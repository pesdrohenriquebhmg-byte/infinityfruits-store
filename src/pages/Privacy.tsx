import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar</span>
        </Link>
        <h1 className="font-display text-sm font-bold ml-auto">POLÍTICA DE PRIVACIDADE</h1>
      </div>
    </div>

    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <h2 className="font-display text-2xl font-black mb-6">Política de Privacidade — Infinity Fruits</h2>
      <p className="text-muted-foreground text-sm mb-4">Última atualização: 09/05/2026</p>

      <section className="space-y-4 text-sm leading-relaxed text-foreground/90">
        <div>
          <h3 className="font-bold text-foreground mb-1">1. Dados coletados</h3>
          <p>Coletamos apenas o necessário para processar seu pedido: nome de usuário do Roblox, e-mail, número de WhatsApp e dados do pagamento PIX (gerados pelo gateway).</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">2. Uso dos dados</h3>
          <p>Utilizamos seus dados exclusivamente para: confirmar o pagamento, entregar o produto, prestar suporte e enviar atualizações sobre seu pedido. Nunca compartilhamos com terceiros para fins de marketing.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">3. Armazenamento</h3>
          <p>Os dados ficam armazenados em servidores seguros (Lovable Cloud) com criptografia em trânsito (HTTPS) e em repouso. O acesso é restrito à equipe da Infinity Fruits.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">4. Cookies</h3>
          <p>Usamos apenas cookies essenciais (carrinho, sessão). Não fazemos rastreamento publicitário.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">5. Seus direitos (LGPD)</h3>
          <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo nosso WhatsApp.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">6. Contato</h3>
          <p>Dúvidas sobre privacidade: WhatsApp e Discord no rodapé do site.</p>
        </div>
      </section>
    </article>
  </div>
);

export default Privacy;
