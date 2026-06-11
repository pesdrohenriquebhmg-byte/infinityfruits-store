import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { SailorProduct } from '@/data/sailorProducts';

const SailorProductCard = ({ product }: { product: SailorProduct }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { ref, isVisible } = useScrollAnimation();

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      ref={ref}
      className={`card-gamer flex flex-col transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {discount > 0 && (
        <div className="px-3 pt-3">
          <span className="badge-popular">-{discount}%</span>
        </div>
      )}

      <div className="p-4 flex items-center justify-center h-36 md:h-44 bg-gradient-to-b from-muted/20 to-transparent">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain drop-shadow-[0_0_20px_hsl(180,100%,50%,0.2)] hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="px-4 pb-4 flex flex-col flex-1">
        <h3 className="font-display text-xs md:text-sm font-bold text-foreground mb-2 leading-tight line-clamp-3" title={product.name}>
          {product.name}
        </h3>
        <div className="mt-auto">
          {product.oldPrice && (
            <p className="text-xs text-muted-foreground line-through">
              R$ {product.oldPrice.toFixed(2).replace('.', ',')}
            </p>
          )}
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-xl md:text-2xl font-display font-black text-primary glow-text-cyan whitespace-nowrap">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[11px] md:text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-4 h-4" />
            À vista no Pix
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => navigate(`/checkout?produto=${product.id}`)}
              className="btn-neon flex-1 text-xs md:text-sm py-2 px-2"
            >
              Comprar
            </button>
            <button
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
              className="shrink-0 w-9 md:w-10 rounded-lg bg-card border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
              title="Adicionar ao carrinho"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SailorProductCard;
