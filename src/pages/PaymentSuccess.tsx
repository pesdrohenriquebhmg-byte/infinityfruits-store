import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Zap, Clock, CheckCircle, ArrowRight, MessageCircle, Copy, Check, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SUPPORT_WHATSAPP = 'https://wa.me/553131574399?text=Ol%C3%A1!%20Tive%20um%20problema%20no%20pagamento%20da%20entrega%20priorit%C3%A1ria%20e%20preciso%20de%20ajuda.';

const friendlyPriorityError = (raw: string): string => {
  const r = (raw || '').toLowerCase();
  if (r.includes('não encontrados') || r.includes('comprador')) return raw;
  if (r.includes('failed to fetch') || r.includes('network') || r.includes('non-2xx')) {
    return 'Não conseguimos falar com o gateway agora. Verifique sua internet e tente de novo em instantes.';
  }
  if (r.includes('letras')) {
    return 'Seu nome contém caracteres não aceitos. Fale com a gente no WhatsApp para liberar manualmente.';
  }
  if (r.includes('500') || r.includes('400') || r.includes('buckpay')) {
    return 'Falha temporária ao gerar o PIX da prioridade. Tente novamente. Se persistir, chame no WhatsApp.';
  }
  return raw || 'Erro ao gerar pagamento. Tente novamente.';
};

