import { ShieldCheck, Zap, Star, ArrowRight, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo-infinity.webp';

const DISCORD_LINK = 'https://discord.gg/KXTTMRhgJ8';
const WHATSAPP_LINK = 'https://wa.me/553131574399';

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

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
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

            {/* Botões de suporte */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[hsl(142_70%_45%)]/15 border border-[hsl(142_70%_45%)]/30 text-[hsl(142_70%_55%)] font-display font-bold text-xs uppercase tracking-wider hover:bg-[hsl(142_70%_45%)]/25 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Suporte WhatsApp
              </a>
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[hsl(235_86%_65%)]/15 border border-[hsl(235_86%_65%)]/30 text-[hsl(235_86%_75%)] font-display font-bold text-xs uppercase tracking-wider hover:bg-[hsl(235_86%_65%)]/25 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Server Discord
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
