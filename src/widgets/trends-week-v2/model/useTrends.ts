import { useQuery } from '@tanstack/react-query';
import { TrendsWeek } from './schemas';
import { api } from '../../../shared/api/fetcher';

// Генерация мок данных для трендов недели
const generateMockTrendsWeek = (): TrendsWeek => {
  const protein = Array.from({ length: 7 }, () => Math.random());
  const water = Array.from({ length: 7 }, () => Math.random());
  
  // Получаем понедельник текущей недели
  const today = new Date();
  const monday = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  monday.setDate(today.getDate() - daysToMonday);
  
  return {
    protein: {
      values: protein,
      goal: 1,
      deltaPct: Math.round((Math.random() - 0.5) * 40),
      label: "Белок"
    },
    water: {
      values: water,
      goal: 1,
      deltaPct: Math.round((Math.random() - 0.5) * 30),
      label: "Вода"
    },
    startISO: monday.toISOString().split('T')[0]
  };
};

export const useTrendsWeek = () =>
  useQuery({
    queryKey: ['home','trends-week-v2'],
    queryFn: async () => {
      // В продакшене здесь будет реальный API
      // return TrendsWeek.parse(await api('/api/home/trends'));
      
      // Пока используем мок
      await new Promise(resolve => setTimeout(resolve, 400));
      return generateMockTrendsWeek();
    },
    staleTime: 60_000,
    retry: 2,
  });
