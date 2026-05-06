import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const PremiumProductSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();
  const [showDesc, setShowDesc] = useState(false);

  return (
    <section id="premium" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">👑</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="section-title text-foreground">CONTA PREMIUM</h2>
          <p className="text-muted-foreground mt-2 text-lg">A conta mais completa e rara do Blox Fruits</p>
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="max-w-lg mx-auto">
          <div className="card-gamer overflow-hidden relative">
            {/* Badge */}
            <div className="px-3 pt-3">
              <span className="badge-mythical">👑 Supreme</span>
            </div>

            {/* Image */}
            <div className="p-4 flex items-center justify-center h-52 md:h-64 bg-gradient-to-b from-muted/20 to-transparent">
              <img
                src="/images/conta-premium.webp"
                alt="Conta Premium"
                width="320"
                height="320"
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain drop-shadow-[0_0_30px_hsl(45,100%,50%,0.4)] hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="font-display text-lg font-bold text-foreground mb-2">Conta Premium — God Account</h3>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-display font-black text-primary glow-text-cyan">
                  R$ 169,90
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <img src="https://cdn.centralcart.io/public/gateway-icons/icon-pix.svg" alt="PIX" className="w-4 h-4" />
                À vista no Pix
              </p>

              {/* Description toggle */}
              <button
                onClick={() => setShowDesc(!showDesc)}
                className="w-full flex items-center justify-center gap-2 py-2 mb-3 rounded-lg border border-border bg-muted/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Crown className="w-4 h-4" />
                {showDesc ? 'Fechar descrição' : 'Ler descrição da conta'}
                {showDesc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDesc && (
                <div className="mb-4 p-4 rounded-xl bg-muted/50 border border-border text-left text-xs text-muted-foreground space-y-3 max-h-[60vh] overflow-y-auto animate-in slide-in-from-top-2 duration-300">
                  <p className="text-foreground font-bold text-sm">👑 CONTA PREMIUM</p>
                  <p>A conta mais completa, rara e valiosa da loja. Criada para quem quer DOMINAR 100% do Blox Fruits sem limites. PvP, PvE, Raids, Trades e Endgame no nível máximo possível.</p>
                  <p className="text-foreground font-semibold">👉 Essa conta TEM TUDO QUE EXISTE NO JOGO.</p>
                  <p><strong className="text-foreground">Status:</strong> FULL ENDGAME REAL<br/><strong className="text-foreground">Categoria:</strong> Supreme / God Account<br/><strong className="text-foreground">Exclusividade:</strong> Máxima (TOP 1 da loja)</p>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">🍍 FRUTAS (PERM + INVENTÁRIO COMPLETO)</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ TODAS as frutas PERM do jogo</li>
                      <li>✅ Todas as frutas Mythical no inventário</li>
                      <li>✅ Todas as frutas awakenadas (V2)</li>
                      <li>✅ Dragon V2 (Eastern + Western)</li>
                      <li>✅ Kitsune, Leopard, Dough, Buddha, Spirit, Venom, Control, Shadow, Mammoth, T-Rex, Blizzard, Portal, Phoenix, Rumble, Light, Ice, Magma, Flame e todas as demais.</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">⚔️ ARMAS & ITENS (100% COMPLETO)</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ Cursed Dual Katana (CDK)</li>
                      <li>✅ Dark Blade V3</li>
                      <li>✅ Yama + Tushita</li>
                      <li>✅ Todas as espadas lendárias e míticas</li>
                      <li>✅ Todas as armas de bosses, raids e eventos</li>
                      <li>✅ Todos os itens raros e limitados do jogo</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">🥋 HAKI & COMBATE</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ Buso V2 MAX</li>
                      <li>✅ Ken V2 MAX</li>
                      <li>✅ Instinct V2 MAX</li>
                      <li>✅ Godhuman desbloqueado</li>
                      <li>✅ Todos os estilos de luta maximizados</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">🧬 RAÇAS & TRANSFORMAÇÕES</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ TODAS as Raças V4 desbloqueadas (Human, Shark, Mink, Angel e Ghoul)</li>
                      <li>✅ Todas com upgrades máximos</li>
                      <li>✅ Formas híbridas e transformações ativas</li>
                      <li>✅ Mobilidade aérea e terrestre extrema</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">🛡️ PASSIVAS & VANTAGENS</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ Redução massiva de dano</li>
                      <li>✅ Imunidade a stun</li>
                      <li>✅ Voo ilimitado</li>
                      <li>✅ Tank extremo para PvP e Raids</li>
                      <li>✅ Burst damage e controle total do jogo</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">🏆 STATUS DA CONTA</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ Level Máximo</li>
                      <li>✅ FULL ENDGAME REAL</li>
                      <li>✅ Pronta para PvP competitivo</li>
                      <li>✅ Ideal para raids, boss hunt e trades de alto valor</li>
                      <li>✅ Uma das contas mais raras possíveis no Blox Fruits</li>
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-foreground font-bold mb-1">🎯 IDEAL PARA QUEM QUER:</p>
                    <ul className="space-y-0.5 pl-1">
                      <li>✅ Dominar qualquer PvP</li>
                      <li>✅ Ter TUDO do jogo sem exceção</li>
                      <li>✅ Status, poder e exclusividade máxima</li>
                      <li>✅ Nunca mais precisar upar nada</li>
                      <li>✅ Ter a conta definitiva do Blox Fruits</li>
                    </ul>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout?produto=conta-premium')}
                className="btn-neon w-full text-sm py-2.5"
              >
                Comprar agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumProductSection;
