import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useMockShop } from '@/shared/hooks';
import { ProductT } from '@/entities/product';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  children: React.ReactNode;
  className?: string;
}

export function CartDrawer({ children, className }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, getCart, updateCartItem, removeFromCart, clearCart } = useMockShop();
  const [cartData, setCartData] = useState<{ items: any[], total: number }>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем корзину при открытии
  useEffect(() => {
    if (isOpen) {
      const loadCart = async () => {
        setIsLoading(true);
        try {
          const cartData = await getCart();
          setCartData(cartData);
        } catch (error) {
          console.error('Failed to load cart:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadCart();
    }
  }, [isOpen, getCart]);

  const handleUpdateQty = async (productId: string, newQty: number) => {
    try {
      await updateCartItem(productId, newQty);
      const updatedCart = await getCart();
      setCartData(updatedCart);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      const updatedCart = await getCart();
      setCartData(updatedCart);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartData({ items: [], total: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const handleCheckout = () => {
    // TODO: Редирект на чекаут
    console.log('Redirecting to checkout...');
    setIsOpen(false);
  };

  const itemCount = cartData.items.length;
  const total = cartData.total;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Корзина
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-16 h-16 bg-muted/20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted/20 rounded w-3/4" />
                      <div className="h-3 bg-muted/20 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : itemCount === 0 ? (
              <div className="text-center py-8 text-muted">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Корзина пуста</p>
                <p className="text-sm">Добавьте товары для покупки</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 p-3 bg-surface rounded-lg">
                    <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛍️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-ink text-sm truncate">
                        {/* TODO: Получить название продукта из API */}
                        Товар {item.product_id.slice(0, 8)}
                      </h4>
                      <p className="text-muted text-sm">
                        {item.price_byn} BYN × {item.qty}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQty(item.product_id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="h-8 w-8 p-0 hover:bg-muted/20"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={item.qty}
                          onChange={(e) => {
                            const newQty = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                            handleUpdateQty(item.product_id, newQty);
                          }}
                          className="w-12 text-center border-0 focus:ring-0 text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQty(item.product_id, item.qty + 1)}
                          disabled={item.qty >= 20}
                          className="h-8 w-8 p-0 hover:bg-muted/20"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="h-8 w-8 p-0 text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {itemCount > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-ink">Итого:</span>
                <span className="text-lg font-semibold text-ink">{total} BYN</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Очистить
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-brand hover:bg-brand/90 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Оформить заказ
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
