import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DaySwitcherProps {
  dateISO: string;
  onPrev: () => void;
  onNext: () => void;
  onDateSelect?: (date: string) => void;
}

export function DaySwitcher({ dateISO, onPrev, onNext, onDateSelect }: DaySwitcherProps) {
  const date = new Date(dateISO);
  const today = new Date();
  const isToday = dateISO === today.toISOString().split('T')[0];
  const isYesterday = dateISO === subDays(today, 1).toISOString().split('T')[0];
  const isTomorrow = dateISO === addDays(today, 1).toISOString().split('T')[0];

  const formatDate = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE', { locale: ru });
    const day = format(date, 'd', { locale: ru });
    const month = format(date, 'MMM', { locale: ru });
    
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${day} ${month}`;
  };

  const getDateLabel = () => {
    if (isToday) return 'Сегодня';
    if (isYesterday) return 'Вчера';
    if (isTomorrow) return 'Завтра';
    return formatDate(date);
  };

  return (
    <div className="flex items-center justify-between bg-surface rounded-xl p-4 border border-[color-mix(in_oklab,var(--muted)_20%,transparent)]">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrev}
        className="h-10 w-10 p-0 hover:bg-brand-50"
        aria-label="Предыдущий день"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-muted" />
        <span className="font-medium text-ink">{getDateLabel()}</span>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        className="h-10 w-10 p-0 hover:bg-brand-50"
        aria-label="Следующий день"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
