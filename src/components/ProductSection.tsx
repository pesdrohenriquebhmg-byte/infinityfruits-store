import type { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  id?: string;
}

const ProductSection = ({ title, subtitle, products, id }: ProductSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id={id} className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">⚡</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="section-title text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>}
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
