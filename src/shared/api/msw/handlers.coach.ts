import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

// Моковые данные
const mockSessions = [
  {
    id: 'session-1',
    title: 'Мой план на день',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessage: 'Как дела с питанием сегодня?'
  }
];

const mockMessages = [
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

export const coachHandlers = [
  // POST /api/coach - отправить сообщение
  http.post('/api/coach', async ({ request }) => {
    const body = await request.json();
    
    // Генерируем ответ в зависимости от контекста
    let reply = '';
    let intents: string[] = [];
    
    if (body.context?.page === 'diary') {
      reply = 'Вижу, что ты в дневнике! Сегодня белок немного низкий. Хочешь добавить творог на ужин или получить рекомендации по питанию?';
      intents = ['suggestMeal', 'addMeal', 'logWater'];
    } else if (body.context?.page === 'shop' && body.context?.productSlug) {
      const productName = body.context.productSlug;
      reply = `Этот продукт отлично подходит для твоих целей! ${productName} содержит важные нутриенты. Хочешь добавить в корзину или узнать больше?`;
      intents = ['suggestBundle', 'explainNutrient'];
    } else if (body.message.toLowerCase().includes('вода') || body.message.toLowerCase().includes('пить')) {
      reply = 'Отличная идея! Вода очень важна для здоровья. Хочешь записать выпитую воду или получить напоминание?';
      intents = ['logWater', 'suggestMeal'];
    } else if (body.message.toLowerCase().includes('белок') || body.message.toLowerCase().includes('протеин')) {
      reply = 'Белок - основа мышечной массы! Рекомендую 1.6-2.2г на кг веса. Хочешь добавить белковый приём пищи?';
      intents = ['addMeal', 'suggestMeal', 'explainNutrient'];
    } else {
      reply = 'Привет! Я твой персональный нутрициолог. Могу помочь с питанием, целями и дневником. Что тебя интересует?';
      intents = ['explainNutrient', 'suggestMeal', 'logWater'];
    }
    
    return HttpResponse.json({
      sessionId: body.sessionId || uuidv4(),
      reply,
      intents
    });
  }),

  // GET /api/coach/sessions - список сессий
  http.get('/api/coach/sessions', () => {
    return HttpResponse.json(mockSessions);
  }),

  // GET /api/coach/messages - история сообщений
  http.get('/api/coach/messages', ({ request }) => {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return HttpResponse.json([]);
    }
    
    return HttpResponse.json(mockMessages);
  })
];
