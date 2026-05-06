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

  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 7, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const total = prev.days * 86400 + prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (total <= 0) return { days: 4, hours: 11, minutes: 59, seconds: 59 };
        return {
          days: Math.floor(total / 86400),
          hours: Math.floor((total % 86400) / 3600),
          minutes: Math.floor((total % 3600) / 60),
          seconds: total % 60,
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
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">🔥</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
          </div>

          <h2 className="section-title text-foreground">CONTAS COM MUTAÇÕES</h2>
          <p className="text-muted-foreground mt-2 text-lg">Edição limitada — garanta antes que acabe</p>

          {/* Countdown subtle */}
          <div className="mt-4 inline-flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-4 py-2">
            <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">Disponível por:</span>
            <div className="flex gap-1 text-sm font-display font-bold text-foreground">
              <span className="text-primary">{timeLeft.days}d</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">{pad(timeLeft.hours)}h</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">{pad(timeLeft.minutes)}m</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-primary">{pad(timeLeft.seconds)}s</span>
            </div>
          </div>

          <div className="w-24 h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="card-gamer flex flex-col"
            >
              {product.badge && (
                <div className="px-3 pt-3">
                  <span className={badgeStyles[product.badge]}>{badgeLabels[product.badge]}</span>
                </div>
              )}

              <div className="p-4 flex items-center justify-center h-36 md:h-44 bg-gradient-to-b from-muted/20 to-transparent">
                <img
                  src={product.image}
                  alt={product.name}
                  width="220"
                  height="220"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_0_20px_hsl(180,100%,50%,0.2)] hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="px-4 pb-4 flex flex-col flex-1">
                <h3 className="font-display text-sm font-bold text-foreground mb-2 leading-tight">
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
                    Comprar agora
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
