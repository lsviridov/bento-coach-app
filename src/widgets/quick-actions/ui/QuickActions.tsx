

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Camera, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isWaterLoading, setIsWaterLoading] = useState(false);

  const handleAddWater = async () => {
    setIsWaterLoading(true);
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Вода добавлена',
        description: '+250 мл к дневной норме',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить воду',
        variant: 'destructive'
      });
    } finally {
      setIsWaterLoading(false);
    }
  };

  const handlePhotoAnalysis = () => {
    navigate('/camera');
  };

  const handleManualAdd = () => {
    // TODO: Открыть AddMealModal
    navigate('/diary?add=manual');
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Быстрые действия</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddWater}
          disabled={isWaterLoading}
          className="flex items-center gap-2 min-w-fit px-4 py-2 h-11 rounded-full border-brand/20 hover:bg-brand-50 hover:border-brand/40 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {isWaterLoading ? 'Добавляю...' : '+250 мл'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handlePhotoAnalysis}
          className="flex items-center gap-2 min-w-fit px-4 py-2 h-11 rounded-full border-brand/20 hover:bg-brand-50 hover:border-brand/40 transition-colors"
        >
          <Camera className="w-4 h-4" />
          По фото
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualAdd}
          className="flex items-center gap-2 min-w-fit px-4 py-2 h-11 rounded-full border-brand-50 hover:bg-brand-50/80 transition-colors"
        >
          <PlusSquare className="w-4 h-4" />
          Добавить вручную
        </Button>
      </div>
    </section>
  );
}
