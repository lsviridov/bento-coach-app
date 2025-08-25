import { z } from 'zod';

export const WeekSeries = z.object({
  values: z.array(z.number().min(0)).length(7), // нормализовано 0..1 (доля от цели)
  goal: z.number().positive().default(1),
  deltaPct: z.number(), // +14, -8 и т.п.
  label: z.string()     // "Белок" | "Вода"
});
export type WeekSeriesT = z.infer<typeof WeekSeries>;

export const TrendsWeek = z.object({
  protein: WeekSeries,
  water: WeekSeries,
  startISO: z.string(), // понедельник недели
});
export type TrendsWeekT = z.infer<typeof TrendsWeek>;
