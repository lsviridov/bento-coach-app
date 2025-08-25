import { useState, useEffect } from 'react';
import type { UserProfile } from '@/entities/user';

const mockProfile: UserProfile = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user@example.com',
  full_name: 'Иван Иванов',
  birthdate: '1990-05-15',
  height_cm: 175,
  weight_kg: 70.5,
  allergies: ['Лактоза', 'Глютен'],
  goals: ['Энергия и бодрость', 'Поддержание формы'],
  theme: 'auto',
  push_enabled: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export function useMockProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setProfile(mockProfile);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateProfile = async (patch: Partial<UserProfile>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedProfile = {
      ...profile!,
      ...patch,
      updated_at: new Date().toISOString(),
    };
    
    setProfile(updatedProfile);
    return updatedProfile;
  };

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProfile(mockProfile);
    setIsLoading(false);
  };

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdating: false,
  };
}
