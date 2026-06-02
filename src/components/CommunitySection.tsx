import { MessageCircle, Music2, Instagram, Youtube } from 'lucide-react';

/**
 * Edite aqui para refletir números reais da comunidade.
 */
const channels = [
  {
    name: 'Discord',
    handle: 'Comunidade oficial',
    members: '2.500+ membros',
    href: 'https://discord.gg/KXTTMRhgJ8',
    icon: MessageCircle,
    color: 'bg-[hsl(235_86%_65%/0.12)] text-[hsl(235_86%_75%)] border-[hsl(235_86%_65%/0.3)]',
  },
  {
    name: 'TikTok',
    handle: '@infinityfruits',
    members: 'Vídeos diários',
    href: 'https://www.tiktok.com/',
    icon: Music2,
    color: 'bg-[hsl(330_100%_60%/0.12)] text-[hsl(330_100%_75%)] border-[hsl(330_100%_60%/0.3)]',
  },
  {
    name: 'Instagram',
    handle: '@infinityfruits',
    members: 'Bastidores e novidades',
    href: 'https://www.instagram.com/',
    icon: Instagram,
    color: 'bg-[hsl(20_100%_60%/0.12)] text-[hsl(20_100%_75%)] border-[hsl(20_100%_60%/0.3)]',
  },
  {
    name: 'YouTube',
    handle: 'Infinity Fruits',
    members: 'Tutoriais e drops',
    href: 'https://www.youtube.com/',
    icon: Youtube,
    color: 'bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_72%)] border-[hsl(0_84%_60%/0.3)]',
  },
];

const CommunitySection = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <p className="text-xs font-display font-bold text-primary uppercase tracking-[0.2em] mb-2">
          Comunidade ativa
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-black text-foreground">
          Faça parte da Infinity Fruits
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Acompanhe drops, sorteios e novidades nos nossos canais oficiais.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {channels.map(({ name, handle, members, href, icon: Icon, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group p-5 rounded-2xl border ${color} hover:scale-[1.02] transition-transform`}
          >
            <Icon className="w-7 h-7 mb-3" />
            <p className="font-display text-base font-bold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{handle}</p>
            <p className="text-[11px] text-muted-foreground/80 mt-2">{members}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default CommunitySection;
