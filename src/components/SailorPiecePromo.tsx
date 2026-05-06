import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SailorPiecePromo = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/sailor-piece"
          className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/60 hover:bg-card/80 hover:border-primary/40 transition-all px-4 py-3"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">⚓</span>
            <p className="text-sm text-foreground truncate">
              Também vendemos produtos de <span className="font-bold text-logo-yellow">Sailor Piece</span>
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-primary">
            Ver categoria
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default SailorPiecePromo;
