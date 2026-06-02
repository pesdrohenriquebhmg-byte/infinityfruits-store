import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, Heart, Users, Target, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteStats } from '@/config/siteStats';

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar para a loja
      </Link>

      <header className="text-center mb-12">
        <p className="text-xs font-display font-bold text-primary uppercase tracking-[0.2em] mb-2">
          Sobre nós
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-black text-foreground mb-4">
          Quem é a <span className="text-logo-sky">Infinity</span> <span className="text-logo-yellow">Fruits</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Uma loja especializada em itens digitais para Blox Fruits e Sailor Piece, focada em entrega rápida, suporte humano e total transparência.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
        {[
          { v: `+${siteStats.ordersDelivered.toLocaleString('pt-BR')}`, l: 'Pedidos entregues' },
          { v: `+${siteStats.customersServed.toLocaleString('pt-BR')}`, l: 'Clientes atendidos' },
          { v: `${siteStats.averageDeliveryMinutes} min`, l: 'Entrega média' },
          { v: `${siteStats.averageRating.toFixed(1).replace('.', ',')}/5`, l: 'Avaliação média' },
        ].map(s => (
          <div key={s.l} className="text-center p-4 rounded-2xl bg-card/70 border border-border/60">
            <p className="font-display text-2xl md:text-3xl font-black text-primary">{s.v}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* História */}
      <section className="mb-12 p-6 md:p-8 rounded-2xl bg-card/70 border border-border/60">
        <h2 className="font-display text-2xl font-black text-foreground mb-4">Nossa história</h2>
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            A Infinity Fruits nasceu em 2023 da paixão de um pequeno grupo de jogadores por Blox Fruits e por jogos de Roblox em geral. A gente sabia o quanto era difícil encontrar uma loja brasileira séria, com entrega rápida e que não desaparecesse depois da venda.
          </p>
          <p>
            Começamos atendendo amigos no Discord, evoluímos para uma loja com automação completa e hoje somos referência no Brasil quando o assunto é compra segura de contas, frutas e gamepasses. Cada pedido continua sendo tratado com o mesmo cuidado do primeiro dia.
          </p>
        </div>
      </section>

      {/* Missão / valores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Target, title: 'Missão', desc: 'Tornar a compra de itens digitais simples, rápida e 100% confiável para a comunidade brasileira.' },
          { icon: Heart, title: 'Cuidado', desc: 'Cada cliente é tratado como amigo. Suporte humano, sem robôs e sem enrolação.' },
          { icon: Sparkles, title: 'Transparência', desc: 'Preços claros, processos visíveis e garantia real em todas as entregas.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-5 rounded-2xl bg-card/70 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Compromissos */}
      <section className="p-6 md:p-8 rounded-2xl bg-card/70 border border-border/60">
        <h2 className="font-display text-2xl font-black text-foreground mb-6">Nossos compromissos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Zap, title: 'Entrega rápida', desc: 'Tempo médio de 2 minutos após confirmação do Pix.' },
            { icon: ShieldCheck, title: 'Compra segura', desc: 'Gateway certificado e dados protegidos.' },
            { icon: Users, title: 'Suporte humano', desc: 'WhatsApp respondido por pessoas reais, 24h por dia.' },
            { icon: Heart, title: 'Garantia total', desc: 'Reembolso integral caso algo dê errado com seu pedido.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default About;
