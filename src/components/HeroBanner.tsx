import { Shield, Zap, MessageCircle, Star } from 'lucide-react';
import logo from '@/assets/logo-infinity.png';

const HeroBanner = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.05)_0%,_transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-16">
        <img src={logo} alt="Super Buy" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 animate-float drop-shadow-[0_0_30px_hsl(180,100%,50%,0.3)]" />

        {/* Stats badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 text-neon-yellow fill-neon-yellow" />
            <span className="text-xs font-bold text-foreground">+500 vendas</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 text-neon-yellow fill-neon-yellow" />
            <span className="text-xs font-bold text-foreground">4.9/5 avaliações</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground">Entrega imediata</span>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tight leading-none">
          <span className="text-foreground drop-shadow-[0_0_20px_hsl(0,0%,100%,0.1)]">SUPER</span>
          <span className="text-primary glow-text-cyan ml-3 md:ml-4"> BUY</span>
        </h1>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
          <p className="font-body text-xs md:text-sm tracking-[0.25em] text-muted-foreground uppercase">
            Loja Oficial · Blox Fruits
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="font-display text-lg md:text-2xl font-bold text-foreground mb-2">
            CONTAS BLOX FRUITS PRONTAS
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Level 2550+ • Sea 3 • Míticas Garantidas • Entrega Rápida
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a href="#produtos" className="btn-neon text-base md:text-lg px-8 py-4 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Ver Contas
          </a>
          <a
            href="https://wa.me/5546999358894?text=Olá"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-purple text-base md:text-lg px-8 py-4 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Suporte 24h
          </a>
        </div>

        {/* Trust Badges inline */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {[
            { icon: Shield, label: 'Compra Segura' },
            { icon: Zap, label: 'Entrega Rápida' },
            { icon: MessageCircle, label: 'Suporte 24h' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
