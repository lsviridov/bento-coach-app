import { z } from 'zod';

export const AnalyzeRequest = z.object({
  imageUrl: z.string().url()
});
export type AnalyzeRequestT = z.infer<typeof AnalyzeRequest>;

export const AnalyzeResponse = z.object({
  labels: z.array(z.string()).default([]),          // ['овсянка','ягоды']
  confidence: z.array(z.number().min(0).max(1)).default([]),
  defaultGrams: z.number().int().positive().default(250),
  calories: z.number().int().nonnegative().default(0),
  protein_g: z.number().nonnegative().default(0),
  fat_g: z.number().nonnegative().default(0),
  carbs_g: z.number().nonnegative().default(0)
});
export type AnalyzeResponseT = z.infer<typeof AnalyzeResponse>;
