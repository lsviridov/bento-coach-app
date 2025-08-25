import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from '@/shared/ui/section-card';
import { useProfile } from '../model/useProfile';
import { ProfileFormData, ProfileFormDataT, GOAL_OPTIONS, ALLERGY_OPTIONS } from '../model/schemas';
import type { ProfileT } from '../model/schemas';

interface ProfileFormProps {
  profile: ProfileT;
  onUpdate: (data: ProfileFormDataT) => void;
  isUpdating: boolean;
}

export function ProfileForm({ profile, onUpdate, isUpdating }: ProfileFormProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile.goals || []);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(profile.allergies || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<ProfileFormDataT>({
    resolver: zodResolver(ProfileFormData),
    defaultValues: {
      full_name: profile.full_name || '',
      birthdate: profile.birthdate || '',
      height_cm: profile.height_cm?.toString() || '',
      weight_kg: profile.weight_kg?.toString() || '',
      allergies: profile.allergies || [],
      goals: profile.goals || [],
    },
  });

  // Reset form when profile changes
  useEffect(() => {
    reset({
      full_name: profile.full_name || '',
      birthdate: profile.birthdate || '',
      height_cm: profile.height_cm?.toString() || '',
      weight_kg: profile.weight_kg?.toString() || '',
      allergies: profile.allergies || [],
      goals: profile.goals || [],
    });
    setSelectedGoals(profile.goals || []);
    setSelectedAllergies(profile.allergies || []);
  }, [profile, reset]);

  const toggleGoal = (goal: string) => {
    const newGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(newGoals);
    setValue('goals', newGoals, { shouldDirty: true });
  };

  const toggleAllergy = (allergy: string) => {
    const newAllergies = selectedAllergies.includes(allergy)
      ? selectedAllergies.filter(a => a !== allergy)
      : [...selectedAllergies, allergy];
    setSelectedAllergies(newAllergies);
    setValue('allergies', newAllergies, { shouldDirty: true });
  };

  const onSubmit = (data: ProfileFormDataT) => {
    const formData = {
      ...data,
      goals: selectedGoals,
      allergies: selectedAllergies,
    };
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {/* Personal Data Section */}
      <SectionCard variant="elevated" size="lg">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
            Личные данные
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm">Имя</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                placeholder="Введите ваше имя"
                className={`text-sm text-left ${errors.full_name ? 'border-destructive' : ''}`}
              />
              {errors.full_name && (
                <p className="text-xs sm:text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm">Дата рождения</Label>
              <Input
                id="birthdate"
                type="date"
                {...register('birthdate')}
                className={`text-sm text-left ${errors.birthdate ? 'border-destructive' : ''}`}
              />
              {errors.birthdate && (
                <p className="text-xs sm:text-sm text-destructive">{errors.birthdate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height_cm" className="text-sm">Рост (см)</Label>
              <Input
                id="height_cm"
                type="number"
                min="50"
                max="250"
                {...register('height_cm')}
                placeholder="170"
                className={`text-sm text-left ${errors.height_cm ? 'border-destructive' : ''}`}
              />
              {errors.height_cm && (
                <p className="text-xs sm:text-sm text-destructive">{errors.height_cm.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_kg" className="text-sm">Вес (кг)</Label>
              <Input
                id="weight_kg"
                type="number"
                min="20"
                max="400"
                step="0.1"
                {...register('weight_kg')}
                placeholder="70.5"
                className={`text-sm text-left ${errors.weight_kg ? 'border-destructive' : ''}`}
              />
              {errors.weight_kg && (
                <p className="text-xs sm:text-sm text-destructive">{errors.weight_kg.message}</p>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Goals Section */}
      <SectionCard variant="elevated" size="lg">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
            Цели
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Выберите ваши основные цели для персонализации рекомендаций
          </p>
          
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((goal) => (
              <Badge
                key={goal}
                variant={selectedGoals.includes(goal) ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors text-xs sm:text-sm ${
                  selectedGoals.includes(goal)
                    ? 'bg-brand text-white hover:bg-brand/90'
                    : 'hover:bg-brand/10 hover:border-brand/30'
                }`}
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Allergies Section */}
      <SectionCard variant="elevated" size="lg">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
            Аллергии и ограничения
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Отметьте продукты, которые вам противопоказаны
          </p>
          
          <div className="flex flex-wrap gap-2">
            {ALLERGY_OPTIONS.map((allergy) => (
              <Badge
                key={allergy}
                variant={selectedAllergies.includes(allergy) ? 'destructive' : 'outline'}
                className={`cursor-pointer transition-colors text-xs sm:text-sm ${
                  selectedAllergies.includes(allergy)
                    ? 'bg-destructive text-white hover:bg-destructive/90'
                    : 'hover:bg-destructive/10 hover:border-destructive/30'
                }`}
                onClick={() => toggleAllergy(allergy)}
              >
                {allergy}
              </Badge>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={!isDirty || isUpdating}
          className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  );
}
