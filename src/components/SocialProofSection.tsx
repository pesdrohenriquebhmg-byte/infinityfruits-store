import { useState } from 'react';
import { Camera, MessageCircle, Receipt, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Seção "Entregas Reais" — prints autênticos de pagamentos, entregas e suporte.
 * Os itens abaixo são PLACEHOLDERS. Para adicionar prints reais:
 *  1. Coloque a imagem em /public/proof/ (ex.: /public/proof/entrega-01.jpg)
 *  2. Edite o array `proofs` adicionando { type, src, caption }
 */
type Proof = {
  type: 'pagamento' | 'entrega' | 'suporte' | 'cliente';
  src?: string;
  caption: string;
};

const proofs: Proof[] = [
  { type: 'pagamento', caption: 'Pix aprovado em 12s' },
  { type: 'entrega', caption: 'Conta entregue automaticamente' },
  { type: 'suporte', caption: 'Atendimento humano via WhatsApp' },
  { type: 'cliente', caption: 'Cliente recebendo Kitsune' },
  { type: 'pagamento', caption: 'Pedido confirmado' },
  { type: 'entrega', caption: 'Gamepass ativada na conta' },
  { type: 'suporte', caption: 'Dúvida resolvida em 2 min' },
  { type: 'cliente', caption: 'Feedback após receber a conta' },
];

const typeMeta: Record<Proof['type'], { icon: typeof Camera; label: string; color: string }> = {
  pagamento: { icon: Receipt, label: 'Pagamento', color: 'text-neon-green' },
  entrega: { icon: Truck, label: 'Entrega', color: 'text-primary' },
  suporte: { icon: MessageCircle, label: 'Suporte', color: 'text-logo-yellow' },
  cliente: { icon: Camera, label: 'Cliente', color: 'text-secondary' },
};

const SocialProofSection = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const scroll = (dir: 1 | -1) => {
    const el = document.getElementById('proof-track');
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
    setScrollIndex(i => i + dir);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-display font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Prova social
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-foreground">Entregas reais</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Pagamentos, entregas e suporte de clientes reais. Sem montagem, sem filtro.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="proof-track"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none -mx-4 px-4"
          style={{ scrollIndex } as React.CSSProperties}
        >
          {proofs.map((p, i) => {
            const meta = typeMeta[p.type];
            const Icon = meta.icon;
            return (
              <article
                key={i}
                className="snap-start shrink-0 w-64 md:w-72 rounded-2xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-muted/30 to-muted/5 relative flex items-center justify-center">
                  {p.src ? (
                    <img src={p.src} alt={p.caption} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="text-center px-4">
                      <Icon className={`w-10 h-10 mx-auto mb-2 ${meta.color}`} />
                      <p className="text-xs text-muted-foreground">Print autêntico</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">Adicione em /public/proof/</p>
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-[10px] font-display font-bold uppercase ${meta.color}`}>
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-foreground font-medium leading-snug">{p.caption}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
