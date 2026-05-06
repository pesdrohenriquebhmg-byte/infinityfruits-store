import { Link } from 'react-router-dom';
import { Anchor, ArrowRight, Sparkles } from 'lucide-react';
import { sailorProducts } from '@/data/sailorProducts';

const FEATURED_IDS = [
  'sp-promocao-ragna-dragon-slayer-sword-game-pass-ativada-na-sua-conta-sem',
  'sp-promocao-madoka-melee-love-maiden-game-pass-ativada-na-sua-conta-sem-',
  'sp-promocao-combo-2-set-s-ragna-madoka-game-pass-ativada-na-sua-conta-se',
  'sp-promocao-promocao-rainha-de-gelo-pacote-de-roupas-da-rainha-de-gelo-i',
  'sp-promocao-promocao-atomic-strongest-shinobi-abyssal-empress-shinobi-ma',
  'sp-promocao-promocao-moon-slayer-moon-outfit-assassino-de-lua-game-pass-',
  'sp-promocao-promocao-true-manipulator-blessed-maiden-yamato-donzela-aben',
  'sp-contas-conta-lv-16000-10-milhoes-bounty-6-sets-chance-de-varios-b10',
];

const SailorPiecePromo = () => {
  const highlights = FEATURED_IDS
    .map(id => sailorProducts.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 8);

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(280_100%_65%_/_0.08)_0%,_transparent_70%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card/90 via-card/70 to-card/90 backdrop-blur-md p-5 md:p-8 shadow-[0_0_40px_hsl(180_100%_50%_/_0.12)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/40 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">
                  Novidade · Também vendemos
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-black tracking-tight leading-none">
                <span className="text-logo-sky drop-shadow-[0_0_15px_hsl(200,80%,60%,0.4)]">SAILOR</span>
                <span className="text-logo-yellow drop-shadow-[0_0_15px_hsl(50,80%,50%,0.4)] ml-2"> PIECE</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Contas, Sets, Bounty, Game Pass e muito mais — entrega rápida via PIX
              </p>
            </div>
            <Link
              to="/sailor-piece"
              className="btn-neon text-sm md:text-base px-5 py-3 inline-flex items-center justify-center gap-2 self-start md:self-auto whitespace-nowrap"
            >
              <Anchor className="w-4 h-4" />
              Ver loja Sailor Piece
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
            {highlights.slice(0, 4).map(p => (
              <Link
                key={p.id}
                to="/sailor-piece"
                className="group relative rounded-xl overflow-hidden border border-border/60 bg-card/80 hover:border-primary/60 hover:shadow-[0_0_25px_hsl(180_100%_50%_/_0.3)] hover:-translate-y-0.5 transition-all"
              >
                {p.oldPrice && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[10px] md:text-xs font-black px-2 py-0.5 rounded-md bg-destructive text-destructive-foreground shadow-lg">
                      -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-md bg-logo-yellow/95 text-background shadow-lg">
                    🔥 HOT
                  </span>
                </div>
                <div className="aspect-square overflow-hidden bg-gradient-to-b from-background/20 to-background/60">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-2.5 md:p-3">
                  <h4 className="font-display font-bold text-[11px] md:text-xs text-foreground line-clamp-2 leading-tight mb-1.5 min-h-[2.2rem]">
                    {p.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-display font-black text-primary text-base md:text-lg glow-text-cyan">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </span>
                    {p.oldPrice && (
                      <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                        R$ {p.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1 uppercase tracking-wide flex items-center gap-1">
                    <span className="text-logo-yellow">⚓</span> Sailor Piece · PIX
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SailorPiecePromo;
