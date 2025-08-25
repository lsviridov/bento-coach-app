

import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useWeek } from '../model/useWeek';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function WeekStrip() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useWeek();
  const { isOffline } = useOfflineFlag();

  const handleDayClick = (date: string) => {
    navigate(`/diary?date=${date}`);
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Неделя</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-full">
              <div className="w-full h-16 bg-muted/30 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Неделя</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Не удалось загрузить данные недели</p>
        </div>
      </section>
    );
  }

  if (isOffline) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Неделя</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Данные недоступны офлайн</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Неделя</h2>
      <div className="grid grid-cols-7 gap-2">
        {data.days.map((day, index) => {
          const date = parseISO(day.date);
          const isCurrentDay = isToday(date);
          
          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day.date)}
              className={`w-full flex flex-col items-center gap-2 p-2 rounded-lg border transition-all hover:bg-surface/50 ${
                isCurrentDay 
                  ? 'border-brand bg-brand-50/30' 
                  : 'border-muted/20 hover:border-muted/40'
              }`}
            >
              <span className={`text-xs font-medium ${
                isCurrentDay ? 'text-brand' : 'text-muted'
              }`}>
                {WEEKDAYS[index]}
              </span>
              
              <span className={`text-sm font-semibold ${
                isCurrentDay ? 'text-brand' : 'text-ink'
              }`}>
                {format(date, 'd', { locale: ru })}
              </span>
              
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  day.protein_ok ? 'bg-success' : 'bg-muted/30'
                }`} />
                <div className={`w-2 h-2 rounded-full ${
                  day.water_ok ? 'bg-success' : 'bg-muted/30'
                }`} />
                <div className={`w-2 h-2 rounded-full ${
                  day.protocols_ok ? 'bg-success' : 'bg-muted/30'
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
