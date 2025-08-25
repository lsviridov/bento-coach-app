import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductT, ProductCard, ProductPrice } from '@/entities/product';
import { AddToCart } from '@/features/add-to-cart';
import { CartDrawer } from '@/widgets/cart-drawer';
import { useMockShop } from '@/shared/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLayout } from '@/shared';
import { ActionFab, CoachBottomSheet } from '@/widgets/coach-entry';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductT | null>(null);
  const [recommendations, setRecommendations] = useState<ProductT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const { getProduct, getProducts } = useMockShop();

  // Загрузка продукта
  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const productData = await getProduct(slug);
        setProduct(productData);
        
        // Загружаем рекомендации
        const goals = productData.tags.slice(0, 2);
        const recsResult = await getProducts({
          category: [productData.category],
          goals,
          limit: 3
        });
        setRecommendations(recsResult.items.filter(rec => rec.id !== productData.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug, getProduct, getProducts]);

  // Обработка ошибки
  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-bg p-4">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              Товар не найден
            </h2>
            <p className="text-muted mb-4">
              Запрашиваемый товар не существует или был удален.
            </p>
            <Button onClick={() => navigate('/shop')} variant="outline">
              Вернуться в магазин
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Состояние загрузки
  if (isLoading || !product) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-bg p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>

            {/* Image and info skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Генерируем описание "Кому подойдет" на основе тегов
  const generateTargetAudience = (tags: string[]) => {
    const tagDescriptions: Record<string, string> = {
      'белок': 'спортсменам и активным людям',
      'восстановление': 'людям в период восстановления',
      'мышечная масса': 'тем, кто хочет нарастить мышцы',
      'лёгкость': 'людям, предпочитающим легкоусвояемые продукты',
      'омега-3': 'для поддержания сердечно-сосудистой системы',
      'силы': 'людям с высокими физическими нагрузками',
      'выносливость': 'спортсменам на выносливость',
      'премиум': 'для тех, кто ценит качество',
      'эксклюзив': 'для особых случаев и подарков',
      'антипаразитарный': 'для очищения организма',
      'детокс': 'для детоксикации',
      'иммунитет': 'для укрепления иммунной системы',
      'кости': 'для здоровья костной ткани',
      'кальций': 'для укрепления костей и зубов',
      'минералы': 'для восполнения минералов',
      'ДНК/РНК': 'для клеточного здоровья',
      'клеточное здоровье': 'для поддержания молодости клеток',
      'антиоксидант': 'для защиты от свободных радикалов',
      'долголетие': 'для активного долголетия',
      'сердечно-сосудистая система': 'для здоровья сердца',
      'антибактериальный': 'для защиты от бактерий',
      'защита': 'для укрепления защитных сил организма'
    };

    const relevantTags = tags.filter(tag => tagDescriptions[tag]);
    if (relevantTags.length === 0) return 'для всех, кто заботится о своем здоровье';

    const descriptions = relevantTags.map(tag => tagDescriptions[tag]);
    if (descriptions.length === 1) return descriptions[0];
    if (descriptions.length === 2) return `${descriptions[0]} и ${descriptions[1]}`;
    
    return `${descriptions.slice(0, -1).join(', ')} и ${descriptions[descriptions.length - 1]}`;
  };

  const targetAudience = generateTargetAudience(product.tags);

  return (
    <PageLayout>
      <div className="min-h-screen bg-bg pt-16">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-[color-mix(in_oklab,var(--muted)_20%,transparent)] p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>

            <CartDrawer>
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Корзина
              </Button>
            </CartDrawer>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Галерея */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-surface">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <span className="text-6xl">🛍️</span>
                  </div>
                )}
              </div>
              
              {/* Миниатюры */}
              {product.image_url && (
                <div className="flex gap-2">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface border-2 border-brand">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Информация о продукте */}
            <div className="space-y-6">
              {/* Категория */}
              <Badge 
                variant="outline" 
                className={cn(
                  'w-fit text-sm',
                  product.category === 'peptides' 
                    ? 'bg-brand-50 text-brand border-brand/20'
                    : 'bg-accent/10 text-accent border-accent/20'
                )}
              >
                {product.category === 'peptides' ? 'Пептиды' : 'Добавки'}
              </Badge>

              {/* Название */}
              <h1 className="text-3xl font-bold text-ink leading-tight">
                {product.title}
              </h1>

              {/* Цена */}
              <div className="flex items-baseline gap-2">
                <ProductPrice price={product.price_byn} size="lg" />
                <span className="text-muted text-sm">за единицу</span>
              </div>

              {/* Теги */}
              {product.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-ink">Теги:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Кому подойдет */}
              <div className="p-4 bg-brand-50 dark:bg-brand-50/20 rounded-lg">
                <h3 className="font-medium text-ink mb-2">Кому подойдет:</h3>
                <p className="text-sm text-ink">{targetAudience}</p>
              </div>

              {/* Добавить в корзину */}
              <AddToCart product={product} />
            </div>
          </div>

          {/* Описание */}
          {product.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-ink mb-4">Описание</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-ink leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}

          {/* Рекомендации */}
          {recommendations.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-ink mb-6">
                Рекомендуем также
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec: ProductT) => (
                  <ProductCard
                    key={rec.id}
                    product={rec}
                    onAddToCart={() => {}} // TODO: Реализовать добавление
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ActionFab onAddMeal={() => console.log('Navigate to add meal')} />
      <CoachBottomSheet open={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
    </PageLayout>
  );
}
