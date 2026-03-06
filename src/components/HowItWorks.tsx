import { ShoppingCart, CreditCard, Download } from 'lucide-react';

const steps = [
  {
    icon: ShoppingCart,
    title: 'Escolha sua Conta',
    description: 'Navegue pelo catálogo e escolha o produto ideal pra você.',
  },
  {
    icon: CreditCard,
    title: 'Pague via PIX',
    description: 'Pagamento instantâneo e seguro. Confirmação automática.',
  },
  {
    icon: Download,
    title: 'Receba na Hora',
    description: 'Dados enviados automaticamente após a confirmação.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-foreground mb-10">COMO FUNCIONA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center glow-border-cyan">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="font-display text-xs text-muted-foreground mb-2">PASSO {i + 1}</div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
