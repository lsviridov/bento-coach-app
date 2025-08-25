import { api } from '@/shared/api/fetcher';
import { CreateMeal, Meal, DaySummary } from './schemas';
import { z } from 'zod';

export async function createMeal(data: unknown) {
  const valid = CreateMeal.parse(data);
  const res = await api('/api/meals', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(valid)
  });
  return res as Meal;
}

export async function fetchDay(dateISO: string) {
  console.log('Fetching day data for:', dateISO);
  
  // Temporary mock data for testing
  if (import.meta.env.DEV) {
    console.log('Using mock data in development');
    const mockData = {
      date: dateISO,
      totals: {
        water_ml: 1250,
        calories: 1850,
        protein_g: 95.5,
        fat_g: 68.4,
        carbs_g: 132.9
      },
      meals: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          takenAt: `${dateISO}T08:00:00.000Z`,
          title: 'Овсянка с ягодами',
          grams: 250,
          calories: 320,
          protein_g: 12.5,
          fat_g: 8.2,
          carbs_g: 52.3,
          photoUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200&h=200&fit=crop'
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          takenAt: `${dateISO}T13:00:00.000Z`,
          title: 'Куриная грудка с овощами',
          grams: 300,
          calories: 450,
          protein_g: 45.2,
          fat_g: 12.8,
          carbs_g: 18.5
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          takenAt: `${dateISO}T19:00:00.000Z`,
          title: 'Творожная запеканка',
          grams: 200,
          calories: 280,
          protein_g: 18.6,
          fat_g: 15.4,
          carbs_g: 22.1
        }
      ]
    };
    
    console.log('Returning mock data:', mockData);
    return DaySummary.parse(mockData);
  }
  
  // Real API call
  const json = await api(`/api/diary?date=${dateISO}`);
  console.log('Received day data:', json);
  return DaySummary.parse(json);
}

export async function getMeals(date: string) {
  const res = await api(`/api/diary?date=${date}`);
  return res;
}

export async function updateMeal(id: string, patch: Partial<z.infer<typeof Meal>>) {
  const json = await api(`/api/meals/${id}`, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(patch) 
  });
  return Meal.parse(json);
}

export async function deleteMeal(id: string) {
  await api(`/api/meals/${id}`, { method: 'DELETE' });
}
