import { MousePointerClick, QrCode, Sparkles, Gamepad2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  { icon: MousePointerClick, title: 'Escolha seu produto', desc: 'Navegue pelo catálogo e selecione a conta ou item que quer.' },
  { icon: QrCode, title: 'Pague via Pix', desc: 'Aprovação instantânea, sem cadastro, sem taxas extras.' },
  { icon: Sparkles, title: 'Receba automaticamente', desc: 'Os dados chegam por e-mail e WhatsApp em poucos minutos.' },
  { icon: Gamepad2, title: 'Aproveite sua compra', desc: 'Entre no jogo e use seu item imediatamente.' },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="como-funciona" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-display font-bold text-primary uppercase tracking-[0.2em] mb-2">Processo simples</p>
          <h2 className="font-display text-3xl md:text-4xl font-black text-foreground">Como funciona</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Em quatro passos rápidos você já está aproveitando seu item.
          </p>
        </div>

        <div
          ref={ref}
          className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Linha conectora desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative text-center p-6 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 hover:border-primary/40 transition-colors"
            >
              <div className="relative w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-display font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
