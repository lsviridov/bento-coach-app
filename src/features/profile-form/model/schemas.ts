import { z } from 'zod';

export const Profile = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  full_name: z.string().min(1, 'Имя обязательно').max(80, 'Имя не может быть длиннее 80 символов').optional().nullable(),
  birthdate: z.string().date('Неверный формат даты').optional().nullable(), // 'YYYY-MM-DD'
  height_cm: z.number().int('Рост должен быть целым числом').min(50, 'Рост должен быть не менее 50 см').max(250, 'Рост не может превышать 250 см').optional().nullable(),
  weight_kg: z.number().min(20, 'Вес должен быть не менее 20 кг').max(400, 'Вес не может превышать 400 кг').optional().nullable(),
  allergies: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  push_enabled: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProfileT = z.infer<typeof Profile>;

export const ProfilePatch = Profile.partial().omit({ 
  id: true, 
  user_id: true, 
  created_at: true, 
  updated_at: true 
});

export type ProfilePatchT = z.infer<typeof ProfilePatch>;

export const ProfileFormData = z.object({
  full_name: z.string().min(1, 'Имя обязательно').max(80, 'Имя не может быть длиннее 80 символов').optional().or(z.literal('')),
  birthdate: z.string().optional().or(z.literal('')),
  height_cm: z.string().optional().or(z.literal('')).transform((val) => val ? parseInt(val, 10) : null),
  weight_kg: z.string().optional().or(z.literal('')).transform((val) => val ? parseFloat(val) : null),
  allergies: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
});

export type ProfileFormDataT = z.infer<typeof ProfileFormData>;

// Predefined options for goals and allergies
export const GOAL_OPTIONS = [
  'Энергия и бодрость',
  'Восстановление мышц',
  'Похудение',
  'Набор массы',
  'Поддержание формы',
  'Улучшение сна',
  'Детоксикация',
  'Иммунитет'
] as const;

export const ALLERGY_OPTIONS = [
  'Глютен',
  'Лактоза',
  'Орехи',
  'Морепродукты',
  'Яйца',
  'Соя',
  'Рыба',
  'Мед'
] as const;
