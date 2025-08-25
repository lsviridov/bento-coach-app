import { useState, useEffect } from 'react';
import { MessageT, SessionT, CoachResponseT } from '@features/coach-chat';
import { v4 as uuidv4 } from 'uuid';

// Моковые данные
const mockSessions: (SessionT & { messageCount?: number; isActive?: boolean })[] = [
  {
    id: 'session-1',
    title: 'Мой план на день',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 час назад
    lastMessage: 'Как дела с питанием сегодня?',
    messageCount: 12,
    isActive: true
  },
  {
    id: 'session-2',
    title: 'Планирование питания на неделю',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
    lastMessage: 'Спасибо за рекомендации!',
    messageCount: 8,
    isActive: false
  },
  {
    id: 'session-3',
    title: 'Вопросы по протеину',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
    lastMessage: 'Понял, буду следовать советам',
    messageCount: 15,
    isActive: false
  },
  {
    id: 'session-4',
    title: 'Анализ дневника питания',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 дня назад
    updatedAt: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    lastMessage: 'Отличные результаты!',
    messageCount: 6,
    isActive: false
  },
  {
    id: 'session-5',
    title: 'Рекомендации по тренировкам',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 дней назад
    updatedAt: new Date(Date.now() - 345600000).toISOString(), // 4 дня назад
    lastMessage: 'Попробую новый план',
    messageCount: 10,
    isActive: false
  }
];

const mockMessages: MessageT[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Привет! Я твой персональный нутрициолог. Чем могу помочь?',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    intents: ['explainNutrient', 'suggestMeal']
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Что мне есть на ужин?',
    createdAt: new Date(Date.now() - 30000).toISOString()
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Отличный вопрос! Учитывая твои цели, рекомендую белковый ужин с овощами. Можешь добавить куриную грудку или рыбу.',
    createdAt: new Date().toISOString(),
    intents: ['suggestMeal', 'addMeal']
  }
];

// Симуляция задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useMockSessions() {
  const [data, setData] = useState<(SessionT & { messageCount?: number; isActive?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        await delay(500); // Симулируем задержку
        setData(mockSessions);
      } catch (err) {
        setError('Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  return { data, isLoading, error };
}

export function useMockMessages(sessionId: string) {
  const [data, setData] = useState<MessageT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        await delay(300); // Симулируем задержку
        setData(mockMessages);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  return { data, isLoading, error };
}

export function useMockSend() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    payload: { sessionId: string; message: string; context?: any },
    options?: { onSuccess?: (data: CoachResponseT) => void; onError?: (error: any) => void }
  ) => {
    try {
      setIsPending(true);
      await delay(1000); // Симулируем задержку ответа

      // Генерируем ответ в зависимости от контекста
      let reply = '';
      let intents: string[] = [];
      
      if (payload.context?.page === 'diary') {
        reply = 'Вижу, что ты в дневнике! Сегодня белок немного низкий. Хочешь добавить творог на ужин или получить рекомендации по питанию?';
        intents = ['suggestMeal', 'addMeal', 'logWater'];
      } else if (payload.context?.page === 'shop' && payload.context?.productSlug) {
        const productName = payload.context.productSlug;
        reply = `Этот продукт отлично подходит для твоих целей! ${productName} содержит важные нутриенты. Хочешь добавить в корзину или узнать больше?`;
        intents = ['suggestBundle', 'explainNutrient'];
      } else if (payload.message.toLowerCase().includes('вода') || payload.message.toLowerCase().includes('пить')) {
        reply = 'Отличная идея! Вода очень важна для здоровья. Хочешь записать выпитую воду или получить напоминание?';
        intents = ['logWater', 'suggestMeal'];
      } else if (payload.message.toLowerCase().includes('белок') || payload.message.toLowerCase().includes('протеин')) {
        reply = 'Белок - основа мышечной массы! Рекомендую 1.6-2.2г на кг веса. Хочешь добавить белковый приём пищи?';
        intents = ['addMeal', 'suggestMeal', 'explainNutrient'];
      } else {
        reply = 'Привет! Я твой персональный нутрициолог. Могу помочь с питанием, целями и дневником. Что тебя интересует?';
        intents = ['explainNutrient', 'suggestMeal', 'logWater'];
      }

      const response: CoachResponseT = {
        sessionId: payload.sessionId,
        reply,
        intents
      };

      options?.onSuccess?.(response);
    } catch (err) {
      options?.onError?.(err);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
