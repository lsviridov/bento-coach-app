import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartItemT, ProductT } from '@/entities/product';
import { api } from '@shared/api/fetcher';

// Получить корзину
export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api('/api/cart/items');
      return {
        items: res.items as CartItemT[],
        total: res.total as number
      };
    },
    staleTime: 30_000
  });
}

// Добавить в корзину
export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ product, qty }: { product: ProductT; qty: number }) => {
      return api('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          qty,
          price_byn: product.price_byn
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

// Обновить количество
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, qty }: { productId: string; qty: number }) => {
      return api(`/api/cart/items/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

// Удалить из корзины
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      return api(`/api/cart/items/${productId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

// Очистить корзину
export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return api('/api/cart/items', {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}
