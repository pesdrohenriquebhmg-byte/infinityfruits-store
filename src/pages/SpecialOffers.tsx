import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Shield, Star } from 'lucide-react';

const upsellOffers = [
  {
    id: 'conta-premium',
    name: 'God Account — Todas as Frutas PERM',
    description: 'Conta completa com TODAS as frutas permanentes, godhuman, V4 e muito mais. A conta definitiva.',
    originalPrice: 169.90,
    price: 129.90,
    image: '/images/conta-premium.webp',
    badge: '🔥 OFERTA EXCLUSIVA',
    highlights: ['Todas as frutas PERM', 'Godhuman incluso', 'V4 desbloqueado', 'Gamepasses inclusos'],
  },
  {
    id: 'kitsune',
    name: 'Kitsune PERM',
    description: 'A fruta Kitsune permanente — uma das mais cobiçadas do jogo.',
    originalPrice: 24.90,
    price: 19.90,
    image: '/images/kitsune-hq.png',
    badge: '⚡ COMBO',
    highlights: ['Kitsune permanente', 'Entrega imediata', 'Economia de R$ 5'],
  },
  {
    id: 'dragon',
    name: 'Dragon PERM',
    description: 'Dragon permanente — poder de fogo máximo para dominar qualquer batalha.',
    originalPrice: 22.90,
    price: 17.90,
    image: '/images/dragon-hq.png',
    badge: '💎 POPULAR',
    highlights: ['Dragon permanente', 'Entrega imediata', 'Economia de R$ 5'],
  },
];

const SpecialOffers = () => {
  const [params] = useSearchParams();
  const orderId = params.get('pedido');
  const [endTime] = useState(() => Date.now() + 15 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState('15:00');

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link to={`/pagamento-confirmado?pedido=${orderId || ''}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-yellow" />
            <span className="font-display text-sm font-bold text-neon-yellow">{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-neon-yellow/10 border border-neon-yellow/20 mb-4">
            <Zap className="w-4 h-4 text-neon-yellow" />
            <span className="text-[10px] md:text-xs font-bold text-neon-yellow">OFERTAS EXCLUSIVAS PÓS-COMPRA</span>
          </div>
          <h1 className="font-display text-xl md:text-3xl font-black text-foreground mb-2">
            Aproveite preços especiais! 🎁
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Ofertas válidas por tempo limitado, apenas para quem acabou de comprar.
          </p>
        </div>

        {/* Offers */}
        <div className="space-y-4">
          {upsellOffers.map((offer) => (
            <div key={offer.id} className="card-gamer p-4 md:p-5 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-3 right-3">
                <span className="text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-1 rounded-full bg-neon-yellow/10 border border-neon-yellow/20 text-neon-yellow">
                  {offer.badge}
                </span>
              </div>

              <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                <img src={offer.image} alt={offer.name} className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0" />
                <div className="min-w-0 pt-1">
                  <h3 className="font-display text-xs md:text-sm font-bold text-foreground mb-1 pr-16">{offer.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed line-clamp-2">{offer.description}</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                {offer.highlights.map((h, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground bg-muted/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-neon-yellow" />
                    {h}
                  </span>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                    R$ {offer.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <div className="font-display text-lg md:text-xl font-black text-primary">
                    R$ {offer.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <Link
                  to={`/checkout?produto=${offer.id}`}
                  className="btn-neon text-[10px] md:text-xs px-3 md:px-5 py-2 md:py-2.5 flex items-center gap-1.5 md:gap-2 shrink-0"
                >
                  <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  Quero essa oferta
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 md:mt-8 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-neon-green" />
            Compra segura
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-neon-yellow" />
            Entrega automática
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">
            Não, obrigado. Voltar à loja.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
