import { useEffect, useState } from 'react';
import { X, Gift, Copy, Check } from 'lucide-react';

const STORAGE_KEY = 'infinity_promo_shown_v1';
const COUPON = 'INFINITY10';

const PromoPopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 12000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  const copy = () => {
    navigator.clipboard.writeText(COUPON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden">
        <button
          onClick={close}
          aria-label="Fechar"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 border border-border hover:bg-background flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-br from-primary/15 via-card to-logo-yellow/10 p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <p className="text-xs font-display font-bold uppercase tracking-[0.2em] text-primary mb-1">
            Oferta de boas-vindas
          </p>
          <h3 className="font-display text-2xl font-black text-foreground mb-2">
            10% OFF na sua primeira compra
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Use o cupom abaixo no WhatsApp ao finalizar seu pedido.
          </p>

          <button
            onClick={copy}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-background border-2 border-dashed border-primary/50 hover:border-primary transition-colors"
          >
            <span className="font-display text-lg font-black text-primary tracking-widest">{COUPON}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              {copied ? <><Check className="w-4 h-4 text-neon-green" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
            </span>
          </button>

          <button
            onClick={close}
            className="mt-4 w-full h-11 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
          >
            Quero aproveitar
          </button>

          <p className="text-[10px] text-muted-foreground mt-3">
            Cupom válido por tempo limitado · Uma vez por cliente
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
