

import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecos } from '../model/useRecos';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';
import { useAddToCart } from '@/features/add-to-cart';
import type { RecoProduct } from '../model/schemas';

export function ShopRecos() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useRecos();
  const { isOffline } = useOfflineFlag();
  const addToCartMutation = useAddToCart();

  const handleAddToCart = async (product: RecoProduct) => {
    await addToCartMutation.mutateAsync({ product, qty: 1 });
  };

  const handleProductClick = (slug: string) => {
    navigate(`/shop/${slug}`);
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Рекомендации для вас</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64">
              <div className="bg-surface rounded-lg border border-muted/20 overflow-hidden">
                <div className="w-full h-32 bg-muted/30 rounded-t-lg animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="w-full h-4 bg-muted/30 rounded animate-pulse" />
                  <div className="w-3/4 h-3 bg-muted/30 rounded animate-pulse" />
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-4 bg-muted/30 rounded animate-pulse" />
                    <div className="flex gap-1">
                      <div className="w-8 h-7 bg-muted/30 rounded animate-pulse" />
                      <div className="w-8 h-7 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Рекомендации для вас</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Не удалось загрузить рекомендации</p>
        </div>
      </section>
    );
  }

  if (isOffline) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Рекомендации для вас</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Рекомендации недоступны офлайн</p>
        </div>
      </section>
    );
  }

  if (data.items.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Рекомендации для вас</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Пока нет персональных рекомендаций</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Рекомендации для вас</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
        {data.items.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64"
          >
            <div className="bg-surface rounded-lg border border-muted/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-muted/20 flex items-center justify-center">
                  <span className="text-muted text-sm">Фото</span>
                </div>
              )}
              
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-ink text-sm line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-xs text-muted line-clamp-2">
                  {product.reason}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">
                    {product.price_byn} ₽
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProductClick(product.slug)}
                      className="h-7 px-2 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={addToCartMutation.isPending}
                      className="h-7 px-2 text-xs bg-brand hover:bg-brand/90 text-white"
                    >
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
