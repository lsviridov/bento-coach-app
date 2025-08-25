import { http, HttpResponse } from 'msw';
import { ProductT, ProductListQueryT, CartItemT } from '@/entities/product';

// Каталог продуктов с реальными данными из adaptogenzz.by
const catalog: ProductT[] = [
  // Пептидные гидролизаты
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    slug: 'peptide-chicken',
    title: 'Пептидный гидролизат куриного белка',
    category: 'peptides',
    price_byn: 96,
    image_url: '/images/products/peptides/peptides-peptide-chicken-400x400.jpg',
    tags: ['белок', 'восстановление', 'мышечная масса'],
    description: 'Высококачественный гидролизат куриного белка для восстановления и роста мышечной массы'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    slug: 'peptide-fish',
    title: 'Пептидный гидролизат рыбного белка',
    category: 'peptides',
    price_byn: 128,
    image_url: '/images/products/peptides/peptides-peptide-fish-400x400.jpg',
    tags: ['белок', 'лёгкость', 'омега-3'],
    description: 'Легкоусвояемый рыбный белок с высоким содержанием омега-3 жирных кислот'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    slug: 'peptide-beef',
    title: 'Пептидный гидролизат говяжьего белка',
    category: 'peptides',
    price_byn: 189,
    image_url: '/images/products/peptides/peptides-peptide-beef-400x400.jpg',
    tags: ['белок', 'силы', 'выносливость'],
    description: 'Мощный говяжий белок для увеличения силы и выносливости'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    slug: 'peptide-skate',
    title: 'Пептидный гидролизат белка ската',
    category: 'peptides',
    price_byn: 402,
    image_url: '/images/products/peptides/peptides-peptide-skate-400x400.jpg',
    tags: ['премиум', 'эксклюзив', 'восстановление'],
    description: 'Эксклюзивный гидролизат белка ската для максимального восстановления'
  },
  
  // Комплексные пищевые добавки
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    slug: 'antiparasitic',
    title: 'Антипаразитарный комплекс',
    category: 'supplements',
    price_byn: 53,
    image_url: '/images/products/supplements/supplements-antiparasitic-400x400.jpg',
    tags: ['антипаразитарный', 'детокс', 'иммунитет'],
    description: 'Натуральный комплекс для очищения организма от паразитов'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    slug: 'calcemarin',
    title: 'Кальцемарин',
    category: 'supplements',
    price_byn: 55,
    image_url: '/images/products/supplements/supplements-calcemarin-400x400.jpg',
    tags: ['кости', 'кальций', 'минералы'],
    description: 'Комплекс кальция и минералов для укрепления костной ткани'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    slug: 'nucleamin',
    title: 'Нуклеамин',
    category: 'supplements',
    price_byn: 100,
    image_url: '/images/products/supplements/supplements-nucleamin-400x400.jpg',
    tags: ['восстановление', 'ДНК/РНК', 'клеточное здоровье'],
    description: 'Инновационный комплекс для восстановления ДНК/РНК и клеточного здоровья'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    slug: 'resveratrol',
    title: 'Ресвератрол',
    category: 'supplements',
    price_byn: 66,
    image_url: '/images/products/supplements/supplements-resveratrol-400x400.jpg',
    tags: ['антиоксидант', 'долголетие', 'сердечно-сосудистая система'],
    description: 'Мощный антиоксидант для поддержания здоровья и долголетия'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    slug: 'argenix',
    title: 'Коллоидное серебро ARGENIX',
    category: 'supplements',
    price_byn: 95,
    image_url: '/images/products/supplements/supplements-argenix-400x400.jpg',
    tags: ['иммунитет', 'антибактериальный', 'защита'],
    description: 'Коллоидное серебро для укрепления иммунитета и защиты от бактерий'
  }
];

// Корзина пользователя (в памяти для демо)
let userCart: CartItemT[] = [];

