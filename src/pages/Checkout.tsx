import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Shield, Zap, Clock, Loader2, MessageCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { allProducts, orderBumpProducts } from '@/data/products';
import { sailorProducts } from '@/data/sailorProducts';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { z } from 'zod';

const SUPPORT_WHATSAPP = 'https://wa.me/553131574399?text=Ol%C3%A1!%20Tive%20um%20problema%20no%20pagamento%20do%20meu%20pedido%20e%20preciso%20de%20ajuda.';
const MIN_PIX_AMOUNT = 6;

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

// Map raw API errors into friendly Portuguese messages
const friendlyError = (raw: string): string => {
  const r = (raw || '').toLowerCase();
  if (r.includes('letras') || r.includes('apenas letras')) {
    return 'Seu nome contém caracteres não aceitos pelo PIX. Use apenas letras (sem números ou símbolos) — pode ser seu nome real. Se preferir, fale com a gente no WhatsApp.';
  }
  if (r.includes('email')) return 'O e-mail informado parece inválido. Confira e tente novamente.';
  if (r.includes('phone') || r.includes('whatsapp')) return 'Número de WhatsApp inválido. Use DDD + 9 + 8 dígitos.';
  if (r.includes('amount') || r.includes('valor mínimo') || r.includes('minimo')) {
    return 'O valor mínimo para gerar PIX é R$ 6,00. Adicione outro produto recomendado ao pedido e tente novamente.';
  }
  if (r.includes('failed to fetch') || r.includes('network') || r.includes('non-2xx')) {
    return 'Não conseguimos falar com o gateway de pagamento agora. Verifique sua internet e tente novamente em instantes.';
  }
  if (r.includes('buckpay') || r.includes('500') || r.includes('400')) {
    return 'Falha temporária ao gerar seu PIX. Tente novamente em alguns segundos. Se persistir, fale com a gente no WhatsApp.';
  }
  return raw || 'Erro inesperado ao gerar o pagamento. Tente novamente.';
};

