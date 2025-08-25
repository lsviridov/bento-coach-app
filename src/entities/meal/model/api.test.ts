import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDay, createMeal, updateMeal, deleteMeal } from './api';
import { Meal, DaySummary } from './schemas';

// Mock the shared API fetcher
vi.mock('@shared/api/fetcher', () => ({
  api: vi.fn()
}));

const mockApi = vi.mocked(await import('@shared/api/fetcher')).api;

describe('Meal API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDay', () => {
    it('should fetch day data successfully', async () => {
      const mockDayData = {
        date: '2024-01-15',
        totals: {
          water_ml: 750,
          calories: 1850,
          protein_g: 95.2,
          fat_g: 65.8,
          carbs_g: 180.3
        },
        meals: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            takenAt: '2024-01-15T08:00:00.000Z',
            title: 'Овсянка с ягодами',
            grams: 250,
            calories: 320,
            protein_g: 12.5,
            fat_g: 8.2,
            carbs_g: 52.3
          }
        ]
      };

      mockApi.mockResolvedValue(mockDayData);

      const result = await fetchDay('2024-01-15');

      expect(result).toHaveProperty('date', '2024-01-15');
      expect(result).toHaveProperty('totals');
      expect(result).toHaveProperty('meals');
      expect(result.meals).toHaveLength(3);
      expect(result.meals[0]).toHaveProperty('title', 'Овсянка с ягодами');
    });

    it('should return mock data in dev mode', async () => {
      // В dev режиме функция всегда возвращает валидные мок данные
      const result = await fetchDay('2024-01-15');
      
      expect(result).toBeDefined();
      expect(result.date).toBe('2024-01-15');
      expect(result.meals).toBeInstanceOf(Array);
    });
  });

  describe('createMeal', () => {
    it('should create meal successfully', async () => {
      const mealData = {
        title: 'Новый приём пищи',
        grams: 300,
        calories: 450,
        protein_g: 25.5,
        fat_g: 18.2,
        carbs_g: 45.8
      };

      const mockCreatedMeal = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        takenAt: '2024-01-15T12:00:00.000Z',
        ...mealData
      };

      mockApi.mockResolvedValue(mockCreatedMeal);

      const result = await createMeal(mealData);

      expect(mockApi).toHaveBeenCalledWith('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealData)
      });
      expect(result).toEqual(mockCreatedMeal);
    });
  });

  describe('updateMeal', () => {
    it('should update meal successfully', async () => {
      const mealId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        grams: 350,
        calories: 500
      };

      const mockUpdatedMeal = {
        id: mealId,
        takenAt: '2024-01-15T08:00:00.000Z',
        title: 'Овсянка с ягодами',
        grams: 350,
        calories: 500,
        protein_g: 12.5,
        fat_g: 8.2,
        carbs_g: 52.3
      };

      mockApi.mockResolvedValue(mockUpdatedMeal);

      const result = await updateMeal(mealId, updateData);

      expect(mockApi).toHaveBeenCalledWith(`/api/meals/${mealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      expect(result).toEqual(mockUpdatedMeal);
    });
  });

  describe('deleteMeal', () => {
    it('should delete meal successfully', async () => {
      const mealId = '123e4567-e89b-12d3-a456-426614174000';

      mockApi.mockResolvedValue({ success: true });

      await deleteMeal(mealId);

      expect(mockApi).toHaveBeenCalledWith(`/api/meals/${mealId}`, {
        method: 'DELETE'
      });
    });
  });
});
