import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Shield, Zap, Clock } from 'lucide-react';
import { allProducts } from '@/data/products';
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

  const pixCode = '00020126580014br.gov.bcb.pix0136abc12345-defg-6789-hijk-lmnopqrstuv5204000053039865802BR5925SUPER BUY DIGITAL LTDA6009SAO PAULO62070503***6304ABCD';

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

  const handleSubmit = () => {
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
    setStep('pix');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {step === 'form' ? (
          <div className="card-gamer p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">Seus dados</h3>

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

            <button onClick={handleSubmit} className="btn-neon w-full text-sm py-3">
              Gerar PIX · R$ {product.price.toFixed(2).replace('.', ',')}
            </button>
          </div>
        ) : (
          <div className="card-gamer p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/10 flex items-center justify-center">
              <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Pague com PIX</h3>
            <p className="text-sm text-muted-foreground mb-6">Copie o código abaixo e pague no app do seu banco</p>

            <div className="bg-muted rounded-lg p-3 mb-4 break-all text-xs text-muted-foreground text-left font-mono">
              {pixCode}
            </div>

            <button onClick={handleCopy} className="btn-neon w-full text-sm py-3 flex items-center justify-center gap-2">
              {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar código PIX</>}
            </button>

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
