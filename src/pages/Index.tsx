import FraudAlert from '@/components/FraudAlert';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import ProductSection from '@/components/ProductSection';
import HowItWorks from '@/components/HowItWorks';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { permProducts, godhumanProducts } from '@/data/products';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FraudAlert />
      <Navbar />
      <HeroBanner />
      <TestimonialsMarquee />
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
      <HowItWorks />
      <TrustSection />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
