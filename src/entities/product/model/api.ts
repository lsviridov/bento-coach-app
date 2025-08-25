import { api } from '@shared/api/fetcher';
import { Product, ProductListQuery, ProductListResponse } from './schemas';

export async function listProducts(qs: Record<string, unknown>) {
  const query = ProductListQuery.parse(qs);
  const url = `/api/products?` + new URLSearchParams(query as any);
  const res = await api(url);
  return ProductListResponse.parse(res);
}

export async function getProduct(slug: string) {
  const res = await api(`/api/products/${slug}`);
  return Product.parse(res);
}
