import { ShoppingCart, CreditCard, Download } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="como-funciona" className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="section-title text-foreground mb-12">COMO FUNCIONA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center glow-border-cyan">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-display text-xs text-primary/60 mb-2 tracking-widest">PASSO {i + 1}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
