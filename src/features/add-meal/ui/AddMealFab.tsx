import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddMealFabProps {
  onClick: () => void;
}

export function AddMealFab({ onClick }: AddMealFabProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-28 right-6 h-14 w-14 rounded-full bg-brand hover:bg-brand-600 active:bg-brand-700 shadow-xl shadow-neon z-50 transition-all duration-200 hover:scale-105"
      aria-label="Добавить приём пищи"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
