export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: 'mythical' | 'popular' | 'rare' | 'promo';
  category: 'perm' | 'godhuman' | 'mitica' | 'v4' | 'fisica' | 'gamepass';
  inStock: boolean;
}

export const permProducts: Product[] = [
  { id: 'dragon', name: 'Conta Dragon PERM', price: 22.90, image: '/images/dragon-hq.png', badge: 'mythical', category: 'perm', inStock: true },
  { id: 'kitsune', name: 'Conta Kitsune PERM', price: 24.90, image: '/images/kitsune-hq.png', badge: 'mythical', category: 'perm', inStock: true },
  { id: 'control', name: 'Conta Control PERM', price: 18.90, image: '/images/control-hq.png', badge: 'popular', category: 'perm', inStock: true },
  { id: 'dough', name: 'Conta Dough PERM', price: 12.90, image: '/images/dough-hq.png', category: 'perm', inStock: true },
  { id: 'trex', name: 'Conta T-Rex PERM', price: 15.90, image: '/images/trex-hq.png', category: 'perm', inStock: true },
  { id: 'portal', name: 'Conta Portal PERM', price: 9.90, image: '/images/portal-hq.png', category: 'perm', inStock: true },
  { id: 'buddha', name: 'Conta Buddha PERM', price: 9.90, image: '/images/buddha-hq.png', badge: 'popular', category: 'perm', inStock: true },
  { id: 'tiger', name: 'Conta Tiger PERM', price: 19.90, image: '/images/tiger-hq.png', badge: 'rare', category: 'perm', inStock: true },
  { id: 'yeti', name: 'Conta Yeti PERM', price: 21.90, image: '/images/yeti-hq.png', category: 'perm', inStock: true },
  { id: 'mammoth', name: 'Conta Mammoth PERM', price: 14.90, image: '/images/mammoth-hq.png', category: 'perm', inStock: true },
  { id: 'gas', name: 'Conta Gas PERM', price: 17.90, image: '/images/gas-hq2.png', category: 'perm', inStock: true },
  { id: 'spirit', name: 'Conta Spirit PERM', price: 18.90, image: '/images/spirit-hq2.png', category: 'perm', inStock: true },
  { id: 'shadow', name: 'Conta Shadow PERM', price: 11.90, image: '/images/shadow-hq2.png', category: 'perm', inStock: true },
  { id: 'venom', name: 'Conta Venom PERM', price: 13.90, image: '/images/venom-hq2.png', badge: 'popular', category: 'perm', inStock: true },
  { id: 'rumble', name: 'Conta Rumble PERM', price: 13.90, image: '/images/rumble-hq.png', category: 'perm', inStock: true },
  { id: 'blizzard', name: 'Conta Blizzard PERM', price: 9.90, image: '/images/blizzard-hq.png', category: 'perm', inStock: true },
  { id: 'light', name: 'Conta Light PERM', price: 9.90, image: '/images/light-hq2.png', category: 'perm', inStock: true },
];

export const godhumanProducts: Product[] = [
  { id: 'godhuman-1', name: 'Godhuman + 1 Mítica', price: 9.00, image: '/images/godhuman-1mitica-hq.png', badge: 'rare', category: 'godhuman', inStock: true },
  { id: 'godhuman-2', name: 'Godhuman + 2 Míticas', price: 9.49, image: '/images/godhuman-2miticas-hq.png', badge: 'rare', category: 'godhuman', inStock: true },
  { id: 'godhuman-3', name: 'Godhuman + 3 Míticas', price: 9.99, image: '/images/godhuman-3miticas-hq.png', badge: 'mythical', category: 'godhuman', inStock: true },
];

export const miticaProducts: Product[] = [
  { id: 'mitica-1', name: 'Conta 1 Mítica Aleatória', price: 9.00, image: '/images/mitica-1.jpg', badge: 'promo', category: 'mitica', inStock: true },
  { id: 'mitica-2', name: 'Conta 2 Míticas Aleatórias', price: 9.49, image: '/images/mitica-2.jpg', badge: 'popular', category: 'mitica', inStock: true },
  { id: 'mitica-3', name: 'Conta 3 Míticas Aleatórias', price: 9.99, image: '/images/mitica-3.jpg', badge: 'rare', category: 'mitica', inStock: true },
];

export const v4Products: Product[] = [
  { id: 'v4-race-1', name: 'Conta V4 Human', price: 24.90, image: '/images/v4-ghoul.jpg', badge: 'rare', category: 'v4', inStock: true },
  { id: 'v4-race-2', name: 'Conta V4 Shark', price: 15.80, image: '/images/v4-shark.jpg', badge: 'mythical', category: 'v4', inStock: true },
  { id: 'v4-race-3', name: 'Conta V4 Angel', price: 13.90, image: '/images/v4-angel.jpg', badge: 'mythical', category: 'v4', inStock: true },
  { id: 'v4-race-4', name: 'Conta V4 + Godhuman', price: 14.40, image: '/images/godhuman-3miticas-hq.png', badge: 'mythical', category: 'v4', inStock: true },
];