// Функция фильтрации продуктов
function filterProducts(query: ProductListQueryT) {
  let filtered = [...catalog];

  // Поиск по тексту
  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Фильтр по категориям
  if (query.category && query.category.length > 0) {
    filtered = filtered.filter(product => query.category!.includes(product.category));
  }

  // Фильтр по целям (тегам)
  if (query.goals && query.goals.length > 0) {
    filtered = filtered.filter(product =>
      product.tags.some(tag => query.goals!.includes(tag))
    );
  }

  // Фильтр по цене
  if (query.priceMin !== undefined) {
    filtered = filtered.filter(product => product.price_byn >= query.priceMin!);
  }
  if (query.priceMax !== undefined) {
    filtered = filtered.filter(product => product.price_byn <= query.priceMax!);
  }

  // Сортировка
  switch (query.sort) {
    case 'priceAsc':
      filtered.sort((a, b) => a.price_byn - b.price_byn);
      break;
    case 'priceDesc':
      filtered.sort((a, b) => b.price_byn - a.price_byn);
      break;
    case 'popular':
    default:
      // По умолчанию сортируем по популярности (id для демо)
      filtered.sort((a, b) => a.id.localeCompare(b.id));
      break;
  }

  return filtered;
}

export const shopHandlers = [
  // GET /api/products - список продуктов с фильтрацией
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const query = {
      q: url.searchParams.get('q') || undefined,
      category: url.searchParams.getAll('category') as ("peptides" | "supplements")[],
      goals: url.searchParams.getAll('goals'),
      priceMin: url.searchParams.get('priceMin') ? Number(url.searchParams.get('priceMin')) : undefined,
      priceMax: url.searchParams.get('priceMax') ? Number(url.searchParams.get('priceMax')) : undefined,
      cursor: url.searchParams.get('cursor') || undefined,
      limit: Number(url.searchParams.get('limit')) || 20,
      sort: (url.searchParams.get('sort') as "popular" | "priceAsc" | "priceDesc") || 'popular'
    };

    const filtered = filterProducts(query);
    const startIndex = query.cursor ? parseInt(query.cursor) : 0;
    const endIndex = startIndex + query.limit;
    const items = filtered.slice(startIndex, endIndex);
    const nextCursor = endIndex < filtered.length ? endIndex.toString() : undefined;

    return HttpResponse.json({
      items,
      nextCursor,
      total: filtered.length
    });
  }),

  // GET /api/products/:slug - продукт по slug
  http.get('/api/products/:slug', ({ params }) => {
    const { slug } = params;
    const product = catalog.find(p => p.slug === slug);
    
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  // GET /api/cart/items - получить корзину
  http.get('/api/cart/items', () => {
    return HttpResponse.json({
      items: userCart,
      total: userCart.reduce((sum, item) => sum + item.price_byn * item.qty, 0)
    });
  }),

  // POST /api/cart/items - добавить в корзину
  http.post('/api/cart/items', async ({ request }) => {
    const body = await request.json() as { product_id: string; qty: number; price_byn: number };
    const { product_id, qty, price_byn } = body;

    // Проверяем существующий товар в корзине
    const existingIndex = userCart.findIndex(item => item.product_id === product_id);
    
    if (existingIndex >= 0) {
      // Обновляем количество
      userCart[existingIndex].qty = Math.min(20, userCart[existingIndex].qty + qty);
    } else {
      // Добавляем новый товар
      userCart.push({ product_id, qty, price_byn });
    }

    return HttpResponse.json({
      success: true,
      message: 'Товар добавлен в корзину'
    });
  }),

  // PUT /api/cart/items/:productId - обновить количество
  http.put('/api/cart/items/:productId', async ({ params, request }) => {
    const { productId } = params;
    const { qty } = await request.json() as { qty: number };
    
    const itemIndex = userCart.findIndex(item => item.product_id === productId);
    
    if (itemIndex >= 0) {
      if (qty <= 0) {
        userCart.splice(itemIndex, 1);
      } else {
        userCart[itemIndex].qty = Math.min(20, qty);
      }
    }

    return HttpResponse.json({
      success: true,
      message: 'Корзина обновлена'
    });
  }),

  // DELETE /api/cart/items/:productId - удалить из корзины
  http.delete('/api/cart/items/:productId', ({ params }) => {
    const { productId } = params;
    userCart = userCart.filter(item => item.product_id !== productId);

    return HttpResponse.json({
      success: true,
      message: 'Товар удален из корзины'
    });
  }),

  // DELETE /api/cart/items - очистить корзину
  http.delete('/api/cart/items', () => {
    userCart = [];
    return HttpResponse.json({
      success: true,
      message: 'Корзина очищена'
    });
  })
];
