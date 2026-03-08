import { Shield, Clock, RefreshCw } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TrustSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 text-center gradient-border transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-neon-green/10 text-neon-green px-4 py-1.5 rounded-full text-sm font-display font-bold mb-4">
            <Shield className="w-4 h-4" />
            Compra Protegida
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Garantia de 7 Dias
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Todas as suas compras possuem garantia total de 7 dias. Se houver qualquer problema, resolvemos ou devolvemos seu dinheiro.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Suporte via WhatsApp' },
              { icon: Clock, label: 'Atendimento 24h' },
              { icon: RefreshCw, label: 'Reembolso Garantido' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
