import { useQuery } from '@tanstack/react-query';
import { Week } from './schemas';
import { format, subDays } from 'date-fns';

// Генерация мок данных для недели
const generateMockWeek = (): Week => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      protein_ok: Math.random() > 0.3,
      water_ok: Math.random() > 0.2,
      protocols_ok: Math.random() > 0.4
    });
  }
  return { days };
};

export const useWeek = () => {
  return useQuery({
    queryKey: ['home', 'week'],
    queryFn: async () => {
      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 300));
      return generateMockWeek();
    },
    staleTime: 60_000,
    retry: 2,
  });
};
