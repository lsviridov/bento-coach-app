import { z } from 'zod';

export const Intent = z.enum(['suggestMeal', 'addMeal', 'logWater', 'explainNutrient', 'suggestBundle']);
export type IntentT = z.infer<typeof Intent>;

export const Message = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  createdAt: z.string().datetime(),
  intents: z.array(Intent).optional()
});
export type MessageT = z.infer<typeof Message>;

export const Session = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastMessage: z.string().optional()
});
export type SessionT = z.infer<typeof Session>;

export const CoachRequest = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1),
  context: z.object({
    page: z.enum(['home', 'diary', 'camera', 'shop', 'protocols', 'profile']).optional(),
    dateISO: z.string().optional(),
    productSlug: z.string().optional(),
  }).optional()
});

export const CoachResponse = z.object({
  sessionId: z.string().uuid(),
  reply: z.string(),
  intents: z.array(Intent).default([]),
});
export type CoachResponseT = z.infer<typeof CoachResponse>;
