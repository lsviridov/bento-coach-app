import { http, HttpResponse } from 'msw';
import { format, subDays, addMinutes } from 'date-fns';

// Моковые данные для рекомендаций магазина
const mockProducts = [
  {
    id: '1',
    slug: 'omega-3-fish-oil',
    title: 'Омега-3 Рыбий жир',
    price_byn: 45.99,
    reason: 'Антиоксидант, цель: восстановление',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
  },
  {
    id: '2',
    slug: 'protein-powder',
    title: 'Протеин сывороточный',
    price_byn: 89.99,
    reason: 'Высокий белок, цель: рост мышц',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'
  },
  {
    id: '3',
    slug: 'vitamin-d3',
    title: 'Витамин D3 2000 МЕ',
    price_byn: 32.50,
    reason: 'Иммунитет, цель: общее здоровье',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
  }
];

// Генерация случайных данных для недели
const generateWeekData = () => {
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
  return days;
};

// Генерация случайных трендов
const generateTrends = () => {
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

// Генерация следующего шага протокола
const generateNextProtocol = () => {
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

// Генерация совета коуча в зависимости от времени
const generateCoachTip = () => {
  const hour = new Date().getHour();
  const tips = [
    {
      text: 'Пора пополнить запасы белка! Рекомендую добавить протеин в рацион.',
      cta: { label: 'Подобрать ужин', intent: 'suggestMeal' as const }
    },
    {
      text: 'Не забудьте про воду! Выпейте стакан прямо сейчас.',
      cta: { label: 'Добавить воду', intent: 'logWater' as const }
    },
    {
      text: 'Отличный день для анализа питания! Посмотрите, как идут дела.',
      cta: { label: 'Открыть дневник', intent: 'openDiary' as const }
    },
    {
      text: 'Пора пополнить запасы добавок! Проверьте, что заканчивается.',
      cta: { label: 'В магазин', intent: 'openShop' as const }
    }
  ];
  
  // Выбираем совет в зависимости от времени суток
  let tipIndex = 0;
  if (hour < 12) tipIndex = 0; // Утро - протеин
  else if (hour < 16) tipIndex = 1; // День - вода
  else if (hour < 20) tipIndex = 2; // Вечер - дневник
  else tipIndex = 3; // Ночь - магазин
  
  return tips[tipIndex];
};

export const homeHandlers = [
  // Совет коуча
  http.get('/api/home/coach-tip', () => {
    return HttpResponse.json(generateCoachTip());
  }),

  // Данные недели
  http.get('/api/home/week', () => {
    return HttpResponse.json({ days: generateWeekData() });
  }),

  // Тренды
  http.get('/api/home/trends', () => {
    return HttpResponse.json(generateTrends());
  }),

  // Следующий шаг протокола
  http.get('/api/home/next-protocol', () => {
    return HttpResponse.json(generateNextProtocol());
  }),

  // Рекомендации магазина
  http.get('/api/home/recos', () => {
    // Возвращаем случайные 2-3 товара
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 2) + 2; // 2-3 товара
    return HttpResponse.json({ items: shuffled.slice(0, count) });
  }),

  // Добавление воды
  http.post('/api/water', async ({ request }) => {
    const body = await request.json();
    const amount = body.amount || 250;
    
    // Моковый ответ с новым общим объёмом
    const currentTotal = Math.floor(Math.random() * 1000) + 500; // 500-1500 мл
    const newTotal = currentTotal + amount;
    
    return HttpResponse.json({ 
      success: true, 
      total: newTotal,
      added: amount 
    });
  }),

  // Отметить выполнение протокола
  http.post('/api/protocols/mark', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({ 
      success: true, 
      message: 'Шаг протокола выполнен',
      protocolId: body.protocolId 
    });
  }),

  // Отложить напоминание протокола
  http.post('/api/protocols/snooze', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({ 
      success: true, 
      message: 'Напоминание отложено',
      protocolId: body.protocolId,
      snoozeMinutes: body.minutes || 30
    });
  })
];
