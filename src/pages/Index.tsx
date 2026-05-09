import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import SailorPiecePromo from '@/components/SailorPiecePromo';

import ProductSection from '@/components/ProductSection';
import PremiumProductSection from '@/components/PremiumProductSection';
import MutationSection from '@/components/MutationSection';
import HowItWorks from '@/components/HowItWorks';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { permProducts, godhumanProducts, miticaProducts, v4Products, mutationProducts, fisicaProducts, premiumProducts } from '@/data/products';
import siteBg from '@/assets/site-bg.webp';

type BloxCategory =
  | 'premium'
  | 'perm'
  | 'mutation'
  | 'godhuman'
  | 'mitica'
  | 'v4'
  | 'fisica';

const bloxCategories: { key: BloxCategory; label: string; count: number }[] = [
  { key: 'perm', label: 'Contas PERM', count: permProducts.length },
  { key: 'v4', label: 'Contas V4', count: v4Products.length },
  { key: 'mutation', label: 'Mutações', count: mutationProducts.length },
  { key: 'godhuman', label: 'Godhuman', count: godhumanProducts.length },
  { key: 'mitica', label: 'Mítica Aleatória', count: miticaProducts.length },
  { key: 'premium', label: 'Premium', count: premiumProducts.length },
  { key: 'fisica', label: 'Frutas Físicas', count: fisicaProducts.length },
];

const Index = () => {
  const [filter, setFilter] = useState<BloxCategory | 'all'>('all');

  const show = (cat: BloxCategory) => filter === 'all' || filter === cat;

  const visibleCategories = useMemo(
    () => (filter === 'all' ? bloxCategories : bloxCategories.filter(c => c.key === filter)),
    [filter]
  );

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <img src={siteBg} alt="" aria-hidden="true" loading="eager" decoding="async" className="w-full h-full object-cover blur-sm" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroBanner />
        <SailorPiecePromo />
        <TestimonialsMarquee />

        {/* Filtro de categorias - mesmo padrão da Sailor Piece */}
        <section className="py-6 sticky top-14 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilter('all')}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(180_100%_50%_/_0.4)]'
                    : 'bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                Todos
              </button>
              {bloxCategories.map(c => (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    filter === c.key
                      ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(180_100%_50%_/_0.4)]'
                      : 'bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {show('perm') && (
          <ProductSection
            id="produtos"
            title="CONTAS PERM"
            subtitle="Frutas permanentes com entrega imediata"
            products={permProducts}
          />
        )}
        {show('v4') && (
          <ProductSection
            title="CONTAS V4"
            subtitle="Contas com raça V4 desbloqueada"
            products={v4Products}
          />
        )}
        {show('mutation') && <MutationSection products={mutationProducts} />}
        {show('godhuman') && (
          <ProductSection
            title="CONTAS COM GODHUMAN"
            subtitle="Combos especiais com Godhuman + Míticas"
            products={godhumanProducts}
          />
        )}
        {show('mitica') && (
          <ProductSection
            title="MÍTICA ALEATÓRIA"
            subtitle="Contas com frutas míticas sorteadas — preço imbatível"
            products={miticaProducts}
          />
        )}
        {show('premium') && <PremiumProductSection />}
        {show('fisica') && (
          <ProductSection
            title="FRUTAS FÍSICAS"
            subtitle="Frutas físicas avulsas para sua conta"
            products={fisicaProducts}
          />
        )}

        {/* placeholder use to silence unused warning when filtering */}
        <div hidden>{visibleCategories.length}</div>

        <HowItWorks />
        <TrustSection />
        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default Index;
