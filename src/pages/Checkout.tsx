import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Shield, Zap, Clock, Loader2 } from 'lucide-react';
import { allProducts, orderBumpProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().email('E-mail inválido').max(255),
  whatsapp: z.string().trim().min(10, 'WhatsApp inválido').max(20),
});

const Checkout = () => {
  const [params] = useSearchParams();
  const productId = params.get('produto');
  const product = useMemo(() => allProducts.find(p => p.id === productId), [productId]);

  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'pix'>('form');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());
  const [pixCode, setPixCode] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [orderId, setOrderId] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
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

  const bumpsTotal = orderBumpProducts
    .filter(b => selectedBumps.has(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  const totalPrice = product.price + bumpsTotal;

  // Convert to cents for Buckpay (amount is in cents)
  const totalAmountCents = Math.round(totalPrice * 100);

  const handleSubmit = async () => {
    const result = customerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(e => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const selectedBumpsList = orderBumpProducts
        .filter(b => selectedBumps.has(b.id))
        .map(b => ({ id: b.id, name: b.name, price: Math.round(b.price * 100) }));

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          product_id: product.id,
          product_name: product.name,
          amount: Math.round(product.price * 100),
          total_amount: totalAmountCents,
          bumps: selectedBumpsList,
          buyer: {
            name: form.name,
            email: form.email,
            phone: form.whatsapp.replace(/\D/g, ''),
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setOrderId(data.order_id);
      setPixCode(data.pix_code || data.buckpay?.data?.pix_code || data.buckpay?.pix_code || '');
      setPixQrCode(data.pix_qr_code || data.buckpay?.data?.pix_qr_code || data.buckpay?.pix_qr_code || '');
      setStep('pix');
    } catch (err: unknown) {
      console.error('Payment error:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao gerar pagamento';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
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
        {/* Product Summary */}
        <div className="card-gamer p-4 mb-6 flex items-center gap-4">
          <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-sm font-bold text-foreground truncate">{product.name}</h2>
            <p className="text-xs text-muted-foreground">Entrega automática</p>
          </div>
          <span className="font-display text-xl font-black text-primary whitespace-nowrap">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Order Bumps */}
        {step === 'form' && (
          <div className="card-gamer p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎮</span>
              <h3 className="font-display text-sm font-bold text-foreground">Adicione Gamepasses ao seu pedido</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {orderBumpProducts.map((bump) => {
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
                    <img
                      src={bump.image}
                      alt={bump.name}
                      className="w-full aspect-video object-cover rounded-lg mb-2"
                      loading="lazy"
                    />
                    <p className="text-xs font-bold text-foreground leading-tight mb-1">
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
                  {selectedBumps.size} gamepass{selectedBumps.size > 1 ? 'es' : ''} adicionado{selectedBumps.size > 1 ? 's' : ''}
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
                  placeholder="Seu nome"
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
                <label className="text-sm font-medium text-foreground mb-1 block">WhatsApp</label>
                <input
                  className="w-full h-11 rounded-lg border border-border bg-muted px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="(00) 00000-0000"
                  value={form.whatsapp}
                  onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
              </div>
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
          <div className="card-gamer p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/10 flex items-center justify-center">
              <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Pague com PIX</h3>
            <p className="text-sm text-muted-foreground mb-4">Copie o código abaixo e pague no app do seu banco</p>

            {/* QR Code */}
            {pixQrCode && (
              <div className="mb-4">
                <img src={pixQrCode} alt="QR Code PIX" className="mx-auto w-48 h-48 rounded-lg" />
              </div>
            )}

            {/* Order summary */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{product.name}</span>
                <span className="text-foreground font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</span>
              </div>
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

            {/* PIX Code */}
            {pixCode && (
              <>
                <div className="bg-muted rounded-lg p-3 mb-4 break-all text-xs text-muted-foreground text-left font-mono">
                  {pixCode}
                </div>

                <button onClick={handleCopy} className="btn-neon w-full text-sm py-3 flex items-center justify-center gap-2">
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
              Após o pagamento, a conta será enviada para seu e-mail e WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
