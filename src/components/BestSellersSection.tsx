import { Flame } from 'lucide-react';
import ProductCard from './ProductCard';
import { permProducts, mutationProducts, premiumProducts } from '@/data/products';

// Seleciona alguns produtos com badge popular/mítica como "mais vendidos"
const bestSellers = [
  premiumProducts[0],
  permProducts.find(p => p.id === 'dragon')!,
  permProducts.find(p => p.id === 'kitsune')!,
  mutationProducts[0],
  permProducts.find(p => p.id === 'buddha')!,
].filter(Boolean);

const BestSellersSection = () => (
  <section className="py-12 md:py-16">
    <div className="container mx-auto px-4">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 mb-3">
            <Flame className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[11px] font-display font-bold uppercase tracking-wider text-destructive">
              Mais vendidos
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black text-foreground">
            Os favoritos da galera
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Produtos que mais saem na loja, com entrega na hora.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
        {bestSellers.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  </section>
);

export default BestSellersSection;
