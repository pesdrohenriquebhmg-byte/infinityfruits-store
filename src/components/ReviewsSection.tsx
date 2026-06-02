import { Star, BadgeCheck } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { siteStats } from '@/config/siteStats';

type Review = {
  name: string;
  initials: string;
  rating: number;
  date: string;
  product: string;
  text: string;
};

const reviews: Review[] = [
  { name: 'João M.', initials: 'JM', rating: 5, date: 'há 2 dias', product: 'Conta Kitsune PERM', text: 'Recebi em menos de 5 minutos. Tudo certinho, conta limpa.' },
  { name: 'Maria C.', initials: 'MC', rating: 5, date: 'há 4 dias', product: 'Conta Premium', text: 'Comprei a Premium e veio tudo que prometeram. Vou voltar a comprar.' },
  { name: 'Pedro A.', initials: 'PA', rating: 5, date: 'há 1 semana', product: 'Gamepass Dark Blade', text: 'Suporte muito atencioso. Ativaram na minha conta em 2 min.' },
  { name: 'Ana R.', initials: 'AR', rating: 5, date: 'há 5 dias', product: 'Conta Dragon PERM', text: 'Tinha medo de cair em golpe, mas é loja séria mesmo. Muito bom.' },
  { name: 'Lucas V.', initials: 'LV', rating: 5, date: 'há 3 dias', product: 'Empyrean (Kitsune)', text: 'Mutação rara entregue na hora. Melhor preço que achei.' },
  { name: 'Beatriz F.', initials: 'BF', rating: 5, date: 'ontem', product: '2x Money Gamepass', text: 'Atendimento top, processo simples, recomendo demais.' },
];

const palette = ['bg-primary/15 text-primary', 'bg-secondary/15 text-secondary', 'bg-logo-yellow/15 text-logo-yellow', 'bg-neon-green/15 text-neon-green'];

const ReviewCard = ({ r, i }: { r: Review; i: number }) => (
  <article className="p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover:border-primary/40 transition-colors h-full flex flex-col">
    <div className="flex items-start gap-3 mb-3">
      <div className={`shrink-0 w-10 h-10 rounded-full ${palette[i % palette.length]} flex items-center justify-center font-display font-bold text-sm`}>
        {r.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="font-display text-sm font-bold text-foreground truncate">{r.name}</p>
          <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        </div>
        <p className="text-[11px] text-muted-foreground">{r.date} · {r.product}</p>
      </div>
    </div>
    <div className="flex gap-0.5 mb-2">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? 'fill-logo-yellow text-logo-yellow' : 'text-muted'}`} />
      ))}
    </div>
    <p className="text-sm text-foreground/90 leading-relaxed">{r.text}</p>
  </article>
);

const ReviewsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="avaliacoes" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-display font-bold text-primary uppercase tracking-[0.2em] mb-2">
            Avaliações verificadas
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-black text-foreground">
            O que dizem nossos clientes
          </h2>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-card border border-border/60">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-logo-yellow text-logo-yellow" />
              ))}
            </div>
            <span className="text-xs text-foreground font-medium">
              {siteStats.averageRating.toFixed(1).replace('.', ',')} de 5 · baseado em {siteStats.totalReviews.toLocaleString('pt-BR')} avaliações
            </span>
          </div>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {reviews.map((r, i) => (
            <ReviewCard key={i} r={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
