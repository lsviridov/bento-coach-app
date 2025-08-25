import { z } from 'zod';

export const RecoProduct = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  price_byn: z.number(),
  reason: z.string(),              // «Антиоксидант, цель: восстановление»
  image_url: z.string().url().optional()
});

export const Recos = z.object({ 
  items: z.array(RecoProduct)
});

export type RecoProduct = z.infer<typeof RecoProduct>;
export type Recos = z.infer<typeof Recos>;
