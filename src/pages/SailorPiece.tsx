import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import HowItWorks from '@/components/HowItWorks';
import TrustSection from '@/components/TrustSection';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import SailorProductCard from '@/components/SailorProductCard';
import { sailorCategories, sailorProducts, type SailorCategory } from '@/data/sailorProducts';
import siteBg from '@/assets/site-bg.jpg';
import { Anchor, Zap, Shield, MessageCircle } from 'lucide-react';

const SailorPiece = () => {
  const [filter, setFilter] = useState<SailorCategory | 'all'>('all');

  const grouped = useMemo(() => {
    return sailorCategories
      .map(c => ({ ...c, items: sailorProducts.filter(p => p.category === c.key) }))
      .filter(c => (filter === 'all' || filter === c.key) && c.items.length > 0);
  }, [filter]);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <img src={siteBg} alt="" className="w-full h-full object-cover blur-sm opacity-60" />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(280_100%_65%_/_0.1)_0%,_transparent_70%)]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 border border-border mb-4">
              <Anchor className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Nova Área · Roblox</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-3 tracking-tight leading-none">
              <span className="text-logo-sky drop-shadow-[0_0_20px_hsl(200,80%,60%,0.4)]">SAILOR</span>
              <span className="text-logo-yellow drop-shadow-[0_0_20px_hsl(50,80%,50%,0.4)] ml-2 md:ml-4">PIECE</span>
            </h1>
            <p className="font-body text-xs md:text-sm tracking-[0.25em] text-muted-foreground uppercase mb-6">
              Peça de Marinheiro · Loja Oficial
            </p>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
              Contas, Sets, Bounty, Game Pass e muito mais — entrega rápida via PIX
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { icon: Shield, label: 'Compra Segura' },
                { icon: Zap, label: 'Entrega Rápida' },
                { icon: MessageCircle, label: 'Suporte 24h' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsMarquee />

        {/* Category filter */}
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
              {sailorCategories.map(c => (
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

        {/* Sections */}
        {grouped.map(cat => (
          <section key={cat.key} id={`sp-${cat.key}`} className="py-10 md:py-14">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
                  <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">⚓</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
                </div>
                <h2 className="section-title text-foreground uppercase">{cat.label}</h2>
                <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                {cat.items.map(p => <SailorProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        ))}

        <HowItWorks />
        <TrustSection />
        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default SailorPiece;
