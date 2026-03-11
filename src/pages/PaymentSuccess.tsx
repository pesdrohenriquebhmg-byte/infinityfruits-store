import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get('pedido');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-neon-green/10 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-10 h-10 md:w-14 md:h-14 text-neon-green" />
          </div>
          <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full border-2 border-neon-green/30 animate-ping" />
        </div>

        <h1 className="font-display text-xl md:text-3xl font-black text-foreground mb-3">
          Pagamento Confirmado! 🎉
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8">
          Seu pedido foi processado com sucesso. Você receberá os dados da conta no seu e-mail e WhatsApp em instantes.
        </p>

        {orderId && (
          <div className="card-gamer p-4 mb-6 text-left">
            <p className="text-xs text-muted-foreground mb-1">ID do pedido</p>
            <p className="text-xs md:text-sm font-mono text-foreground break-all">{orderId}</p>
          </div>
        )}

        <div className="card-gamer p-4 md:p-5 mb-6 text-left space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">📋 Próximos passos</h3>
          <div className="flex items-start gap-3">
            <span className="text-neon-green font-bold text-sm mt-0.5">1.</span>
            <p className="text-xs text-muted-foreground">Verifique seu e-mail e WhatsApp para receber os dados da conta.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neon-green font-bold text-sm mt-0.5">2.</span>
            <p className="text-xs text-muted-foreground">Faça login no Blox Fruits com os dados recebidos.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neon-green font-bold text-sm mt-0.5">3.</span>
            <p className="text-xs text-muted-foreground">Aproveite sua conta! Em caso de dúvidas, fale com nosso suporte.</p>
          </div>
        </div>

        {/* Upsell CTA */}
        <Link
          to={`/ofertas-especiais?pedido=${orderId || ''}`}
          className="btn-neon w-full text-xs md:text-sm py-3 flex items-center justify-center gap-2 mb-4"
        >
          🎁 Ver ofertas exclusivas
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex gap-3">
          <a
            href="https://wa.me/553131578354?text=Olá! Preciso de suporte sobre meu pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-xs md:text-sm text-muted-foreground hover:text-foreground hover:border-neon-green/50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Suporte
          </a>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-xs md:text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
