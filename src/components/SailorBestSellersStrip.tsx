import { Link } from 'react-router-dom';
import { Anchor, ArrowRight, Flame } from 'lucide-react';
import { sailorProducts } from '@/data/sailorProducts';

const SailorBestSellersStrip = () => {
  const bestSellers = [...sailorProducts]
    .filter(p => p.oldPrice)
    .sort((a, b) => (b.oldPrice! - b.price) - (a.oldPrice! - a.price))
    .slice(0, 8);

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card/70 via-card/50 to-card/70 backdrop-blur-md p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
                <Flame className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-base md:text-xl font-black tracking-tight">
                    <span className="text-logo-sky">MAIS VENDIDOS</span>
                    <span className="text-foreground"> · </span>
                    <span className="text-logo-yellow">SAILOR PIECE</span>
                  </h3>
                  <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 border border-primary/40">
                    Também vendemos
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
                  Os queridinhos dos jogadores · entrega via PIX
                </p>
              </div>
            </div>
            <Link
              to="/sailor-piece"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
            >
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1 snap-x snap-mandatory">
            {bestSellers.map(p => {
              const discount = Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100);
              return (
                <Link
                  key={p.id}
                  to="/sailor-piece"
                  className="group relative shrink-0 w-[140px] md:w-[170px] snap-start rounded-xl overflow-hidden border border-border/60 bg-card/80 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(180_100%_50%_/_0.25)] transition-all"
                >
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-md bg-destructive text-destructive-foreground">
                      -{discount}%
                    </span>
                  </div>
                  <div className="aspect-square overflow-hidden bg-background/40">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-black text-primary text-sm md:text-base">
                        R$ {p.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-through">
                        R$ {p.oldPrice!.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Anchor className="w-2.5 h-2.5" />
                      Sailor Piece
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SailorBestSellersStrip;
