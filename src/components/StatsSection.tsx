import { Package, Users, Clock, Star } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { siteStats } from '@/config/siteStats';

const formatInt = (n: number) => Math.floor(n).toLocaleString('pt-BR');

const Stat = ({
  icon: Icon,
  end,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
}: {
  icon: typeof Package;
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}) => {
  const { ref, value } = useCountUp(end);
  const display = decimals > 0 ? value.toFixed(decimals).replace('.', ',') : formatInt(value);

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 hover:border-primary/40 transition-colors"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="font-display text-3xl md:text-4xl font-black text-foreground tabular-nums">
        {prefix}
        {display}
        {suffix}
      </div>
      <p className="text-xs md:text-sm text-muted-foreground mt-1.5 font-medium">{label}</p>
    </div>
  );
};

const StatsSection = () => (
  <section className="py-12 md:py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <Stat icon={Package} end={siteStats.ordersDelivered} prefix="+" label="Pedidos entregues" />
        <Stat icon={Users} end={siteStats.customersServed} prefix="+" label="Clientes atendidos" />
        <Stat icon={Clock} end={siteStats.averageDeliveryMinutes} suffix=" min" label="Tempo médio de entrega" />
        <Stat icon={Star} end={siteStats.averageRating} decimals={1} suffix="/5" label="Avaliação média" />
      </div>
    </div>
  </section>
);

export default StatsSection;
