import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-sm font-bold text-foreground mb-1">
          SUPER <span className="text-primary">BUY</span> · Infini Fruits
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Loja oficial de contas e itens digitais para Blox Fruits
        </p>
        <a
          href="https://wa.me/5546999358894?text=Olá"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-neon-green hover:underline"
        >
          <MessageCircle className="w-4 h-4" />
          Suporte 24h via WhatsApp
        </a>
      </div>
    </footer>
  );
};

export default Footer;
