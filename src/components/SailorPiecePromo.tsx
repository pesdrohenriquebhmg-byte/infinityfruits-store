import { Link } from 'react-router-dom';
import { ArrowRight, Anchor } from 'lucide-react';
import { sailorProducts } from '@/data/sailorProducts';

const PREVIEW_IDS = [
  'sp-promocao-ragna-dragon-slayer-sword-game-pass-ativada-na-sua-conta-sem',
  'sp-promocao-madoka-melee-love-maiden-game-pass-ativada-na-sua-conta-sem-',
  'sp-sets-set-garou-cosmic-being',
];

const SailorPiecePromo = () => {
  const previews = PREVIEW_IDS
    .map(id => sailorProducts.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/sailor-piece"
          className="group flex items-center gap-3 md:gap-4 rounded-xl border border-primary/30 bg-gradient-to-r from-card/80 via-card/60 to-card/80 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(180_100%_50%_/_0.2)] transition-all px-3 py-3 md:px-4 md:py-3.5"
        >
          <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Anchor className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] md:text-sm font-bold text-foreground leading-tight">
              Também vendemos <span className="text-logo-yellow">Sailor Piece</span>
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 truncate">
              Contas, Sets, Bounty, Game Pass e mais
            </p>
          </div>

          <div className="hidden sm:flex items-center -space-x-2">
            {previews.map(p => (
              <img
                key={p.id}
                src={p.image}
                alt=""
                loading="lazy"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-background ring-1 ring-primary/30"
              />
            ))}
          </div>

          <span className="shrink-0 inline-flex items-center gap-1 text-xs md:text-sm font-bold text-primary group-hover:gap-1.5 transition-all">
            Ver
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </span>
        </Link>

        {/* Mobile: thumbnails abaixo */}
        <div className="sm:hidden mt-2 flex items-center gap-2">
          {previews.map(p => (
            <img
              key={p.id}
              src={p.image}
              alt=""
              loading="lazy"
              className="w-12 h-12 rounded-lg object-cover border border-border/60"
            />
          ))}
          <span className="text-[10px] text-muted-foreground">+ centenas de itens</span>
        </div>
      </div>
    </section>
  );
};

export default SailorPiecePromo;
