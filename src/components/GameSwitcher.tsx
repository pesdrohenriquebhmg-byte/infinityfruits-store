import { Link, useLocation } from 'react-router-dom';

const GameSwitcher = () => {
  const { pathname } = useLocation();
  const isSailor = pathname.startsWith('/sailor-piece');

  const base = 'px-3 md:px-4 py-1.5 rounded-md text-[11px] md:text-xs font-display font-bold uppercase tracking-wider transition-all';
  const active = 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(180_100%_50%_/_0.4)]';
  const inactive = 'text-muted-foreground hover:text-foreground';

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-card/80 border border-border/50 backdrop-blur-sm">
      <Link to="/" className={`${base} ${!isSailor ? active : inactive}`}>
        ⚔️ Blox Fruits
      </Link>
      <Link to="/sailor-piece" className={`${base} ${isSailor ? active : inactive} relative`}>
        ⚓ Sailor Piece
        {!isSailor && (
          <span className="absolute -top-2 -right-2 text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded-full bg-logo-yellow text-background shadow-[0_0_10px_hsl(50_100%_50%_/_0.5)] whitespace-nowrap leading-none border border-logo-yellow/60">
            Também vendemos
          </span>
        )}
      </Link>
    </div>
  );
};

export default GameSwitcher;
