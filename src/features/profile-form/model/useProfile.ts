import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/entities/user';
import type { ProfileUpdateData } from '@/entities/user';
import type { ProfileFormDataT } from './schemas';

export function useProfile() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 60_000, // 1 minute
    retry: 2,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
      toast.success('Профиль успешно обновлен');
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      toast.error('Не удалось обновить профиль');
    },
  });

  const handleUpdateProfile = async (formData: ProfileFormDataT) => {
    if (!profile) return;

    const updateData: ProfileUpdateData = {
      full_name: formData.full_name || null,
      birthdate: formData.birthdate || null,
      height_cm: formData.height_cm,
      weight_kg: formData.weight_kg,
      allergies: formData.allergies,
      goals: formData.goals,
    };

    updateProfileMutation.mutate(updateData);
  };

  const isUpdating = updateProfileMutation.isPending;

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: handleUpdateProfile,
    isUpdating,
  };
}
