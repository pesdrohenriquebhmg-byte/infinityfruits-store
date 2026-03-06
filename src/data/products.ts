export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: 'mythical' | 'popular' | 'rare' | 'promo';
  category: 'perm' | 'godhuman' | 'mitica' | 'gamepass';
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
