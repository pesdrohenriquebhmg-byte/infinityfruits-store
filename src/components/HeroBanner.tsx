import { Shield, Zap, MessageCircle } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import logo from '@/assets/logo.png';

const HeroBanner = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-12">
        <img src={logo} alt="Super Buy" className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 animate-float" />
        
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-3 tracking-tight">
          <span className="text-foreground">SUPER </span>
          <span className="text-primary glow-text-cyan">BUY</span>
        </h1>
        <p className="font-display text-sm md:text-base tracking-[0.3em] text-muted-foreground mb-6 uppercase">
          Infini Fruits · Loja Oficial
        </p>

        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
            CONTAS BLOX FRUITS PRONTAS
          </h2>
          <p className="text-muted-foreground text-lg">
            Level 2550+ • Sea 3 • Míticas Garantidas • Entrega Rápida
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="#produtos" className="btn-neon text-lg px-8 py-4 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Ver Contas
          </a>
          <a
            href="https://wa.me/5546999358894?text=Olá"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-purple text-lg px-8 py-4 flex items-center justify-center gap-2"
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
