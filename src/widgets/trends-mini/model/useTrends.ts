import { useQuery } from '@tanstack/react-query';
import { Trends } from './schemas';

// Генерация мок данных для трендов
const generateMockTrends = (): Trends => {
  const protein = Array.from({ length: 7 }, () => Math.random());
  const water = Array.from({ length: 7 }, () => Math.random());
  
  return {
    protein,
    water,
    delta: {
      protein_pct: Math.round((Math.random() - 0.5) * 40),
      water_pct: Math.round((Math.random() - 0.5) * 30)
    }
  };
};

export const useTrends = () => {
  return useQuery({
    queryKey: ['home', 'trends'],
    queryFn: async () => {
      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 400));
      return generateMockTrends();
    },
    staleTime: 60_000,
    retry: 2,
  });
};
