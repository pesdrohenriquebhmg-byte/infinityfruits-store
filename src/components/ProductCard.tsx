import type { Product } from '@/data/products';

const badgeStyles: Record<string, string> = {
  mythical: 'badge-mythical',
  popular: 'badge-popular',
  rare: 'badge-rare',
  promo: 'badge-popular',
};

const badgeLabels: Record<string, string> = {
  mythical: '✨ Mythical',
  popular: '🔥 Popular',
  rare: '💎 Raro',
  promo: '🎁 Promo',
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className={`card-gamer flex flex-col ${!product.inStock ? 'opacity-50' : ''}`}>
      {/* Badge */}
      {product.badge && (
        <div className="px-3 pt-3">
          <span className={badgeStyles[product.badge]}>{badgeLabels[product.badge]}</span>
        </div>
      )}

      {/* Image */}
      <div className="p-4 flex items-center justify-center h-36 md:h-44">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_hsl(180,100%,50%,0.15)]"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="px-4 pb-4 flex flex-col flex-1">
        <h3 className="font-display text-sm font-bold text-foreground mb-2 leading-tight">
          {product.name}
        </h3>
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-display font-black text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-4 h-4" />
            À vista no Pix
          </p>
          {product.inStock ? (
            <button className="btn-neon w-full text-sm py-2.5">
              Comprar agora
            </button>
          ) : (
            <button className="w-full py-2.5 rounded-lg bg-muted text-muted-foreground font-display text-sm font-bold uppercase cursor-not-allowed">
              Esgotado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
