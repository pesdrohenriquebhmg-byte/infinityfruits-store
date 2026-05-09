import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar</span>
        </Link>
        <h1 className="font-display text-sm font-bold ml-auto">TERMOS DE USO</h1>
      </div>
    </div>

    <article className="container mx-auto px-4 py-10 max-w-3xl prose prose-invert prose-sm">
      <h2 className="font-display text-2xl font-black mb-6">Termos de Uso — Infinity Fruits</h2>
      <p className="text-muted-foreground text-sm mb-4">Última atualização: 09/05/2026</p>

      <section className="space-y-4 text-sm leading-relaxed text-foreground/90">
        <div>
          <h3 className="font-bold text-foreground mb-1">1. Sobre a loja</h3>
          <p>A Infinity Fruits é uma loja independente de itens digitais (frutas, gamepasses e contas) para os jogos Blox Fruits e Sailor Piece, no Roblox. Não temos vínculo oficial com Roblox Corporation, Gamer Robot Inc. ou os desenvolvedores do Sailor Piece.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">2. Pedidos e pagamento</h3>
          <p>Pagamentos são processados via PIX por gateway seguro. O pedido é confirmado automaticamente após a compensação. Em caso de demora superior a 5 minutos, entre em contato pelo WhatsApp ou Discord.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">3. Entrega</h3>
          <p>A entrega padrão acontece via WhatsApp/Discord pela nossa equipe. Para entrega imediata, é possível adquirir a opção de prioridade pós-pagamento. Você precisa fornecer corretamente seu usuário do Roblox.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">4. Reembolso</h3>
          <p>Garantia de 7 dias para problemas comprovados de entrega. Não há reembolso após o item ser entregue corretamente na conta indicada.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">5. Responsabilidades</h3>
          <p>Não nos responsabilizamos por banimentos causados pelo mau uso da conta após a entrega. Você é responsável por manter a segurança das suas credenciais.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-1">6. Suporte</h3>
          <p>Atendimento 24h via WhatsApp e Discord (links no rodapé do site).</p>
        </div>
      </section>
    </article>
  </div>
);

export default Terms;
