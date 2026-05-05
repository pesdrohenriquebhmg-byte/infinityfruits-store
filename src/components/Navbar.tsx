import { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import logo from '@/assets/logo-infinity.png';
import { useCart } from '@/contexts/CartContext';
import GameSwitcher from './GameSwitcher';

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const [bouncing, setBouncing] = useState(false);
  const prevItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 500);
      return () => clearTimeout(timer);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    prevItems.current = totalItems;
  }, [totalItems]);

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
          <div className="hidden sm:block">
            <GameSwitcher />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-12 h-12 rounded-lg bg-card/80 border border-border/50 flex items-center justify-center hover:border-primary/50 transition-all"
          >
            <ShoppingCart className="w-6 h-6 text-foreground" />
            {totalItems > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ${
                  bouncing ? 'animate-bounce' : ''
                }`}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="sm:hidden border-t border-border/50 px-4 py-2 flex justify-center">
        <GameSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
