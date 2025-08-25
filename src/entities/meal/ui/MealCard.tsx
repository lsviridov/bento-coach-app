import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Clock } from 'lucide-react';
import { MealT } from '../model/schemas';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { SectionCard } from '@/shared/ui';

interface MealCardProps {
  meal: MealT;
  onEdit: (meal: MealT) => void;
  onDelete: (id: string) => void;
}

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(meal.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SectionCard variant="elevated" size="lg" data-testid="meal-card">
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          {meal.photoUrl && (
            <div className="flex-shrink-0">
              <img 
                src={meal.photoUrl} 
                alt={meal.title}
                className="w-16 h-16 rounded-lg object-cover border border-border/50"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-ink truncate">{meal.title}</h3>
              <div className="flex items-center gap-1 text-muted text-sm">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(meal.takenAt), 'HH:mm', { locale: ru })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="bg-brand-50 text-ink border-brand/20">
                {meal.grams}г
              </Badge>
              <Badge variant="secondary" className="bg-accent/15 text-ink border-accent/20">
                {meal.calories} ккал
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 text-sm text-muted">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full"></span>
                <span className="font-semibold">Б</span>: {meal.protein_g.toFixed(1)}г
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-warning rounded-full"></span>
                <span className="font-semibold">Ж</span>: {meal.fat_g.toFixed(1)}г
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full"></span>
                <span className="font-semibold">У</span>: {meal.carbs_g.toFixed(1)}г
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(meal)}
              className="h-8 w-8 p-0 hover:bg-brand-50 hover:text-brand"
            >
              <Edit className="w-4 h-4" />
              <span className="sr-only">Редактировать</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-danger/10 text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Удалить</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить приём пищи?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Приём пищи будет удалён навсегда.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-danger hover:bg-danger/90"
                  >
                    {isDeleting ? 'Удаление...' : 'Удалить'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </SectionCard>
  );
}