type Step = 'demand' | 'priority-pix' | 'confirmed';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get('pedido') || localStorage.getItem('checkout_order_id');
  const [step, setStep] = useState<Step>('demand');
  const [choice, setChoice] = useState<'priority' | 'standard' | null>(null);

  // Priority payment state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [priorityOrderId, setPriorityOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [priorityPaid, setPriorityPaid] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Tick while waiting for priority PIX
  useEffect(() => {
    if (step !== 'priority-pix' || priorityPaid) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [step, priorityPaid]);

  const isLate = elapsed >= 5 * 60;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  // Retrieve buyer info from the original order's localStorage or fallback
  const getBuyerInfo = () => {
    try {
      const stored = localStorage.getItem('checkout_buyer');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return null;
  };

  const pollPriorityStatus = useCallback((oid: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase.rpc('get_order_status', { order_id: oid });
        if (data === 'paid') {
          clearInterval(interval);
          setPriorityPaid(true);
          setTimeout(() => {
            setChoice('priority');
            localStorage.setItem('delivery_preference', JSON.stringify({
              orderId,
              choice: 'priority',
              paid: true,
              timestamp: new Date().toISOString(),
            }));
            setStep('confirmed');
          }, 1500);
        }
      } catch { /* ignore */ }
    }, 5000);
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    return interval;
  }, [orderId]);

  const handlePriorityPayment = async () => {
    const buyer = getBuyerInfo();
    if (!buyer) {
      setError('Dados do comprador não encontrados. Tente fazer a compra novamente.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fallbackOrderId = orderId || `manual-${crypto.randomUUID()}`;

      const { data, error: fnError } = await supabase.functions.invoke('create-priority-payment', {
        body: {
          original_order_id: fallbackOrderId,
          buyer_name: buyer.name,
          buyer_email: buyer.email,
          buyer_phone: buyer.phone,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setPriorityOrderId(data.order_id);
      setPixCode(data.pix_code || '');
      setPixQrCode(data.pix_qr_code || '');
      setStep('priority-pix');

      if (data.order_id) {
        pollPriorityStatus(data.order_id);
      }
    } catch (err: unknown) {
      console.error('Priority payment error:', err);
      const raw = err instanceof Error ? err.message : 'Erro ao gerar pagamento';
      setError(friendlyPriorityError(raw));
    } finally {
      setLoading(false);
    }
  };

  const handleStandard = () => {
    setChoice('standard');
    localStorage.setItem('delivery_preference', JSON.stringify({
      orderId,
      choice: 'standard',
      timestamp: new Date().toISOString(),
    }));
    setStep('confirmed');
  };

  const handleCopy = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Step 1: High demand + priority upsell
  if (step === 'demand') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Alert header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-neon-yellow/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-neon-yellow" />
            </div>
            <h1 className="font-display text-xl md:text-2xl font-black text-foreground">
              🚨 Alta demanda na loja
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-3 leading-relaxed max-w-md mx-auto">
              Devido ao alto volume de pedidos recentes, nossa equipe está com uma fila de entregas em andamento.
            </p>
            <p className="text-muted-foreground text-xs md:text-sm mt-2 leading-relaxed max-w-md mx-auto">
              Para manter a qualidade e segurança das entregas, implementamos um <span className="text-foreground font-semibold">sistema de prioridade</span>:
            </p>
          </div>

          {error && (
            <div className="mb-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive font-medium leading-relaxed">{error}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handlePriorityPayment}
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

          {/* Priority option */}
          <button
            onClick={handlePriorityPayment}
            disabled={loading}
            className="w-full text-left card-gamer p-5 mb-3 border-2 border-primary/40 hover:border-primary transition-colors group relative overflow-hidden disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Recomendado</span>
                </div>
              </div>
              <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-1">
                ⚡ Entrega Automática Imediata
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Receba seu produto de forma automática e imediata pagando uma taxa única de <span className="text-primary font-bold">R$9,99</span>.
              </p>
              <div className="space-y-1.5 mb-4">
                {['Recebimento automático', 'Entrega imediata', 'Suporte acelerado'].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-neon-green shrink-0" />
                    <span className="text-xs text-foreground/80">{b}</span>
                  </div>
                ))}
              </div>
              <div className="btn-neon w-full text-xs md:text-sm py-3 flex items-center justify-center gap-2 font-bold">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  <>
                    QUERO RECEBER MAIS RÁPIDO
                    <Zap className="w-4 h-4" />
                  </>
                )}
              </div>
            </div>
          </button>

          {/* Standard option */}
          <button
            onClick={handleStandard}
            disabled={loading}
            className="w-full text-left card-gamer p-4 border border-border hover:border-muted-foreground/30 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-display text-sm font-bold text-muted-foreground">
                ⏳ Entrega padrão (gratuita)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground/70 mb-3">
              Seu pedido será entregue em até <span className="font-semibold text-muted-foreground">30 dias úteis</span>, respeitando a ordem da fila.
            </p>
            <div className="w-full text-center text-xs py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
              POSSO AGUARDAR
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Priority PIX payment
  if (step === 'priority-pix') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {priorityPaid ? (
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-neon-green/10 flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-10 h-10 text-neon-green" />
                </div>
              </div>
              <h2 className="font-display text-xl font-black text-foreground mb-2">
                ⚡ Pagamento confirmado!
              </h2>
              <p className="text-muted-foreground text-sm">Redirecionando...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-black text-foreground mb-2">
                  ⚡ Entrega Automática Imediata
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Pague <span className="text-primary font-bold">R$ 9,99</span> via PIX para receber automaticamente
                </p>
              </div>

              <div className="card-gamer p-6 text-center">
                {pixQrCode && (
                  <div className="mb-4">
                    <img src={pixQrCode} alt="QR Code PIX" className="mx-auto w-48 h-48 rounded-lg" />
                  </div>
                )}

                {pixCode && (
                  <>
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Código PIX copia e cola:</p>
                      <p className="text-xs font-mono text-foreground break-all leading-relaxed">{pixCode}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="btn-neon w-full text-sm py-3 flex items-center justify-center gap-2 mb-4"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar código PIX
                        </>
                      )}
                    </button>
                  </>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Aguardando pagamento...
                </div>
              </div>

              <button
                onClick={handleStandard}
                className="w-full mt-4 text-center text-xs py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar e usar entrega padrão
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Confirmation + support channels + upsells link
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-neon-green/10 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-10 h-10 text-neon-green" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-neon-green/30 animate-ping" />
        </div>

        <h1 className="font-display text-xl md:text-2xl font-black text-foreground mb-2">
          {choice === 'priority' ? '⚡ Prioridade ativada!' : '✅ Pedido registrado!'}
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm mb-6 leading-relaxed">
          {choice === 'priority'
            ? 'Sua prioridade foi confirmada! Agora, entre em contato pelo WhatsApp ou Discord e envie os dois comprovantes de pagamento (produto principal + taxa de prioridade) para garantir sua entrega acelerada:'
            : 'Nosso suporte já foi notificado sobre o seu pedido. Para garantir sua entrega, entre em contato através de um dos canais abaixo:'}
        </p>

        {orderId && (
          <div className="card-gamer p-4 mb-5 text-left">
            <p className="text-xs text-muted-foreground mb-1">ID do pedido</p>
            <p className="text-xs md:text-sm font-mono text-foreground break-all">{orderId}</p>
          </div>
        )}

        {choice === 'priority' && (
          <div className="card-gamer p-4 mb-5 border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">Entrega Automática Imediata Ativada</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Seu pedido será processado e entregue automaticamente!
            </p>
            <div className="bg-neon-yellow/5 border border-neon-yellow/20 rounded-lg p-3">
              <p className="text-xs font-bold text-neon-yellow mb-1">⚠️ Importante:</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ao entrar em contato, envie os <span className="text-foreground font-semibold">dois comprovantes de pagamento</span>:
              </p>
              <ul className="text-xs text-muted-foreground mt-1.5 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-neon-green shrink-0" />
                  Comprovante do produto principal
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-neon-green shrink-0" />
                  Comprovante da taxa de prioridade (R$ 9,99)
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Support buttons */}
        <div className="flex gap-3 mb-5">
          <a
            href="https://wa.me/553131574399?text=Olá! Preciso de suporte sobre meu pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-neon py-3 flex items-center justify-center gap-2 text-xs md:text-sm font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <a
            href="https://discord.gg/KXTTMRhgJ8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-xs md:text-sm text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors font-bold"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
            Discord
          </a>
        </div>

        {/* Existing upsell CTA */}
        <Link
          to={`/ofertas-especiais?pedido=${orderId || ''}`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 border border-accent/30 text-xs md:text-sm text-accent hover:bg-accent/20 transition-colors font-bold mb-4"
        >
          🎁 Ver ofertas exclusivas
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
