import { ShieldCheck, Zap, Star, ArrowRight } from 'lucide-react';
import logo from '@/assets/logo-infinity.webp';

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Glow sutil de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(200_80%_55%_/_0.10)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Texto */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/70 border border-border/60 backdrop-blur-sm mb-6">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-logo-yellow text-logo-yellow" />
                ))}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                4.9/5 · +12.000 entregas realizadas
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight mb-5">
              A maneira mais{' '}
              <span className="text-logo-sky">rápida e segura</span>{' '}
              de comprar itens de{' '}
              <span className="text-logo-yellow">Blox Fruits</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Entrega automática, pagamento via Pix e suporte rápido para garantir sua experiência.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <a
                href="#produtos"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_8px_24px_-8px_hsl(180_100%_50%_/_0.5)]"
              >
                Comprar Agora
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#avaliacoes"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-card/80 border border-border text-foreground font-display font-bold text-sm uppercase tracking-wider hover:border-primary/50 hover:bg-card transition-all"
              >
                Ver Avaliações
              </a>
            </div>

            {/* Mini indicadores */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Pagamento seguro
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" /> Entrega automática
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 text-primary" /> Suporte 24h
              </span>
            </div>
          </div>

          {/* Imagem destaque */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_hsl(200_80%_55%_/_0.25),_transparent_70%)] blur-2xl" />
              <img
                src={logo}
                alt="Infinity Fruits — Loja oficial de contas Blox Fruits"
                width="420"
                height="420"
                decoding="async"
                className="relative w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-[0_20px_40px_hsl(200,80%,50%,0.25)] animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
