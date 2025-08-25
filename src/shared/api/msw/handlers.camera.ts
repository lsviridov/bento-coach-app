import { http, HttpResponse } from 'msw';
import { CreateMeal } from '@/entities/meal';

// In-memory store для временных фото
const photoStore = new Map<string, string>();

// Генерируем детерминированный ответ для анализа
const generateAnalysisResult = (imageUrl: string) => {
  // Используем хеш URL как seed для детерминированности
  const hash = imageUrl.split('').reduce((a, b) => {
    a = ((a << 5) - a + b.charCodeAt(0)) & 0xFFFFFFFF;
    return a;
  }, 0);
  
  const seed = Math.abs(hash);
  
  // Предопределённые варианты для стабильности
  const mealVariants = [
    {
      labels: ['овсянка', 'ягоды', 'мёд'],
      confidence: [0.92, 0.87, 0.78],
      defaultGrams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    },
    {
      labels: ['куриная грудка', 'брокколи', 'рис'],
      confidence: [0.95, 0.89, 0.82],
      defaultGrams: 300,
      calories: 450,
      protein_g: 45.2,
      fat_g: 12.8,
      carbs_g: 18.5
    },
    {
      labels: ['творожная запеканка', 'сметана'],
      confidence: [0.88, 0.75],
      defaultGrams: 200,
      calories: 280,
      protein_g: 18.6,
      fat_g: 15.4,
      carbs_g: 22.1
    },
    {
      labels: ['смузи', 'банан', 'молоко'],
      confidence: [0.85, 0.91, 0.79],
      defaultGrams: 350,
      calories: 180,
      protein_g: 4.2,
      fat_g: 2.1,
      carbs_g: 38.5
    }
  ];
  
  const variantIndex = seed % mealVariants.length;
  return mealVariants[variantIndex];
};

export const cameraHandlers = [
  // POST /api/analyze
  http.post('/api/analyze', async ({ request }) => {
    try {
      const body = await request.json();
      const { imageUrl } = body;
      
      if (!imageUrl) {
        return HttpResponse.json(
          { error: 'Missing imageUrl' },
          { status: 400 }
        );
      }
      
      // Сохраняем фото в памяти для превью
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      photoStore.set(photoId, imageUrl);
      
      // Генерируем результат анализа
      const result = generateAnalysisResult(imageUrl);
      
      // Добавляем ID фото в ответ
      const response = {
        ...result,
        photoId
      };
      
      console.log('MSW: Analysis result generated:', response);
      return HttpResponse.json(response);
      
    } catch (error) {
      console.error('MSW: Analysis error:', error);
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }),

  // POST /api/meals
  http.post('/api/meals', async ({ request }) => {
    try {
      const body = await request.json();
      
      // Валидируем данные через Zod схему
      const validationResult = CreateMeal.safeParse(body);
      if (!validationResult.success) {
        return HttpResponse.json(
          { error: 'Invalid meal data', details: validationResult.error.errors },
          { status: 400 }
        );
      }
      
      const mealData = validationResult.data;
      
      // Генерируем уникальный ID
      const mealId = `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Создаём полный объект приёма пищи
      const meal = {
        id: mealId,
        ...mealData,
        takenAt: mealData.takenAt || new Date().toISOString()
      };
      
      console.log('MSW: Meal created:', meal);
      
      return HttpResponse.json(meal, { status: 201 });
      
    } catch (error) {
      console.error('MSW: Create meal error:', error);
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }),

  // GET /api/photos/:id (для получения сохранённых фото)
  http.get('/api/photos/:id', ({ params }) => {
    const { id } = params;
    const photoUrl = photoStore.get(id as string);
    
    if (!photoUrl) {
      return HttpResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ photoUrl });
  })
];
