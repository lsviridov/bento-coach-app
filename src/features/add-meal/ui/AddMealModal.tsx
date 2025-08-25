import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MealT } from '@entities/meal';

const mealFormSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  grams: z.number().min(1, 'Граммы должны быть больше 0'),
  calories: z.number().min(0, 'Калории не могут быть отрицательными'),
  protein_g: z.number().min(0, 'Белки не могут быть отрицательными'),
  fat_g: z.number().min(0, 'Жиры не могут быть отрицательными'),
  carbs_g: z.number().min(0, 'Углеводы не могут быть отрицательными'),
  photoUrl: z.string().url().optional().or(z.literal(''))
});

type MealFormData = z.infer<typeof mealFormSchema>;

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MealFormData) => Promise<void>;
  meal?: MealT; // For editing
  isLoading?: boolean;
}

export function AddMealModal({ isOpen, onClose, onSubmit, meal, isLoading = false }: AddMealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<MealFormData>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      title: '',
      grams: 100,
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      photoUrl: ''
    }
  });

  const grams = watch('grams');

  // Update calories when macros change
  const updateCalories = () => {
    const protein = watch('protein_g');
    const fat = watch('fat_g');
    const carbs = watch('carbs_g');
    const calculated = protein * 4 + fat * 9 + carbs * 4;
    setValue('calories', Math.round(calculated));
  };

  // Set form values when editing
  useEffect(() => {
    if (meal) {
      setValue('title', meal.title);
      setValue('grams', meal.grams);
      setValue('calories', meal.calories);
      setValue('protein_g', meal.protein_g);
      setValue('fat_g', meal.fat_g);
      setValue('carbs_g', meal.carbs_g);
      setValue('photoUrl', meal.photoUrl || '');
    } else {
      reset();
    }
  }, [meal, setValue, reset]);

  const handleFormSubmit = async (data: MealFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {meal ? 'Редактировать приём пищи' : 'Добавить приём пищи'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Например: Овсянка с ягодами"
              className={errors.title ? 'border-danger' : ''}
            />
            {errors.title && (
              <p className="text-sm text-danger">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grams">Граммы: {grams}г</Label>
            <Slider
              value={[grams]}
              onValueChange={([value]) => setValue('grams', value)}
              max={1000}
              min={1}
              step={1}
              className="w-full"
            />
            {errors.grams && (
              <p className="text-sm text-danger">{errors.grams.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="protein_g">Белки (г)</Label>
              <Input
                id="protein_g"
                type="number"
                step="0.1"
                {...register('protein_g', { valueAsNumber: true })}
                onChange={(e) => {
                  register('protein_g', { valueAsNumber: true }).onChange(e);
                  updateCalories();
                }}
                className={errors.protein_g ? 'border-danger' : ''}
              />
              {errors.protein_g && (
                <p className="text-sm text-danger">{errors.protein_g.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fat_g">Жиры (г)</Label>
              <Input
                id="fat_g"
                type="number"
                step="0.1"
                {...register('fat_g', { valueAsNumber: true })}
                onChange={(e) => {
                  register('fat_g', { valueAsNumber: true }).onChange(e);
                  updateCalories();
                }}
                className={errors.fat_g ? 'border-danger' : ''}
              />
              {errors.fat_g && (
                <p className="text-sm text-danger">{errors.fat_g.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carbs_g">Углеводы (г)</Label>
              <Input
                id="carbs_g"
                type="number"
                step="0.1"
                {...register('carbs_g', { valueAsNumber: true })}
                onChange={(e) => {
                  register('carbs_g', { valueAsNumber: true }).onChange(e);
                  updateCalories();
                }}
                className={errors.carbs_g ? 'border-danger' : ''}
              />
              {errors.carbs_g && (
                <p className="text-sm text-danger">{errors.carbs_g.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories">Калории (авто)</Label>
            <Input
              id="calories"
              type="number"
              {...register('calories', { valueAsNumber: true })}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photoUrl">URL фото (необязательно)</Label>
            <Input
              id="photoUrl"
              type="url"
              {...register('photoUrl')}
              placeholder="https://example.com/photo.jpg"
              className={errors.photoUrl ? 'border-danger' : ''}
            />
            {errors.photoUrl && (
              <p className="text-sm text-danger">{errors.photoUrl.message}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isLoading}
              className="bg-brand hover:bg-brand/90"
            >
              {isSubmitting ? 'Сохранение...' : (meal ? 'Сохранить' : 'Добавить')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
