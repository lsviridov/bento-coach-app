import { useQuery } from '@tanstack/react-query';
import { Recos } from './schemas';

// Расширенные данные рекомендаций из каталога магазина
const mockRecos: Recos = {
  items: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      slug: 'peptide-chicken',
      title: 'Пептидный гидролизат куриного белка',
      price_byn: 96,
      reason: 'Высокий белок, цель: рост мышц и восстановление',
      image_url: '/images/products/peptides/peptides-peptide-chicken-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      slug: 'peptide-fish',
      title: 'Пептидный гидролизат рыбного белка',
      price_byn: 128,
      reason: 'Легкоусвояемый белок, цель: лёгкость и омега-3',
      image_url: '/images/products/peptides/peptides-peptide-fish-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      slug: 'peptide-beef',
      title: 'Пептидный гидролизат говяжьего белка',
      price_byn: 189,
      reason: 'Мощный белок, цель: сила и выносливость',
      image_url: '/images/products/peptides/peptides-peptide-beef-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      slug: 'peptide-skate',
      title: 'Пептидный гидролизат белка ската',
      price_byn: 402,
      reason: 'Премиум белок, цель: максимальное восстановление',
      image_url: '/images/products/peptides/peptides-peptide-skate-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      slug: 'antiparasitic',
      title: 'Антипаразитарный комплекс',
      price_byn: 53,
      reason: 'Детокс, цель: очищение организма и иммунитет',
      image_url: '/images/products/supplements/supplements-antiparasitic-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      slug: 'calcemarin',
      title: 'Кальцемарин',
      price_byn: 55,
      reason: 'Кальций и минералы, цель: укрепление костей',
      image_url: '/images/products/supplements/supplements-calcemarin-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      slug: 'nucleamin',
      title: 'Нуклеамин',
      price_byn: 100,
      reason: 'Восстановление ДНК/РНК, цель: клеточное здоровье',
      image_url: '/images/products/supplements/supplements-nucleamin-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      slug: 'resveratrol',
      title: 'Ресвератрол',
      price_byn: 66,
      reason: 'Антиоксидант, цель: долголетие и здоровье сердца',
      image_url: '/images/products/supplements/supplements-resveratrol-400x400.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      slug: 'argenix',
      title: 'Коллоидное серебро ARGENIX',
      price_byn: 95,
      reason: 'Иммунитет, цель: защита от бактерий',
      image_url: '/images/products/supplements/supplements-argenix-400x400.jpg'
    }
  ]
};

export const useRecos = () => {
  return useQuery({
    queryKey: ['home', 'shop-recos'],
    queryFn: async () => {
      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockRecos;
    },
    staleTime: 300_000, // 5 минут для рекомендаций
    retry: 2,
  });
};
