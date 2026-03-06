import type { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  id?: string;
}

const ProductSection = ({ title, subtitle, products, id }: ProductSectionProps) => {
  return (
    <section id={id} className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="section-title text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>
          )}
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