export const mutationProducts: Product[] = [
  { id: 'empyrean', name: 'Empyrean (Kitsune)', price: 32.90, image: '/images/empyrean.webp', badge: 'mythical', category: 'perm', inStock: true },
  { id: 'fiend', name: 'Fiend (Yeti)', price: 26.90, image: '/images/fiend.webp', badge: 'rare', category: 'perm', inStock: true },
  { id: 'werewolf', name: 'Werewolf (Tiger)', price: 24.70, image: '/images/werewolf.webp', badge: 'rare', category: 'perm', inStock: true },
];

export const fisicaProducts: Product[] = [
  { id: 'fisica-dragon', name: 'Dragon Física', price: 11.80, image: '/images/fruta-dragon.webp', badge: 'popular', category: 'fisica', inStock: true },
  { id: 'fisica-kitsune', name: 'Kitsune Física', price: 11.90, image: '/images/fruta-kitsune.webp', badge: 'popular', category: 'fisica', inStock: true },
  { id: 'fisica-control', name: 'Control Física', price: 11.70, image: '/images/fruta-control.webp', category: 'fisica', inStock: true },
  { id: 'fisica-dough', name: 'Dough Física', price: 11.10, image: '/images/fruta-dough.webp', category: 'fisica', inStock: true },
  { id: 'fisica-trex', name: 'T-Rex Física', price: 11.40, image: '/images/fruta-trex.png', category: 'fisica', inStock: true },
  { id: 'fisica-portal', name: 'Portal Física', price: 9.90, image: '/images/fruta-portal.webp', category: 'fisica', inStock: true },
  { id: 'fisica-buddha', name: 'Buddha Física', price: 9.90, image: '/images/fruta-buddha.webp', badge: 'promo', category: 'fisica', inStock: true },
  { id: 'fisica-tiger', name: 'Tiger Física', price: 11.60, image: '/images/fruta-tiger.webp', badge: 'rare', category: 'fisica', inStock: true },
  { id: 'fisica-yeti', name: 'Yeti Física', price: 11.00, image: '/images/fruta-yeti.webp', category: 'fisica', inStock: true },
  { id: 'fisica-mammoth', name: 'Mammoth Física', price: 11.20, image: '/images/fruta-mammoth.webp', category: 'fisica', inStock: true },
  { id: 'fisica-gas', name: 'Gas Física', price: 9.60, image: '/images/fruta-gas.webp', category: 'fisica', inStock: true },
  { id: 'fisica-spirit', name: 'Spirit Física', price: 9.90, image: '/images/fruta-spirit.webp', category: 'fisica', inStock: true },
  { id: 'fisica-venom', name: 'Venom Física', price: 10.70, image: '/images/fruta-venom.webp', badge: 'popular', category: 'fisica', inStock: true },
  { id: 'fisica-rumble', name: 'Rumble Física', price: 10.90, image: '/images/fruta-rumble.webp', category: 'fisica', inStock: true },
  { id: 'fisica-blizzard', name: 'Blizzard Física', price: 9.50, image: '/images/fruta-blizzard.webp', category: 'fisica', inStock: true },
  { id: 'fisica-light', name: 'Light Física', price: 9.80, image: '/images/fruta-light.webp', category: 'fisica', inStock: true },
];

export const premiumProducts: Product[] = [
  { id: 'conta-premium', name: 'Conta Premium — God Account', price: 169.90, image: '/images/conta-premium.webp', badge: 'mythical', category: 'perm', inStock: true },
];

export interface OrderBump {
  id: string;
  name: string;
  price: number;
  image: string;
  emoji: string;
}

export const orderBumpProducts: OrderBump[] = [
  { id: 'gp-darkblade', name: 'Dark Blade (Gamepass)', price: 8.90, image: '/images/gamepass-darkblade.jpg', emoji: '🗡️' },
  { id: 'gp-notificador', name: 'Notificador de Frutas (Gamepass)', price: 12.90, image: '/images/gamepass-notificador.jpg', emoji: '📞' },
  { id: 'gp-espaco', name: '+1 Espaço Fruta (Gamepass)', price: 8.40, image: '/images/gamepass-espaco.jpg', emoji: '📦' },
  { id: 'gp-maestria', name: '2x Maestria (Gamepass)', price: 8.00, image: '/images/gamepass-maestria.jpg', emoji: '⚔️' },
  { id: 'gp-money', name: '2x Money (Gamepass)', price: 8.00, image: '/images/gamepass-money.jpg', emoji: '💸' },
  { id: 'gp-drop', name: '2x Drop (Gamepass)', price: 8.00, image: '/images/gamepass-drop.jpg', emoji: '💪' },
];

export const allProducts: Product[] = [
  ...premiumProducts,
  ...permProducts,
  ...godhumanProducts,
  ...miticaProducts,
  ...v4Products,
  ...fisicaProducts,
];

export const testimonials = [
  { name: 'João M.', text: 'Entrega super rápida, tudo certo!' },
  { name: 'Maria C.', text: 'Chegou rapidinho, gostei demais.' },
  { name: 'Pedro A.', text: 'Tudo perfeito, recomendo.' },
  { name: 'Ana R.', text: 'Atendimento ótimo, chegou rápido.' },
  { name: 'Lucas V.', text: 'Loja confiável e rápida.' },
  { name: 'Beatriz F.', text: 'Adorei! Voltarei a comprar.' },
  { name: 'Rafael M.', text: 'Chegou no mesmo dia!' },
  { name: 'Larissa D.', text: 'Produto excelente e veio rápido.' },
];
