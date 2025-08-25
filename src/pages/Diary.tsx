import { useState, useEffect } from 'react';
import { addDays, subDays, format } from 'date-fns';
import { useSearchParams, Link } from 'react-router-dom';
import { AppHeader } from '@/widgets/header';
import { DaySwitcher } from '@/widgets/day-switcher';
import { DayTotals } from '@/widgets/day-totals';
import { AddMealModal, useAddMeal } from '@/features/add-meal';
import { useToday, useOfflineFlag, useMockDiary, PageLayout } from '@/shared';
import { MealCard } from '@/entities/meal';
import { MealT } from '@/entities/meal';
import type { z } from 'zod';
import { Meal } from '@/entities/meal';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, WifiOff } from 'lucide-react';
import { ActionFab } from '@/widgets/coach-entry';

export default function Diary() {
  // Type for meal data (create/update)
  type MealData = Omit<z.infer<typeof Meal>, 'id' | 'takenAt'> & { takenAt?: string };
  
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useToday();
  const { isOffline } = useOfflineFlag();
  
  // Get date from URL or default to today
  const dateParam = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState(dateParam || today);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealT | undefined>();
  
  // Meal mutations
  const { createMeal, updateMeal, deleteMeal, isCreating, isUpdating } = useAddMeal();
  
  // Use mock data for development
  const { data: dayData, isLoading, error } = useMockDiary();
  
  // Update URL when date changes
  useEffect(() => {
    if (selectedDate !== dateParam) {
      setSearchParams({ date: selectedDate });
    }
  }, [selectedDate, dateParam, setSearchParams]);
  
  // Update selected date when URL changes
  useEffect(() => {
    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam);
    }
  }, [dateParam, selectedDate]);
  
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };
  
  const handlePrevDay = () => {
    const prevDate = subDays(new Date(selectedDate), 1);
    handleDateChange(format(prevDate, 'yyyy-MM-dd'));
  };
  
  const handleNextDay = () => {
    const nextDate = addDays(new Date(selectedDate), 1);
    handleDateChange(format(nextDate, 'yyyy-MM-dd'));
  };
  
  const handleAddMeal = () => {
    setEditingMeal(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditMeal = (meal: MealT) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };
  
  const handleDeleteMeal = async (id: string) => {
    try {
      await deleteMeal(id);
    } catch (error) {
      console.error('Failed to delete meal:', error);
    }
  };
  
  const handleSubmitMeal = async (data: MealData) => {
    try {
      if (editingMeal) {
        await updateMeal({ id: editingMeal.id, patch: data });
      } else {
        await createMeal({
          ...data,
          takenAt: new Date(selectedDate).toISOString()
        });
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save meal:', error);
      throw error; // Re-throw to let modal handle it
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMeal(undefined);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <AppHeader title="Дневник" variant="diary" />
        <div className="container mx-auto px-4 py-6 space-y-6">
          <DaySwitcher
            dateISO={selectedDate}
            onPrev={handlePrevDay}
            onNext={handleNextDay}
          />
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <PageLayout>
        <AppHeader title="Дневник" variant="diary" />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-danger mx-auto" />
            <h2 className="text-xl font-semibold text-ink">Ошибка загрузки</h2>
            <p className="text-muted">Не удалось загрузить данные за этот день</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Попробовать снова
              </Button>
              <Link to="/offline">
                <Button variant="ghost">Офлайн режим</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Empty state
  if (!dayData?.meals || dayData.meals.length === 0) {
    return (
      <PageLayout>
        <AppHeader title="Дневник" variant="diary" />
        <div className="container mx-auto px-4 py-6 space-y-6">
          <DaySwitcher
            dateISO={selectedDate}
            onPrev={handlePrevDay}
            onNext={handleNextDay}
          />
          
          <DayTotals totals={{
            water_ml: dayData?.totals?.water_ml ?? 0,
            calories: dayData?.totals?.calories ?? 0,
            protein_g: dayData?.totals?.protein_g ?? 0,
            fat_g: dayData?.totals?.fat_g ?? 0,
            carbs_g: dayData?.totals?.carbs_g ?? 0
          }} />
          
          <div className="text-center py-12 space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-12 h-12 text-muted" />
            </div>
            <h3 className="text-lg font-medium text-ink">Нет приёмов пищи</h3>
            <p className="text-muted">Добавьте первый приём пищи за этот день</p>
            <Button onClick={handleAddMeal} className="bg-brand hover:bg-brand/90">
              Добавить приём
            </Button>
          </div>
        </div>
        
        <AddMealModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmitMeal}
          meal={editingMeal}
          isLoading={isCreating || isUpdating}
        />
        
        <ActionFab onAddMeal={handleAddMeal} />
      </PageLayout>
    );
  }
  
  // Main content
  return (
    <PageLayout>
      <AppHeader title="Дневник" variant="diary" />
      
      {/* Offline badge */}
      {isOffline && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-warning">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Офлайн. Показаны кэшированные данные</span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DaySwitcher
          dateISO={selectedDate}
          onPrev={handlePrevDay}
          onNext={handleNextDay}
        />
        
        <DayTotals totals={{
          water_ml: dayData.totals.water_ml,
          calories: dayData.totals.calories,
          protein_g: dayData.totals.protein_g,
          fat_g: dayData.totals.fat_g,
          carbs_g: dayData.totals.carbs_g
        }} />
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-ink">Приёмы пищи</h3>
          {dayData.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onEdit={handleEditMeal}
              onDelete={handleDeleteMeal}
            />
          ))}
        </div>
      </div>
      
      <AddMealModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitMeal}
        meal={editingMeal}
        isLoading={isCreating || isUpdating}
      />
      
      <ActionFab onAddMeal={handleAddMeal} />
    </PageLayout>
  );
}
