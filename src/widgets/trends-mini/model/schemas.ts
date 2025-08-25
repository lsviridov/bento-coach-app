import { z } from 'zod';

export const Trends = z.object({
  protein: z.array(z.number()).length(7),  // 0..1 от цели
  water: z.array(z.number()).length(7),
  delta: z.object({ 
    protein_pct: z.number(), 
    water_pct: z.number() 
  })
});

export type Trends = z.infer<typeof Trends>;
