import { Zap, ShieldCheck, MessageCircle, BadgeCheck } from 'lucide-react';

const items = [
  { icon: Zap, label: 'Entrega Automática', desc: 'Direto após o pagamento' },
  { icon: ShieldCheck, label: 'Pagamento Seguro', desc: 'Pix com aprovação na hora' },
  { icon: MessageCircle, label: 'Suporte Rápido', desc: 'Atendimento humano 24h' },
  { icon: BadgeCheck, label: 'Garantia de Entrega', desc: 'Receba ou o dinheiro volta' },
];

const TrustBar = () => (
  <section className="border-y border-border/60 bg-card/40 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-display font-bold text-foreground leading-tight">{label}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
