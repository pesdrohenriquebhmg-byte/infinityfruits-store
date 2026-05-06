import { Link } from 'react-router-dom';
import { ArrowRight, Anchor, Sparkles } from 'lucide-react';
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
    <section className="py-7">
      <div className="container mx-auto px-4">
        <Link
          to="/sailor-piece"
          className="group relative flex items-center gap-3 md:gap-4 rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-card/70 to-logo-yellow/10 hover:border-primary/70 hover:shadow-[0_0_28px_hsl(180_100%_50%_/_0.35)] transition-all px-3.5 py-3.5 md:px-5 md:py-4 overflow-hidden"
        >
          {/* Brilho animado no fundo */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_hsl(180_100%_50%_/_0.25),_transparent_60%)] pointer-events-none" />
          <div className="absolute -top-1 -right-1 hidden sm:block">
            <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-bl-md rounded-tr-xl bg-logo-yellow text-background uppercase tracking-wider shadow-md">
              <Sparkles className="w-2.5 h-2.5" /> Novo
            </span>
          </div>

          <div className="relative shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_hsl(180_100%_50%_/_0.3)]">
            <Anchor className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>

          <div className="relative flex-1 min-w-0">
            <p className="text-sm md:text-base font-display font-black text-foreground leading-tight tracking-tight">
              Também vendemos{' '}
              <span className="text-logo-sky">SAILOR</span>{' '}
              <span className="text-logo-yellow">PIECE</span>
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 truncate">
              Contas · Sets · Bounty · Game Pass · Baús
            </p>
          </div>

          <div className="relative hidden sm:flex items-center -space-x-2.5">
            {previews.map(p => (
              <img
                key={p.id}
                src={p.image}
                alt=""
                loading="lazy"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-background ring-2 ring-primary/40"
              />
            ))}
          </div>

          <span className="relative shrink-0 inline-flex items-center gap-1 text-xs md:text-sm font-display font-black uppercase tracking-wider text-primary group-hover:gap-2 transition-all">
            Ver
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        {/* Mobile: thumbnails abaixo */}
        <div className="sm:hidden mt-2.5 flex items-center gap-2">
          {previews.map(p => (
            <img
              key={p.id}
              src={p.image}
              alt=""
              loading="lazy"
              className="w-12 h-12 rounded-lg object-cover border border-primary/30"
            />
          ))}
          <span className="text-[10px] text-muted-foreground font-medium">+ centenas de itens</span>
        </div>
      </div>
    </section>
  );
};

export default SailorPiecePromo;
