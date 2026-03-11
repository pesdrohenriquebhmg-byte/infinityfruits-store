import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout?carrinho=true');
  };

  const cartContent = (
    <>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
          <ShoppingBag className="w-12 h-12 opacity-40" />
          <p className="font-display text-sm">Seu carrinho está vazio</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 py-2 max-h-[60vh] overflow-y-auto">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-contain rounded-lg bg-muted/20 p-1"
              />
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs font-bold text-foreground truncate">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 text-foreground" />
                </button>
                <span className="text-sm font-bold text-foreground w-5 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-foreground" />
                </button>
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const cartFooter = items.length > 0 ? (
    <div className="flex flex-col gap-3 p-4 border-t border-border/50">
      <div className="flex justify-between items-center">
        <span className="font-display text-sm text-muted-foreground">Total</span>
        <span className="font-display text-xl font-black text-primary glow-text-cyan">
          R$ {totalPrice.toFixed(2).replace('.', ',')}
        </span>
      </div>
      <button
        onClick={handleCheckout}
        className="btn-neon w-full text-sm py-3"
      >
        Finalizar compra · R$ {totalPrice.toFixed(2).replace('.', ',')}
      </button>
      <button
        onClick={clearCart}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors text-center mt-1"
      >
        Limpar carrinho
      </button>
    </div>
  ) : null;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-display text-foreground">🛒 Carrinho</DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-xs">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </DrawerDescription>
          </DrawerHeader>
          {cartContent}
          {cartFooter}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-background border-border/50 w-[380px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="font-display text-foreground">🛒 Carrinho</SheetTitle>
          <SheetDescription className="text-muted-foreground text-xs">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {cartContent}
        </div>
        {cartFooter}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
