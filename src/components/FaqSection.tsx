import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Como recebo meu produto?',
    a: 'Após o pagamento ser confirmado, os dados da conta ou a ativação do item são enviados automaticamente para o seu e-mail e WhatsApp. Tudo acontece em poucos minutos, sem precisar abrir chamado.',
  },
  {
    q: 'Quanto tempo demora a entrega?',
    a: 'A maioria das entregas é feita em até 2 minutos após a confirmação do Pix. Em casos de alta demanda, pode levar alguns minutos a mais — mas você sempre tem garantia de entrega.',
  },
  {
    q: 'É seguro comprar na Infinity Fruits?',
    a: 'Sim. Trabalhamos com gateway de pagamento certificado, todos os pedidos ficam registrados e oferecemos suporte humano 24h. Já realizamos mais de 12 mil entregas com nota média 4.9/5.',
  },
  {
    q: 'Tem garantia?',
    a: 'Sim. Toda compra possui garantia de entrega — se algo der errado, devolvemos seu dinheiro ou enviamos um produto equivalente.',
  },
  {
    q: 'Como falar com o suporte?',
    a: 'Pelo botão de WhatsApp no rodapé ou no canto da tela. Nosso time responde em poucos minutos, todos os dias da semana.',
  },
  {
    q: 'Posso pedir reembolso?',
    a: 'Sim. Caso o produto não seja entregue ou esteja incorreto, devolvemos 100% do valor pago via Pix. Veja a Política de Reembolso para mais detalhes.',
  },
  {
    q: 'O pagamento é seguro?',
    a: 'Totalmente. Usamos um gateway brasileiro que processa o Pix dentro do ambiente do Banco Central. Você não compartilha senhas nem dados bancários conosco.',
  },
];

const FaqSection = () => (
  <section id="faq" className="py-16 md:py-24">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-display font-bold uppercase tracking-wider text-primary">
            Perguntas frequentes
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-black text-foreground">
          Tire suas dúvidas
        </h2>
        <p className="text-muted-foreground mt-2">
          Se ainda restar alguma pergunta, fale com a gente no WhatsApp.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-border/60 rounded-2xl bg-card/70 backdrop-blur-sm px-5 data-[state=open]:border-primary/40 transition-colors"
          >
            <AccordionTrigger className="text-left font-display text-sm md:text-base font-bold text-foreground hover:no-underline py-4">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;
