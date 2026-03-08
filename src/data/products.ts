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
  { id: 'dragon', name: 'Conta Dragon PERM', price: 22.90, image: '/images/dragon.png', badge: 'mythical', category: 'perm', inStock: true },
  { id: 'kitsune', name: 'Conta Kitsune PERM', price: 24.90, image: '/images/kitsune.png', badge: 'mythical', category: 'perm', inStock: true },
  { id: 'control', name: 'Conta Control PERM', price: 18.90, image: '/images/control.png', badge: 'popular', category: 'perm', inStock: true },
  { id: 'spirit', name: 'Conta Spirit PERM', price: 17.90, image: '/images/spirit.png', category: 'perm', inStock: true },
  { id: 'gas', name: 'Conta Gas PERM', price: 14.90, image: '/images/gas.png', category: 'perm', inStock: true },
  { id: 'trex', name: 'Conta T-Rex PERM', price: 15.90, image: '/images/trex.png', category: 'perm', inStock: true },
  { id: 'mammoth', name: 'Conta Mammoth PERM', price: 13.90, image: '/images/mammoth.png', category: 'perm', inStock: true },
  { id: 'venom', name: 'Conta Venom PERM', price: 12.90, image: '/images/venom.png', badge: 'popular', category: 'perm', inStock: true },
  { id: 'dough', name: 'Conta Dough PERM', price: 11.90, image: '/images/dough.png', category: 'perm', inStock: true },
  { id: 'shadow', name: 'Conta Shadow PERM', price: 10.90, image: '/images/shadow.png', category: 'perm', inStock: true },
  { id: 'portal', name: 'Conta Portal PERM', price: 9.90, image: '/images/portal.png', category: 'perm', inStock: true },
  { id: 'buddha', name: 'Conta Buddha PERM', price: 8.90, image: '/images/buddha.png', badge: 'popular', category: 'perm', inStock: true },
  { id: 'light', name: 'Conta Light PERM', price: 7.90, image: '/images/light.png', category: 'perm', inStock: true },
  { id: 'yeti', name: 'Conta Yeti PERM', price: 6.90, image: '/images/yeti.png', category: 'perm', inStock: true },
];

export const godhumanProducts: Product[] = [
  { id: 'godhuman-1', name: 'Godhuman + 1 Mítica', price: 29.90, image: '/images/godhuman-1mitica.png', badge: 'rare', category: 'godhuman', inStock: true },
  { id: 'godhuman-2', name: 'Godhuman + 2 Míticas', price: 34.90, image: '/images/godhuman-2miticas.png', badge: 'rare', category: 'godhuman', inStock: true },
  { id: 'godhuman-3', name: 'Godhuman + 3 Míticas', price: 39.90, image: '/images/godhuman-3miticas.png', badge: 'mythical', category: 'godhuman', inStock: true },
];

export const miticaProducts: Product[] = [
  { id: 'mitica-1', name: 'Conta 1 Mítica Aleatória', price: 14.90, image: '/images/mitica-aleatoria.png', badge: 'promo', category: 'mitica', inStock: true },
  { id: 'mitica-2', name: 'Conta 2 Míticas Aleatórias', price: 24.90, image: '/images/mitica-aleatoria.png', badge: 'popular', category: 'mitica', inStock: true },
  { id: 'mitica-3', name: 'Conta 3 Míticas Aleatórias', price: 32.90, image: '/images/mitica-aleatoria.png', badge: 'rare', category: 'mitica', inStock: true },
];

export const v4Products: Product[] = [
  { id: 'v4-race-1', name: 'Conta V4 Human', price: 39.90, image: '/images/v4.png', badge: 'rare', category: 'v4', inStock: true },
  { id: 'v4-race-2', name: 'Conta V4 Shark', price: 44.90, image: '/images/v4.png', badge: 'mythical', category: 'v4', inStock: true },
  { id: 'v4-race-3', name: 'Conta V4 Angel', price: 44.90, image: '/images/v4.png', badge: 'mythical', category: 'v4', inStock: true },
  { id: 'v4-race-4', name: 'Conta V4 + Godhuman', price: 54.90, image: '/images/v4.png', badge: 'mythical', category: 'v4', inStock: true },
];

export const fisicaProducts: Product[] = [
  { id: 'fisica-dragon', name: 'Dragon Física', price: 5.90, image: '/images/dragon.png', badge: 'popular', category: 'fisica', inStock: true },
  { id: 'fisica-kitsune', name: 'Kitsune Física', price: 6.90, image: '/images/kitsune.png', badge: 'popular', category: 'fisica', inStock: true },
  { id: 'fisica-control', name: 'Control Física', price: 4.90, image: '/images/control.png', category: 'fisica', inStock: true },
  { id: 'fisica-spirit', name: 'Spirit Física', price: 4.90, image: '/images/spirit.png', category: 'fisica', inStock: true },
  { id: 'fisica-venom', name: 'Venom Física', price: 3.90, image: '/images/venom.png', category: 'fisica', inStock: true },
  { id: 'fisica-buddha', name: 'Buddha Física', price: 2.90, image: '/images/buddha.png', badge: 'promo', category: 'fisica', inStock: true },
];

export const allProducts: Product[] = [
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
