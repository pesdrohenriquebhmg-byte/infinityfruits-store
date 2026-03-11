import { ShoppingCart } from 'lucide-react';
import logo from '@/assets/logo-infinity.png';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="INFINITY FRUITS" className="w-10 h-10" />
          <div>
            <span className="font-display text-sm font-bold text-sky-400">INFINITY </span>
            <span className="font-display text-sm font-bold text-yellow-400">FRUITS</span>
          </div>
        </a>
        <div className="flex items-center gap-4">
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
