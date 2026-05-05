import { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Shield, Zap, Clock, Loader2 } from 'lucide-react';
import { allProducts, orderBumpProducts } from '@/data/products';
import { sailorProducts } from '@/data/sailorProducts';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { z } from 'zod';

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const customerSchema = z.object({
  name: z.string().trim().min(3, 'Usuário do Roblox deve ter pelo menos 3 caracteres').max(20, 'Máximo 20 caracteres')
    .refine(v => /^[a-zA-Z0-9_]+$/.test(v), 'Apenas letras, números e _ (formato Roblox)'),
  email: z.string().trim().email('E-mail inválido').max(255),
  whatsapp: z.string().trim()
    .transform(v => v.replace(/\D/g, ''))
    .refine(v => /^[1-9]{2}9\d{8}$/.test(v), 'WhatsApp inválido. Use DDD + 9 + 8 dígitos (número real)'),
  terms: z.literal(true, { errorMap: () => ({ message: 'Você precisa aceitar os termos' }) }),
});

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cart = useCart();

  const isCartMode = params.get('carrinho') === 'true';
  const productId = params.get('produto');
  const singleProduct = useMemo(() => {
    if (!productId) return undefined;
    const blox = allProducts.find(p => p.id === productId);
    if (blox) return { id: blox.id, name: blox.name, price: blox.price, image: blox.image };
    const sp = sailorProducts.find(p => p.id === productId);
    if (sp) return { id: sp.id, name: sp.name, price: sp.price, image: sp.image };
    return undefined;
  }, [productId]);

  // Detect if checkout has any Sailor Piece items (id prefix 'sp-')
  const isSailorCheckout = useMemo(() => {
    const ids = (params.get('carrinho') === 'true')
      ? cart.items.map(i => i.product.id)
      : (singleProduct ? [singleProduct.id] : []);
    return ids.length > 0 && ids.every(id => id.startsWith('sp-'));
  }, [params, cart.items, singleProduct]);

  // Build the list of items to checkout
  const checkoutItems = useMemo(() => {
    if (isCartMode) {
      return cart.items.map(i => ({ ...i.product, quantity: i.quantity }));
    }
    if (singleProduct) {
      return [{ ...singleProduct, quantity: 1 }];
    }
    return [];
  }, [isCartMode, cart.items, singleProduct]);

  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'pix'>('form');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());
  const [pixCode, setPixCode] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [orderId, setOrderId] = useState('');

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            {isCartMode ? 'Carrinho vazio' : 'Produto não encontrado'}
          </h1>
          <Link to="/" className="btn-neon inline-block text-sm">Voltar à loja</Link>
        </div>
      </div>
    );
  }

  const toggleBump = (id: string) => {
    setSelectedBumps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bumps source depends on checkout type:
  // - Blox Fruits: gamepass order bumps (with emoji)
  // - Sailor Piece: recommended products from the store
  const availableBumps = useMemo(() => {
    if (isSailorCheckout) {
      const inCart = new Set(checkoutItems.map(i => i.id));
      return sailorProducts
        .filter(p => !inCart.has(p.id))
        .slice(0, 6)
        .map(p => ({ id: p.id, name: p.name, price: p.price, image: p.image, emoji: '⭐' }));
    }
    return orderBumpProducts;
  }, [isSailorCheckout, checkoutItems]);

  const itemsSubtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bumpsTotal = availableBumps
    .filter(b => selectedBumps.has(b.id))
    .reduce((sum, b) => sum + b.price, 0);
  const totalPrice = itemsSubtotal + bumpsTotal;
  const totalAmountCents = Math.round(totalPrice * 100);

  // For payment, use first product as main or combine names
  const combinedProductName = checkoutItems.map(i => i.quantity > 1 ? `${i.name} x${i.quantity}` : i.name).join(' + ');
  const mainProductId = checkoutItems[0].id;

  const handleSubmit = async () => {
    const result = customerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(e => {
        const field = e.path[0] as string;
        if (field && !fieldErrors[field]) fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const phone = form.whatsapp.replace(/\D/g, '');
      const selectedBumpsList = availableBumps
        .filter(b => selectedBumps.has(b.id))
        .map(b => ({ id: b.id, name: b.name, price: Math.round(b.price * 100) }));

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          product_id: mainProductId,
          product_name: combinedProductName,
          amount: Math.round(itemsSubtotal * 100),
          total_amount: totalAmountCents,
          bumps: selectedBumpsList,
          buyer: { name: form.name, email: form.email, phone },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setOrderId(data.order_id);
      setPixCode(data.pix_code || '');
      setPixQrCode(data.pix_qr_code || '');
      setStep('pix');

      // Save buyer info and order ID for priority payment upsell
      localStorage.setItem('checkout_buyer', JSON.stringify({
        name: form.name,
        email: form.email,
        phone,
      }));
      localStorage.setItem('checkout_order_id', data.order_id);

      if (isCartMode) cart.clearCart();

      if (data.order_id) {
        pollPaymentStatus(data.order_id);
      }
    } catch (err: unknown) {
      console.error('Payment error:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao gerar pagamento';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = (oid: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase.rpc('get_order_status', { order_id: oid });
        if (data === 'paid') {
          clearInterval(interval);
          navigate(`/pagamento-confirmado?pedido=${oid}`);
        }
      } catch { /* ignore */ }
    }, 5000);
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
  };

  const handleCopy = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <span className="font-display text-sm font-bold text-foreground ml-auto">CHECKOUT</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Products Summary */}
        <div className="card-gamer p-4 mb-6 space-y-3">
          {checkoutItems.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-sm font-bold text-foreground truncate">{item.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {item.quantity > 1 ? `${item.quantity}x · ` : ''}Entrega automática
                </p>
              </div>
              <span className="font-display text-lg font-black text-primary whitespace-nowrap">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
          {checkoutItems.length > 1 && (
            <div className="pt-2 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Subtotal ({checkoutItems.length} itens)</span>
              <span className="font-display text-sm font-bold text-foreground">
                R$ {itemsSubtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
        </div>

        {/* Order Bumps */}
        {step === 'form' && (
          <div className="card-gamer p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{isSailorCheckout ? '⭐' : '🎮'}</span>
              <h3 className="font-display text-sm font-bold text-foreground">
                {isSailorCheckout ? 'Produtos recomendados da loja' : 'Adicione Gamepasses ao seu pedido'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableBumps.map((bump) => {
                const isSelected = selectedBumps.has(bump.id);
                return (
                  <button
                    key={bump.id}
                    onClick={() => toggleBump(bump.id)}
                    className={`relative rounded-xl border-2 p-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.2)]'
                        : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <img src={bump.image} alt={bump.name} className="w-full aspect-video object-cover rounded-lg mb-2" loading="lazy" />
                    <p className="text-xs font-bold text-foreground leading-tight mb-1 line-clamp-2">
                      {bump.emoji} {bump.name.replace(' (Gamepass)', '')}
                    </p>
                    <p className="font-display text-sm font-black text-primary">
                      + R$ {bump.price.toFixed(2).replace('.', ',')}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedBumps.size > 0 && (
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedBumps.size} {isSailorCheckout ? 'produto' : 'gamepass'}{selectedBumps.size > 1 ? (isSailorCheckout ? 's' : 'es') : ''} adicionado{selectedBumps.size > 1 ? 's' : ''}
                </span>
                <span className="font-display text-sm font-bold text-primary">
                  + R$ {bumpsTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
          </div>
        )}

        {step === 'form' ? (
          <div className="card-gamer p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">Seus dados</h3>

            {errors.general && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive font-medium">{errors.general}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nome completo</label>
                <input
                  className="w-full h-11 rounded-lg border border-border bg-muted px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">E-mail</label>
                <input
                  type="email"
                  className="w-full h-11 rounded-lg border border-border bg-muted px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">WhatsApp (com DDD)</label>
                <input
                  className="w-full h-11 rounded-lg border border-border bg-muted px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="(11) 99999-9999"
                  value={form.whatsapp}
                  maxLength={15}
                  onChange={e => setForm(p => ({ ...p, whatsapp: formatPhone(e.target.value) }))}
                />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
              </div>

              {/* Terms checkbox */}
              <div
                onClick={() => setForm(p => ({ ...p, terms: !p.terms }))}
                className="flex items-start gap-3 cursor-pointer select-none group"
                role="checkbox"
                aria-checked={form.terms}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    form.terms
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-muted-foreground'
                  }`}
                >
                  {form.terms && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Li e concordo com os{' '}
                  <a href="/termos" target="_blank" onClick={e => e.stopPropagation()} className="text-primary underline hover:text-primary/80">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="/politica-privacidade" target="_blank" onClick={e => e.stopPropagation()} className="text-primary underline hover:text-primary/80">
                    Política de Privacidade
                  </a>
                </span>
              </div>
              {errors.terms && <p className="text-xs text-destructive -mt-2">{errors.terms}</p>}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-6 mb-6">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-neon-green" />
                Compra segura
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-neon-yellow" />
                Entrega automática
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Suporte 24h
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-neon w-full text-sm py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                `Gerar PIX · R$ ${totalPrice.toFixed(2).replace('.', ',')}`
              )}
            </button>
          </div>
        ) : (
          <PixStep
            checkoutItems={checkoutItems}
            totalPrice={totalPrice}
            selectedBumps={selectedBumps}
            pixCode={pixCode}
            pixQrCode={pixQrCode}
            copied={copied}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

// Extracted PIX display component
function PixStep({ checkoutItems, totalPrice, selectedBumps, pixCode, pixQrCode, copied, onCopy }: {
  checkoutItems: { id: string; name: string; price: number; quantity: number }[];
  totalPrice: number;
  selectedBumps: Set<string>;
  pixCode: string;
  pixQrCode: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="card-gamer p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/10 flex items-center justify-center">
        <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-8 h-8" />
      </div>
      <h3 className="font-display text-lg font-bold text-foreground mb-2">Pague com PIX</h3>
      <p className="text-sm text-muted-foreground mb-4">Copie o código abaixo e pague no app do seu banco</p>

      {pixQrCode && (
        <div className="mb-4">
          <img src={pixQrCode} alt="QR Code PIX" className="mx-auto w-48 h-48 rounded-lg" />
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-3 mb-4 text-left text-xs space-y-1">
        {checkoutItems.map(item => (
          <div key={item.id} className="flex justify-between">
            <span className="text-muted-foreground">
              {item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}
            </span>
            <span className="text-foreground font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
        {orderBumpProducts.filter(b => selectedBumps.has(b.id)).map(b => (
          <div key={b.id} className="flex justify-between">
            <span className="text-muted-foreground">{b.emoji} {b.name.replace(' (Gamepass)', '')}</span>
            <span className="text-foreground font-medium">R$ {b.price.toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-border font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-primary font-display">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {pixCode && (
        <>
          <div className="bg-muted rounded-lg p-3 mb-4 break-all text-xs text-muted-foreground text-left font-mono">
            {pixCode}
          </div>
          <button onClick={onCopy} className="btn-neon w-full text-sm py-3 flex items-center justify-center gap-2">
            {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar código PIX</>}
          </button>
        </>
      )}

      {!pixCode && !pixQrCode && (
        <div className="p-3 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20 mb-4">
          <p className="text-xs text-neon-yellow font-medium">⏳ Processando pagamento... Aguarde as instruções de pagamento.</p>
        </div>
      )}

      <div className="mt-6 p-3 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20">
        <p className="text-xs text-neon-yellow font-medium">⏱ O pagamento é confirmado automaticamente em até 5 minutos</p>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Após o pagamento, você será redirecionado automaticamente.
      </p>
    </div>
  );
}

export default Checkout;
