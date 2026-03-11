import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface MutationSectionProps {
  products: Product[];
}

const badgeStyles: Record<string, string> = {
  mythical: 'badge-mythical',
  rare: 'badge-rare',
};

const badgeLabels: Record<string, string> = {
  mythical: '✨ Mythical',
  rare: '💎 Raro',
};

const MutationSection = ({ products }: MutationSectionProps) => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();

  // Countdown timer - resets every 2 hours for urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 47, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 1, minutes: 59, seconds: 59 };
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-destructive" />
            <span className="text-xs font-display font-bold text-destructive uppercase tracking-widest animate-pulse">🔥</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-destructive" />
          </div>

          <h2 className="section-title text-foreground">🔥 CONTAS COM MUTAÇÕES</h2>

          {/* Urgency banner */}
          <div className="mt-4 inline-flex flex-col items-center gap-3">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-6 py-3 animate-pulse">
              <p className="text-destructive font-display font-bold text-sm md:text-base uppercase tracking-wide">
                ⚠️ ESTOQUE ACABANDO — Últimas unidades!
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">Acaba em:</span>
              <div className="flex gap-1">
                {[
                  { value: pad(timeLeft.hours), label: 'h' },
                  { value: pad(timeLeft.minutes), label: 'm' },
                  { value: pad(timeLeft.seconds), label: 's' },
                ].map((unit, i) => (
                  <div key={i} className="flex items-center gap-0.5">
                    <span className="bg-destructive/20 border border-destructive/40 text-destructive font-display font-black text-lg md:text-xl px-2 py-1 rounded-md min-w-[2.5rem] text-center">
                      {unit.value}
                    </span>
                    <span className="text-xs text-muted-foreground font-bold">{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-24 h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-destructive to-accent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="card-gamer flex flex-col ring-1 ring-destructive/20 hover:ring-destructive/50 transition-all duration-300"
            >
              {/* Low stock indicator */}
              <div className="px-3 pt-3 flex items-center justify-between">
                {product.badge && (
                  <span className={badgeStyles[product.badge]}>{badgeLabels[product.badge]}</span>
                )}
                <span className="text-[10px] font-display font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full animate-pulse uppercase">
                  🔴 Últimas {Math.floor(Math.random() * 3) + 2} unid.
                </span>
              </div>

              <div className="p-4 flex items-center justify-center h-40 md:h-48 bg-gradient-to-b from-muted/20 to-transparent">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_0_25px_hsl(0,80%,50%,0.3)] hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="px-4 pb-4 flex flex-col flex-1">
                <h3 className="font-display text-base font-bold text-foreground mb-2 leading-tight">
                  {product.name}
                </h3>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-display font-black text-primary glow-text-cyan">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-4 h-4" />
                    À vista no Pix
                  </p>
                  <button
                    onClick={() => navigate(`/checkout?produto=${product.id}`)}
                    className="btn-neon w-full text-sm py-2.5"
                  >
                    🔥 Garantir agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MutationSection;
