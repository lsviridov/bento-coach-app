import { useQuery } from '@tanstack/react-query';
import { NextProto } from './schemas';
import { addMinutes } from 'date-fns';

// Генерация мок данных для следующего шага протокола
const generateMockNextProtocol = (): NextProto => {
  const now = new Date();
  const futureTime = addMinutes(now, Math.floor(Math.random() * 75) + 45); // 45-120 минут
  
  const actions = ['meal', 'supplement', 'reminder'] as const;
  const titles = [
    'Приём протеина',
    'Витамин D3',
    'Напоминание о воде',
    'Омега-3',
    'Креатин'
  ];
  
  return {
    at: futureTime.toISOString(),
    title: titles[Math.floor(Math.random() * titles.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    minutes_left: Math.floor((futureTime.getTime() - now.getTime()) / 60000)
  };
};

export const useNextProtocol = () => {
  return useQuery({
    queryKey: ['home', 'next-protocol'],
    queryFn: async () => {
      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 200));
      return generateMockNextProtocol();
    },
    staleTime: 30_000, // Обновляем чаще для таймера
    retry: 2,
  });
};
