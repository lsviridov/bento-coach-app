import { useQuery } from '@tanstack/react-query';
import { CoachTip } from './schemas';

// Мок данные для совета коуча
const mockCoachTip: CoachTip = {
  text: 'Пора пополнить запасы белка! Рекомендую добавить протеин в рацион.',
  cta: { 
    label: 'Подобрать ужин', 
    intent: 'suggestMeal' as const 
  }
};

export const useCoachTip = () => {
  return useQuery({
    queryKey: ['home', 'coach-tip'],
    queryFn: async () => {
      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCoachTip;
    },
    staleTime: 60_000,
    retry: 2,
  });
};
