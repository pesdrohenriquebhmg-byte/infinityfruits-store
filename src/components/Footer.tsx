import { Link } from 'react-router-dom';
import logo from '@/assets/logo-infinity.webp';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm mt-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Marca */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Infinity Fruits" className="w-9 h-9 object-contain" />
              <div>
                <p className="font-display text-sm font-bold leading-tight">
                  <span className="text-logo-sky">INFINITY</span>{' '}
                  <span className="text-logo-yellow">FRUITS</span>
                </p>
                <p className="text-[10px] text-muted-foreground">Loja oficial · Desde 2023</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A maneira mais rápida e segura de comprar contas, frutas e gamepasses de Blox Fruits e Sailor Piece.
            </p>
          </div>

          {/* Loja */}
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Loja
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Blox Fruits</Link></li>
              <li><Link to="/sailor-piece" className="hover:text-foreground transition-colors">Sailor Piece</Link></li>
              <li><Link to="/ofertas-especiais" className="hover:text-foreground transition-colors">Ofertas Especiais</Link></li>
              <li><a href="/#avaliacoes" className="hover:text-foreground transition-colors">Avaliações</a></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Empresa
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="hover:text-foreground transition-colors">Sobre Nós</Link></li>
              <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="https://wa.me/553131574399" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Contato</a></li>
              <li><Link to="/termos" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-foreground transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/reembolso" className="hover:text-foreground transition-colors">Política de Reembolso</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p>© {year} Infinity Fruits. Todos os direitos reservados.</p>
          <p>
            Não somos afiliados à Roblox Corporation, Gamer Robot Inc. ou aos criadores de Blox Fruits e Sailor Piece.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
