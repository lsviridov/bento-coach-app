import { z } from 'zod';

export const CoachTip = z.object({
  text: z.string(),
  cta: z.object({ 
    label: z.string(), 
    intent: z.enum(['suggestMeal','logWater','openDiary','openShop']) 
  }).optional()
});

export type CoachTip = z.infer<typeof CoachTip>;
