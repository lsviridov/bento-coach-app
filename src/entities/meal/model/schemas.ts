import { z } from 'zod';

export const Meal = z.object({
  id: z.string().uuid(),
  takenAt: z.string().datetime(), // ISO
  title: z.string().min(1),
  grams: z.number().int().positive(),
  calories: z.number().int().nonnegative(),
  protein_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  photoUrl: z.string().url().optional()
});
export type MealT = z.infer<typeof Meal>;

export const CreateMeal = z.object({
  title: z.string().min(1),
  grams: z.number().int().positive(),
  calories: z.number().int().nonnegative(),
  protein_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  takenAt: z.string().datetime().optional(),
  photoUrl: z.string().url().optional()
});
export type CreateMealT = z.infer<typeof CreateMeal>;

export const DaySummary = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totals: z.object({
    water_ml: z.number().int().nonnegative(),
    calories: z.number().int().nonnegative(),
    protein_g: z.number().nonnegative(),
    fat_g: z.number().nonnegative(),
    carbs_g: z.number().nonnegative()
  }),
  meals: z.array(Meal)
});
export type DaySummaryT = z.infer<typeof DaySummary>;
