import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import ProductSection from '@/components/ProductSection';
import PremiumProductSection from '@/components/PremiumProductSection';
import HowItWorks from '@/components/HowItWorks';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { permProducts, godhumanProducts, miticaProducts, v4Products, fisicaProducts } from '@/data/products';
import siteBg from '@/assets/site-bg.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image with blur and low opacity */}
      <div className="fixed inset-0 z-0">
        <img src={siteBg} alt="" className="w-full h-full object-cover blur-sm" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroBanner />
        <TestimonialsMarquee />
        <PremiumProductSection />
        <ProductSection
          id="produtos"
          title="CONTAS PERM"
          subtitle="Frutas permanentes com entrega imediata"
          products={permProducts}
        />
        <ProductSection
          title="CONTAS COM GODHUMAN"
          subtitle="Combos especiais com Godhuman + Míticas"
          products={godhumanProducts}
        />
        <ProductSection
          title="MÍTICA ALEATÓRIA"
          subtitle="Contas com frutas míticas sorteadas — preço imbatível"
          products={miticaProducts}
        />
        <ProductSection
          title="CONTAS V4"
          subtitle="Contas com raça V4 desbloqueada"
          products={v4Products}
        />
        <ProductSection
          title="FRUTAS FÍSICAS"
          subtitle="Frutas físicas avulsas para sua conta"
          products={fisicaProducts}
        />
        <HowItWorks />
        <TrustSection />
        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default Index;
