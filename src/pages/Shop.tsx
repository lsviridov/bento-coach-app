import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { CompactProductFilters, useFilters } from '@/widgets/product-filters';
import { ProductCard } from '@/entities/product';
import { useMockShop } from '@/shared/hooks';
import { CartDrawer } from '@/widgets/cart-drawer';
import { AppHeader } from '@/widgets/header';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageLayout } from '@/shared';
import { ActionFab, CoachBottomSheet } from '@/widgets/coach-entry';

export default function Shop() {
  const { queryParams, hasActiveFilters } = useFilters();
  const [products, setProducts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  
  const { ref: loadMoreRef, inView } = useInView();
  const { getProducts, addToCart, isLoading, error } = useMockShop();

  // Загрузка продуктов
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await getProducts(queryParams);
        setProducts(result.items);
        setNextCursor(result.nextCursor);
        setHasMore(!!result.nextCursor);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    // Загружаем продукты при любых параметрах, включая пустые
    loadProducts();
  }, [queryParams, getProducts]);

  // Загрузка дополнительных продуктов
  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const result = await getProducts({ ...queryParams, cursor: nextCursor });
      setProducts(prev => [...prev, ...result.items]);
      setNextCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, queryParams, isLoadingMore, getProducts]);

  // Обновление продуктов при изменении фильтров
  useEffect(() => {
    if (products.length > 0) {
      setHasMore(!!nextCursor);
    }
  }, [products.length, nextCursor]);

  // Автозагрузка при скролле
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore]);

  // Добавление в корзину
  const handleAddToCart = useCallback(async (product: any) => {
    try {
      await addToCart(product.id, 1, product.price_byn);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [addToCart]);

  // Состояния загрузки
  if (isLoading && products.length === 0) {
    return (
      <PageLayout>
        <AppHeader title="Магазин" variant="shop" />
        <div className="min-h-screen bg-bg p-4">
          <CompactProductFilters />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <PageLayout>
        <AppHeader title="Магазин" variant="shop" />
        <div className="min-h-screen bg-bg p-4">
          <CompactProductFilters />
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              Ошибка загрузки
            </h2>
            <p className="text-muted mb-4">
              Не удалось загрузить товары. Попробуйте еще раз.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Повторить
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Состояние пустого результата
  if (products.length === 0 && !isLoading) {
    return (
      <PageLayout>
        <AppHeader title="Магазин" variant="shop" />
        <div className="min-h-screen bg-bg p-4">
          <CompactProductFilters />
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              Товары не найдены
            </h2>
            <p className="text-muted mb-4">
              {hasActiveFilters 
                ? 'Попробуйте изменить фильтры или поисковый запрос'
                : 'В данный момент товары недоступны'
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={() => window.location.reload()} variant="outline">
                Сбросить фильтры
              </Button>
            )}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <AppHeader 
        title="Магазин" 
        variant="shop"
        rightAction={{
          icon: ShoppingCart,
          onClick: () => {}, // CartDrawer будет обрабатывать клик
          label: "Корзина"
        }}
      />
      
      <div className="min-h-screen bg-bg">
        {/* Фильтры */}
        <CompactProductFilters />

        {/* Информация о товарах */}
        <div className="p-4 border-b border-[color-mix(in_oklab,var(--muted)_20%,transparent)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted">
                {products.length} товаров
                {hasActiveFilters && ' по выбранным фильтрам'}
              </p>
            </div>
            
            <CartDrawer>
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Корзина
              </Button>
            </CartDrawer>
          </div>
        </div>

        {/* Сетка продуктов */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Индикатор загрузки */}
          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-muted">
                <div className="w-4 h-4 border-2 border-muted/30 border-t-muted rounded-full animate-spin" />
                Загружаем еще...
              </div>
            </div>
          )}

          {/* Кнопка "Загрузить еще" для мобильных */}
          {hasMore && !isLoadingMore && (
            <div className="flex justify-center py-8">
              <Button
                variant="outline"
                onClick={loadMore}
                className="w-full max-w-xs"
              >
                Показать еще
              </Button>
            </div>
          )}

          {/* Скрытый элемент для Intersection Observer */}
          <div ref={loadMoreRef} className="h-4" />
        </div>
      </div>
      
      <ActionFab onAddMeal={() => console.log('Navigate to add meal')} />
      <CoachBottomSheet open={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
    </PageLayout>
  );
}
