import { ShoppingCart } from 'lucide-react';
import logo from '@/assets/logo-infinity.png';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="INFINITY FRUITS" className="w-auto h-8 md:h-10 object-contain" />
          <div>
            <span className="font-display text-xs md:text-sm font-bold text-logo-sky">INFINITY </span>
            <span className="font-display text-xs md:text-sm font-bold text-logo-yellow">FRUITS</span>
          </div>
        </a>
        <div className="flex items-center gap-3 md:gap-4">
          <a href="#produtos" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Ver Contas
          </a>
          <a href="#como-funciona" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Como Funciona
          </a>
          <button className="w-9 h-9 rounded-lg bg-card/80 border border-border/50 flex items-center justify-center hover:border-primary/50 transition-all">
            <ShoppingCart className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
