import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { ProductT } from '@/entities/product';
import { useMockShop } from '@/shared/hooks';
import { cn } from '@/lib/utils';

interface AddToCartProps {
  product: ProductT;
  className?: string;
  onSuccess?: () => void;
}

export function AddToCart({ product, className, onSuccess }: AddToCartProps) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useMockShop();
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      setIsError(false);
      await addToCart(product.id, qty, product.price_byn);
      setIsSuccess(true);
      onSuccess?.();
      
      // Сбрасываем успех через 3 секунды
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsError(true);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQty = () => setQty(prev => Math.min(20, prev + 1));
  const decrementQty = () => setQty(prev => Math.max(1, prev - 1));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink">Количество:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQty}
            disabled={qty <= 1}
            className="h-10 w-10 p-0 hover:bg-muted/20"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            min="1"
            max="20"
            value={qty}
            onChange={(e) => setQty(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 text-center border-0 focus:ring-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQty}
            disabled={qty >= 20}
            className="h-10 w-10 p-0 hover:bg-muted/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full bg-brand hover:bg-brand/90 text-white h-12 text-base"
      >
        {isAdding ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Добавляем...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            В корзину • {product.price_byn * qty} BYN
          </div>
        )}
      </Button>

      {/* Success Message */}
      {isSuccess && (
        <div className="text-success text-sm text-center">
          ✓ Товар добавлен в корзину
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="text-danger text-sm text-center">
          Ошибка при добавлении в корзину
        </div>
      )}
    </div>
  );
}
