import { z } from 'zod';

export const Product = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  category: z.enum(['peptides', 'supplements']),
  price_byn: z.number().nonnegative(),
  image_url: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  description: z.string().optional()
});
export type ProductT = z.infer<typeof Product>;

export const ProductListQuery = z.object({
  q: z.string().optional(),            // поиск
  category: z.array(z.enum(['peptides', 'supplements'])).optional(),
  goals: z.array(z.string()).optional(),// цели: иммунитет/кости/антипаразит/антиокс
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  cursor: z.string().optional(),       // пагинация
  limit: z.number().int().min(1).max(50).default(20),
  sort: z.enum(['popular', 'priceAsc', 'priceDesc']).default('popular')
});
export type ProductListQueryT = z.infer<typeof ProductListQuery>;

export const CartItem = z.object({
  product_id: z.string().uuid(),
  qty: z.number().int().min(1).max(20),
  price_byn: z.number().nonnegative()
});
export type CartItemT = z.infer<typeof CartItem>;

export const ProductListResponse = z.object({
  items: z.array(Product),
  nextCursor: z.string().optional()
});
export type ProductListResponseT = z.infer<typeof ProductListResponse>;
