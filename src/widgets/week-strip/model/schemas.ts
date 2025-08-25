import { z } from 'zod';

export const DayDot = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  protein_ok: z.boolean(),
  water_ok: z.boolean(),
  protocols_ok: z.boolean()
});

export const Week = z.object({ 
  days: z.array(DayDot).length(7) 
});

export type DayDot = z.infer<typeof DayDot>;
export type Week = z.infer<typeof Week>;
