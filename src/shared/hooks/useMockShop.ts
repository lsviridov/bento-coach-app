import { useState, useEffect, useCallback } from 'react';
import { ProductT, CartItemT, ProductListQueryT } from '@/entities/product';

// Mock catalog data
const mockProducts: ProductT[] = [
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

// Mock cart state
const mockCart: CartItemT[] = [];

export function useMockShop() {
  const [products, setProducts] = useState<ProductT[]>([]);
  const [cart, setCart] = useState<CartItemT[]>(mockCart);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter products based on query
  const filterProducts = useCallback((query: ProductListQueryT) => {
    let filtered = [...mockProducts];

    // Search by text
    if (query.q) {
      const searchTerm = query.q.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by categories
    if (query.category && query.category.length > 0) {
      filtered = filtered.filter(product => query.category!.includes(product.category));
    }

    // Filter by goals (tags)
    if (query.goals && query.goals.length > 0) {
      filtered = filtered.filter(product =>
        product.tags.some(tag => query.goals!.includes(tag))
      );
    }

    // Filter by price
    if (query.priceMin !== undefined) {
      filtered = filtered.filter(product => product.price_byn >= query.priceMin!);
    }
    if (query.priceMax !== undefined) {
      filtered = filtered.filter(product => product.price_byn <= query.priceMax!);
    }

    // Sort
    switch (query.sort) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price_byn - b.price_byn);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price_byn - a.price_byn);
        break;
      case 'popular':
      default:
        // Сортируем по популярности (можно изменить логику)
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }

    return filtered;
  }, []);

  // Get products with pagination
  const getProducts = useCallback(async (query: ProductListQueryT) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = filterProducts(query);
    const startIndex = query.cursor ? parseInt(query.cursor) : 0;
    const endIndex = startIndex + query.limit;
    const items = filtered.slice(startIndex, endIndex);
    const nextCursor = endIndex < filtered.length ? endIndex.toString() : undefined;

    setIsLoading(false);
    
    return {
      items,
      nextCursor,
      total: filtered.length
    };
  }, [filterProducts]);

  // Get single product by slug
  const getProduct = useCallback(async (slug: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const product = mockProducts.find(p => p.slug === slug);
    setIsLoading(false);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }, []);

  // Cart operations
  const addToCart = useCallback(async (productId: string, qty: number, price_byn: number) => {
    const existingIndex = cart.findIndex(item => item.product_id === productId);
    
    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty = Math.min(20, updatedCart[existingIndex].qty + qty);
      setCart(updatedCart);
    } else {
      setCart(prev => [...prev, { product_id: productId, qty, price_byn }]);
    }
  }, [cart]);

  const updateCartItem = useCallback(async (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product_id !== productId));
    } else {
      setCart(prev => prev.map(item => 
        item.product_id === productId 
          ? { ...item, qty: Math.min(20, qty) }
          : item
      ));
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
  }, []);

  const getCart = useCallback(async () => {
    const total = cart.reduce((sum, item) => sum + item.price_byn * item.qty, 0);
    return { items: cart, total };
  }, [cart]);

  return {
    // Products
    products,
    getProducts,
    getProduct,
    isLoading,
    error,
    
    // Cart
    cart,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
}
