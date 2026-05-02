import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/553131574399?text=Olá"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ background: '#25D366' }}
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
    </a>
  );
};

export default WhatsAppFloat;
