import { z } from 'zod';

export const NextProto = z.object({
  at: z.string().datetime(),
  title: z.string(),
  action: z.enum(['meal','supplement','reminder']),
  minutes_left: z.number().int().nonnegative()
});

export type NextProto = z.infer<typeof NextProto>;
