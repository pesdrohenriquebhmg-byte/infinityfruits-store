import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "./components/CartDrawer";
import PromoPopup from "./components/PromoPopup";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import SpecialOffers from "./pages/SpecialOffers";
import SailorPiece from "./pages/SailorPiece";
import About from "./pages/About";
import Refund from "./pages/Refund";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <CartDrawer />
          <PromoPopup />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pagamento-confirmado" element={<PaymentSuccess />} />
            <Route path="/ofertas-especiais" element={<SpecialOffers />} />
            <Route path="/sailor-piece" element={<SailorPiece />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/reembolso" element={<Refund />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/politica-privacidade" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
