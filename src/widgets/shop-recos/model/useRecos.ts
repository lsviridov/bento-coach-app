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
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      slug: 'peptide-fish',
      title: 'Пептидный гидролизат рыбного белка',
      price_byn: 128,
      reason: 'Легкоусвояемый белок, цель: лёгкость и омега-3',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      slug: 'peptide-beef',
      title: 'Пептидный гидролизат говяжьего белка',
      price_byn: 189,
      reason: 'Мощный белок, цель: сила и выносливость',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      slug: 'peptide-skate',
      title: 'Пептидный гидролизат белка ската',
      price_byn: 402,
      reason: 'Премиум белок, цель: максимальное восстановление',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      slug: 'antiparasitic',
      title: 'Антипаразитарный комплекс',
      price_byn: 53,
      reason: 'Детокс, цель: очищение организма и иммунитет',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      slug: 'calcemarin',
      title: 'Кальцемарин',
      price_byn: 55,
      reason: 'Кальций и минералы, цель: укрепление костей',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      slug: 'nucleamin',
      title: 'Нуклеамин',
      price_byn: 100,
      reason: 'Восстановление ДНК/РНК, цель: клеточное здоровье',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      slug: 'resveratrol',
      title: 'Ресвератрол',
      price_byn: 66,
      reason: 'Антиоксидант, цель: долголетие и здоровье сердца',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      slug: 'argenix',
      title: 'Коллоидное серебро ARGENIX',
      price_byn: 95,
      reason: 'Иммунитет, цель: защита от бактерий',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
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
