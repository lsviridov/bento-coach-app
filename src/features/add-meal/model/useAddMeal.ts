import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeal, updateMeal, deleteMeal } from '@entities/meal';
import { MealT } from '@entities/meal';
import { toast } from 'sonner';

export function useAddMeal() {
  const queryClient = useQueryClient();

  const createMealMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: (newMeal) => {
      const date = newMeal.takenAt.split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['day', date] });
      toast.success('Приём пищи добавлен');
    },
    onError: (error) => {
      toast.error('Ошибка при добавлении приёма пищи');
      console.error('Create meal error:', error);
    }
  });

  const updateMealMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MealT> }) => 
      updateMeal({ id, patch }),
    onSuccess: (updatedMeal) => {
      const date = updatedMeal.takenAt.split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['day', date] });
      toast.success('Приём пищи обновлён');
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении приёма пищи');
      console.error('Update meal error:', error);
    }
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: (_, deletedId) => {
      // Invalidate all day queries since we don't know which date
      queryClient.invalidateQueries({ queryKey: ['day'] });
      toast.success('Приём пищи удалён');
    },
    onError: (error) => {
      toast.error('Ошибка при удалении приёма пищи');
      console.error('Delete meal error:', error);
    }
  });

  return {
    createMeal: createMealMutation.mutateAsync,
    updateMeal: updateMealMutation.mutateAsync,
    deleteMeal: deleteMealMutation.mutateAsync,
    isCreating: createMealMutation.isPending,
    isUpdating: updateMealMutation.isPending,
    isDeleting: deleteMealMutation.isPending
  };
}