const getPaymentErrorMessage = async (err: unknown): Promise<string> => {
  if (!(err instanceof Error)) return 'Erro ao gerar pagamento';

  const context = (err as Error & { context?: unknown }).context;
  if (context instanceof Response) {
    try {
      const payload = await context.clone().json();
      if (typeof payload?.error === 'string') return payload.error;
    } catch {
      try {
        const text = await context.clone().text();
        if (text) return text;
      } catch { /* ignore */ }
    }
  }

  return err.message;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCPF = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const isValidCPF = (raw: string): boolean => {
  const cpf = raw.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
};

const customerSchema = z.object({
  name: z.string().trim().min(3, 'Usuário do Roblox deve ter pelo menos 3 caracteres').max(20, 'Máximo 20 caracteres')
    .refine(v => /^[a-zA-Z0-9_]+$/.test(v), 'Apenas letras, números e _ (formato Roblox)'),
  email: z.string().trim().email('E-mail inválido').max(255),
  whatsapp: z.string().trim()
    .transform(v => v.replace(/\D/g, ''))
    .refine(v => /^[1-9]{2}9\d{8}$/.test(v), 'WhatsApp inválido. Use DDD + 9 + 8 dígitos (número real)'),
  cpf: z.string().trim()
    .transform(v => v.replace(/\D/g, ''))
    .refine(v => v.length === 11, 'CPF deve ter 11 dígitos')
    .refine(v => isValidCPF(v), 'CPF inválido. Confira os números'),
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
  const [pixElapsed, setPixElapsed] = useState(0);

  // Tick a counter while waiting for PIX confirmation
  useEffect(() => {
    if (step !== 'pix') return;
    setPixElapsed(0);
    const t = setInterval(() => setPixElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [step]);

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
  const minimumMissing = Math.max(0, MIN_PIX_AMOUNT - totalPrice);
  const isBelowMinimumPix = totalPrice < MIN_PIX_AMOUNT;

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

    if (isBelowMinimumPix) {
      setErrors({
        general: `O valor mínimo para gerar PIX é ${formatCurrency(MIN_PIX_AMOUNT)}. Adicione mais ${formatCurrency(minimumMissing)} em produtos recomendados para continuar.`,
      });
      return;
    }

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
      const raw = await getPaymentErrorMessage(err);
      setErrors({ general: friendlyError(raw) });
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
        {/* Selos de confiança */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          {[
            { icon: Zap, label: 'Aprovação Instantânea' },
            { icon: Shield, label: 'Pagamento Seguro' },
            { icon: Clock, label: 'Entrega Rápida' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-card/70 border border-border/60">
              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium text-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Products Summary */}
        <div className="card-gamer p-4 mb-6 space-y-3">
          {checkoutItems.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <img src={item.image} alt={item.name} width="56" height="56" loading="lazy" decoding="async" className="w-14 h-14 object-contain" />
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
                    + {formatCurrency(bumpsTotal)}
                  </span>
              </div>
            )}
          </div>
        )}

        {step === 'form' ? (
          <div className="card-gamer p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">Seus dados</h3>

            {isBelowMinimumPix && !errors.general && (
              <div className="mb-4 p-4 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-neon-yellow shrink-0 mt-0.5" />
                  <p className="text-xs text-neon-yellow font-medium leading-relaxed">
                    O PIX só pode ser gerado a partir de {formatCurrency(MIN_PIX_AMOUNT)}. Adicione mais {formatCurrency(minimumMissing)} nos produtos recomendados acima para liberar o pagamento.
                  </p>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive font-medium leading-relaxed">{errors.general}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
                  </button>
                  <a
                    href={SUPPORT_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Falar no WhatsApp
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Usuário do Roblox</label>
                <input
                  className="w-full h-11 rounded-lg border border-border bg-muted px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: PlayerPro_BR123"
                  value={form.name}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value.replace(/\s/g, '') }))}
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
              disabled={loading || isBelowMinimumPix}
              className="btn-neon w-full text-sm py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                isBelowMinimumPix ? `Pedido mínimo ${formatCurrency(MIN_PIX_AMOUNT)}` : `Gerar PIX · ${formatCurrency(totalPrice)}`
              )}
            </button>
          </div>
        ) : (
          <PixStep
            checkoutItems={checkoutItems}
            totalPrice={totalPrice}
            selectedBumps={selectedBumps}
            availableBumps={availableBumps}
            pixCode={pixCode}
            pixQrCode={pixQrCode}
            copied={copied}
            onCopy={handleCopy}
            elapsed={pixElapsed}
          />
        )}
      </div>
    </div>
  );
};

// Extracted PIX display component
function PixStep({ checkoutItems, totalPrice, selectedBumps, availableBumps, pixCode, pixQrCode, copied, onCopy, elapsed }: {
  checkoutItems: { id: string; name: string; price: number; quantity: number }[];
  totalPrice: number;
  selectedBumps: Set<string>;
  availableBumps: { id: string; name: string; price: number; emoji?: string }[];
  pixCode: string;
  pixQrCode: string;
  copied: boolean;
  onCopy: () => void;
  elapsed: number;
}) {
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const isLate = elapsed >= 5 * 60; // 5 min without confirmation

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
        {availableBumps.filter(b => selectedBumps.has(b.id)).map(b => (
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

      {/* Live status / countdown */}
      <div className={`mt-6 p-3 rounded-lg border ${isLate ? 'bg-destructive/5 border-destructive/30' : 'bg-neon-yellow/5 border-neon-yellow/20'}`}>
        <div className="flex items-center justify-center gap-2">
          {isLate ? (
            <AlertTriangle className="w-4 h-4 text-destructive" />
          ) : (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neon-yellow" />
          )}
          <p className={`text-xs font-medium ${isLate ? 'text-destructive' : 'text-neon-yellow'}`}>
            {isLate
              ? `Pagamento ainda não detectado (${mins}m${secs.toString().padStart(2, '0')}s)`
              : `Aguardando pagamento... ${mins}m${secs.toString().padStart(2, '0')}s`}
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
          {isLate
            ? 'Já pagou e nada aconteceu? Os bancos podem demorar alguns minutos. Se persistir, fale com a gente — vamos liberar manualmente.'
            : 'Confirmamos automaticamente em até 5 minutos. Após o pagamento, você será redirecionado.'}
        </p>
        {isLate && (
          <a
            href={SUPPORT_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors w-full"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Falar com suporte no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export default Checkout;
