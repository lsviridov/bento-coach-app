import { useEffect, useState } from 'react';
import { CreateMealT } from '@/entities/meal';

interface MealEditorProps {
  data: CreateMealT;
  onChange: (data: CreateMealT) => void;
  isOffline: boolean;
}

export function MealEditor({ data, onChange, isOffline }: MealEditorProps) {
  const [localData, setLocalData] = useState<CreateMealT>(data);
  const [baseValues, setBaseValues] = useState({
    calories: data.calories,
    protein_g: data.protein_g,
    fat_g: data.fat_g,
    carbs_g: data.carbs_g,
    grams: data.grams
  });

  // Обновляем базовые значения при изменении исходных данных
  useEffect(() => {
    setBaseValues({
      calories: data.calories,
      protein_g: data.protein_g,
      fat_g: data.fat_g,
      carbs_g: data.carbs_g,
      grams: data.grams
    });
    setLocalData(data);
  }, [data]);

  // Пересчитываем нутриенты при изменении граммов
  const handleGramsChange = (newGrams: number) => {
    if (baseValues.grams === 0) return;

    const ratio = newGrams / baseValues.grams;
    const updatedData = {
      ...localData,
      grams: newGrams,
      calories: Math.round(baseValues.calories * ratio),
      protein_g: Math.round(baseValues.protein_g * ratio * 10) / 10,
      fat_g: Math.round(baseValues.fat_g * ratio * 10) / 10,
      carbs_g: Math.round(baseValues.carbs_g * ratio * 10) / 10
    };

    setLocalData(updatedData);
    onChange(updatedData);
  };

  const handleFieldChange = (field: keyof CreateMealT, value: string | number) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onChange(updatedData);
  };

  return (
    <div className="bg-surface rounded-xl p-4 border shadow-neon dark:shadow-neon-dark space-y-4">
      <h3 className="text-lg font-semibold text-ink">Редактировать приём пищи</h3>

      {/* Офлайн индикатор */}
      {isOffline && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-warning">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">Офлайн режим</span>
          </div>
          <p className="text-warning/80 text-xs mt-1">
            Данные будут сохранены при подключении к сети
          </p>
        </div>
      )}

      {/* Название */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink mb-2">
          Название
        </label>
        <input
          id="title"
          type="text"
          value={localData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full px-3 py-2 bg-bg border border-muted/30 rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          placeholder="Введите название блюда"
        />
      </div>

      {/* Слайдер граммов */}
      <div>
        <label htmlFor="grams" className="block text-sm font-medium text-ink mb-2">
          Граммы: {localData.grams}г
        </label>
        <input
          id="grams"
          type="range"
          min="50"
          max="1000"
          step="10"
          value={localData.grams}
          onChange={(e) => handleGramsChange(Number(e.target.value))}
          className="w-full h-2 bg-brand-50 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>50г</span>
          <span>1000г</span>
        </div>
      </div>

      {/* Нутриенты */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-ink mb-2">
            Калории
          </label>
          <input
            id="calories"
            type="number"
            min="0"
            value={localData.calories}
            onChange={(e) => handleFieldChange('calories', Number(e.target.value))}
            className="w-full px-3 py-2 bg-bg border border-muted/30 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-ink mb-2">
            Белки (г)
          </label>
          <input
            id="protein"
            type="number"
            min="0"
            step="0.1"
            value={localData.protein_g}
            onChange={(e) => handleFieldChange('protein_g', Number(e.target.value))}
            className="w-full px-3 py-2 bg-bg border border-muted/30 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-ink mb-2">
            Жиры (г)
          </label>
          <input
            id="fat"
            type="number"
            min="0"
            step="0.1"
            value={localData.fat_g}
            onChange={(e) => handleFieldChange('fat_g', Number(e.target.value))}
            className="w-full px-3 py-2 bg-bg border border-muted/30 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-ink mb-2">
            Углеводы (г)
          </label>
          <input
            id="carbs"
            type="number"
            min="0"
            step="0.1"
            value={localData.carbs_g}
            onChange={(e) => handleFieldChange('carbs_g', Number(e.target.value))}
            className="w-full px-3 py-2 bg-bg border border-muted/30 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
