import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, MessageCircle, X, UtensilsCrossed } from 'lucide-react';
import { CoachBottomSheet } from './CoachBottomSheet';

interface ActionFabProps {
  onAddMeal: () => void;
}

export function ActionFab({ onAddMeal }: ActionFabProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddMeal = () => {
    setIsExpanded(false);
    onAddMeal();
  };

  const handleOpenCoach = () => {
    setIsExpanded(false);
    setIsCoachOpen(true);
  };

  return (
    <>
      {/* Main FAB */}
      <Button
        onClick={handleToggle}
        className="fixed bottom-28 right-6 h-14 w-14 rounded-full bg-brand hover:bg-brand-600 active:bg-brand-700 shadow-xl shadow-neon z-50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2"
        aria-label="Действия"
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Layers className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="fixed bottom-28 right-6 z-[60]">
          {/* Add Meal Button - справа от главной кнопки */}
          <div className="absolute bottom-0 right-20 flex items-center gap-3 group">
            <span className="text-sm font-medium text-ink bg-surface px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 ease-out translate-x-0 opacity-100">
              Добавить
            </span>
            <Button
              onClick={handleAddMeal}
              className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-white shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 transform transition-all duration-300 ease-out translate-x-0 opacity-100"
              aria-label="Добавить приём пищи"
            >
              <UtensilsCrossed className="w-5 h-5" />
            </Button>
          </div>

          {/* Coach Button - выше главной кнопки */}
          <div className="absolute bottom-20 right-0 flex items-center gap-3 group">
            <span className="text-sm font-medium text-ink bg-surface px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 ease-out translate-x-0 opacity-100">
              Чат
            </span>
            <Button
              onClick={handleOpenCoach}
              className="h-12 w-12 rounded-full bg-brand/80 hover:bg-brand text-white shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 transform transition-all duration-300 ease-out translate-x-0 opacity-100"
              aria-label="Открыть чат с коучем"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Coach Bottom Sheet */}
      <CoachBottomSheet 
        open={isCoachOpen} 
        onClose={() => setIsCoachOpen(false)} 
      />
    </>
  );
}
