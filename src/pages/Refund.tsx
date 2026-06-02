import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Refund = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span className="text-[11px] font-display font-bold uppercase tracking-wider text-primary">
          Garantia total
        </span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-3">
        Política de Reembolso
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Atualizada em {new Date().toLocaleDateString('pt-BR')}
      </p>

      <article className="prose prose-invert max-w-none space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">1. Garantia de entrega</h2>
          <p>
            Toda compra realizada na Infinity Fruits possui garantia de entrega. Se o produto não for entregue por qualquer falha do nosso lado, devolvemos 100% do valor pago via Pix.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">2. Quando o reembolso é concedido</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>O produto não foi entregue em até 24 horas após a confirmação do Pix.</li>
            <li>A conta ou item entregue não corresponde ao anunciado.</li>
            <li>Houve cobrança duplicada por falha do gateway.</li>
            <li>Problema técnico que impossibilite a entrega.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">3. Quando o reembolso pode ser recusado</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Após o cliente ter acessado, alterado ou compartilhado os dados da conta.</li>
            <li>Em caso de uso indevido, banimento por trapaça ou violação dos termos do jogo após a entrega.</li>
            <li>Arrependimento sem motivo após a entrega ter sido concluída com sucesso (produto digital).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">4. Como solicitar</h2>
          <p>
            Entre em contato pelo nosso WhatsApp de suporte informando o número do pedido e o motivo. Nossa equipe responde em poucos minutos e o reembolso, quando aprovado, é processado em até 24h via Pix para a mesma chave do pagamento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">5. Suporte</h2>
          <p>
            Qualquer dúvida pode ser enviada para nosso WhatsApp:{' '}
            <a href="https://wa.me/553131574399" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              (31) 3157-4399
            </a>
            . Estamos disponíveis 24h, todos os dias.
          </p>
        </section>
      </article>
    </main>

    <Footer />
  </div>
);

export default Refund;
