import { Shield, Clock, RefreshCw } from 'lucide-react';

const TrustSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-10 text-center gradient-border">
          <div className="inline-flex items-center gap-2 bg-neon-green/10 text-neon-green px-4 py-1.5 rounded-full text-sm font-display font-bold mb-4">
            <Shield className="w-4 h-4" />
            Compra Protegida
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Garantia de 7 Dias
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Todas as suas compras possuem garantia total de 7 dias. Se houver qualquer problema, resolvemos ou devolvemos seu dinheiro.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Suporte via WhatsApp' },
              { icon: Clock, label: 'Atendimento 24h' },
              { icon: RefreshCw, label: 'Reembolso Garantido' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-muted/50">
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
