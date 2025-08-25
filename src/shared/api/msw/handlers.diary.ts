import { http, HttpResponse } from 'msw';
import { DaySummary, Meal } from '@entities/meal';

// In-memory store for MSW
const mealsStore = new Map<string, Meal[]>();

// Generate deterministic fake data for today ±2 days
const generateFakeMeals = (date: string): Meal[] => {
  const seed = date.split('-').join(''); // YYYYMMDD as seed
  
  const baseMeals = [
    {
      id: `meal-${seed}-1`,
      takenAt: `${date}T08:00:00.000Z`,
      title: 'Овсянка с ягодами',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      photoUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200&h=200&fit=crop'
    },
    {
      id: `meal-${seed}-2`,
      takenAt: `${date}T13:00:00.000Z`,
      title: 'Куриная грудка с овощами',
      grams: 300,
      calories: 450,
      protein_g: 45.2,
      fat_g: 12.8,
      carbs_g: 18.5
    },
    {
      id: `meal-${seed}-3`,
      takenAt: `${date}T19:00:00.000Z`,
      title: 'Творожная запеканка',
      grams: 200,
      calories: 280,
      protein_g: 18.6,
      fat_g: 15.4,
      carbs_g: 22.1
    }
  ];
  
  // Add some variation based on date
  const dayOfYear = new Date(date).getDay();
  if (dayOfYear === 0 || dayOfYear === 6) { // Weekend
    baseMeals.push({
      id: `meal-${seed}-4`,
      takenAt: `${date}T15:30:00.000Z`,
      title: 'Смузи с бананом',
      grams: 350,
      calories: 180,
      protein_g: 4.2,
      fat_g: 2.1,
      carbs_g: 38.5
    });
  }
  
  return baseMeals;
};

const generateDaySummary = (date: string): DaySummary => {
  const meals = generateFakeMeals(date);
  
  const totals = meals.reduce((acc, meal) => ({
    water_ml: acc.water_ml + 250, // Assume 250ml per meal
    calories: acc.calories + meal.calories,
    protein_g: acc.protein_g + meal.protein_g,
    fat_g: acc.fat_g + meal.fat_g,
    carbs_g: acc.carbs_g + meal.carbs_g
  }), {
    water_ml: 0,
    calories: 0,
    protein_g: 0,
    fat_g: 0,
    carbs_g: 0
  });
  
  return {
    date,
    totals,
    meals
  };
};

export const diaryHandlers = [
  // GET /api/diary?date=YYYY-MM-DD
  http.get('/api/diary', ({ request }) => {
    console.log('MSW handler called for /api/diary with request:', request.url);
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    console.log('MSW extracted date:', date);
    
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.log('MSW invalid date format, returning error');
      return HttpResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Check if we have cached meals for this date
    if (mealsStore.has(date)) {
      console.log('MSW returning cached data for date:', date);
      const meals = mealsStore.get(date)!;
      const totals = meals.reduce((acc, meal) => ({
        water_ml: acc.water_ml + 250,
        calories: acc.calories + meal.calories,
        protein_g: acc.protein_g + meal.protein_g,
        fat_g: acc.fat_g + meal.fat_g,
        carbs_g: acc.carbs_g + meal.carbs_g
      }), {
        water_ml: 0,
        calories: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_g: 0
      });
      
      return HttpResponse.json({
        date,
        totals,
        meals
      });
    }
    
    // Generate new data for this date
    console.log('MSW generating new data for date:', date);
    const daySummary = generateDaySummary(date);
    mealsStore.set(date, daySummary.meals);
    
    console.log('MSW returning generated data:', daySummary);
    return HttpResponse.json(daySummary);
  }),
  
  // POST /api/meals
  http.post('/api/meals', async ({ request }) => {
    const body = await request.json();
    const date = body.takenAt ? body.takenAt.split('T')[0] : new Date().toISOString().split('T')[0];
    
    const newMeal: Meal = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      takenAt: body.takenAt || new Date().toISOString(),
      title: body.title,
      grams: body.grams,
      calories: body.calories,
      protein_g: body.protein_g,
      fat_g: body.fat_g,
      carbs_g: body.carbs_g,
      photoUrl: body.photoUrl
    };
    
    // Add to store
    if (!mealsStore.has(date)) {
      mealsStore.set(date, []);
    }
    mealsStore.get(date)!.push(newMeal);
    
    return HttpResponse.json(newMeal);
  }),
  
  // PUT /api/meals/:id
  http.put('/api/meals/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    
    // Find meal in store
    let foundMeal: Meal | undefined;
    let foundDate: string | undefined;
    
    for (const [date, meals] of mealsStore.entries()) {
      const meal = meals.find(m => m.id === id);
      if (meal) {
        foundMeal = meal;
        foundDate = date;
        break;
      }
    }
    
    if (!foundMeal || !foundDate) {
      return HttpResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }
    
    // Update meal
    const updatedMeal: Meal = {
      ...foundMeal,
      ...body,
      id: foundMeal.id, // Ensure ID doesn't change
      takenAt: body.takenAt || foundMeal.takenAt
    };
    
    // Update in store
    const meals = mealsStore.get(foundDate)!;
    const mealIndex = meals.findIndex(m => m.id === id);
    meals[mealIndex] = updatedMeal;
    
    return HttpResponse.json(updatedMeal);
  }),
  
  // DELETE /api/meals/:id
  http.delete('/api/meals/:id', ({ params }) => {
    const { id } = params;
    
    // Find and remove meal from store
    for (const [date, meals] of mealsStore.entries()) {
      const mealIndex = meals.findIndex(m => m.id === id);
      if (mealIndex !== -1) {
        meals.splice(mealIndex, 1);
        break;
      }
    }
    
    return HttpResponse.json({ success: true });
  })
];
