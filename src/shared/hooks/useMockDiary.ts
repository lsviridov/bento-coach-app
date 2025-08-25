import { useState, useEffect } from 'react';
import type { z } from 'zod';
import { DaySummary } from '@/entities/meal';

// Mock data for development
const mockDayData: z.infer<typeof DaySummary> = {
  date: '2025-08-24',
  totals: {
    water_ml: 1250,
    calories: 1850,
    protein_g: 95.5,
    fat_g: 68.4,
    carbs_g: 132.9
  },
  meals: [
    {
      id: 'meal-1',
      takenAt: '2025-08-24T08:00:00.000Z',
      title: 'Овсянка с ягодами',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      photoUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200&h=200&fit=crop'
    },
    {
      id: 'meal-2',
      takenAt: '2025-08-24T13:00:00.000Z',
      title: 'Куриная грудка с овощами',
      grams: 300,
      calories: 450,
      protein_g: 45.2,
      fat_g: 12.8,
      carbs_g: 18.5
    },
    {
      id: 'meal-3',
      takenAt: '2025-08-24T19:00:00.000Z',
      title: 'Творожная запеканка',
      grams: 200,
      calories: 280,
      protein_g: 18.6,
      fat_g: 15.4,
      carbs_g: 22.1
    }
  ]
};

export function useMockDiary() {
  const [data, setData] = useState<z.infer<typeof DaySummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setData(mockDayData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, error };
}
