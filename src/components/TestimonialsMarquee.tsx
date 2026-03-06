import { testimonials } from '@/data/products';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, text }: { name: string; text: string }) => (
  <div className="flex-shrink-0 w-72 bg-card border border-border rounded-xl p-5 mx-2">
    <p className="text-foreground text-sm mb-3 italic">"{text}"</p>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-display text-sm font-bold text-foreground">{name}</p>
        <p className="text-xs text-neon-green">✅ Cliente verificado</p>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-neon-yellow text-neon-yellow" />
        ))}
      </div>
    </div>
  </div>
);

const TestimonialsMarquee = () => {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-8">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Mais de</p>
        <h2 className="font-display text-5xl md:text-6xl font-black text-primary glow-text-cyan">+50.000</h2>
        <p className="font-display text-lg font-bold text-foreground tracking-wider">AVALIAÇÕES!</p>
        <p className="text-muted-foreground mt-2">Veja o feedback de quem já comprou com a gente.</p>
      </div>

      <div className="flex animate-marquee">
        {doubled.map((t, i) => (
          <TestimonialCard key={i} name={t.name} text={t.text} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsMarquee;
