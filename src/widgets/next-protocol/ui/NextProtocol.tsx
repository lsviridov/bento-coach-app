

import { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNextProtocol } from '../model/useNextProtocol';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';

export function NextProtocol() {
  const { data, isLoading, error, refetch } = useNextProtocol();
  const { toast } = useToast();
  const { isOffline } = useOfflineFlag();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isMarking, setIsMarking] = useState(false);
  const [isSnoozing, setIsSnoozing] = useState(false);

  useEffect(() => {
    if (data?.minutes_left) {
      setTimeLeft(data.minutes_left);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Обновляем каждую минуту

      return () => clearInterval(timer);
    }
  }, [data?.minutes_left]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  const handleMark = async () => {
    setIsMarking(true);
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: 'Шаг выполнен',
        description: 'Отлично! Переходим к следующему',
        variant: 'default'
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отметить выполнение',
        variant: 'destructive'
      });
    } finally {
      setIsMarking(false);
    }
  };

  const handleSnooze = async () => {
    setIsSnoozing(true);
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 600));
      
      toast({
        title: 'Напоминание отложено',
        description: 'Напомним через 30 минут',
        variant: 'default'
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отложить напоминание',
        variant: 'destructive'
      });
    } finally {
      setIsSnoozing(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Следующий шаг</h2>
        <div className="bg-surface rounded-xl p-4 border border-muted/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted/30 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-muted/30 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-muted/30 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-muted/30 rounded animate-pulse" />
              <div className="flex-1 h-9 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Следующий шаг</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Не удалось загрузить данные протокола</p>
        </div>
      </section>
    );
  }

  if (isOffline) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Следующий шаг</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Данные недоступны офлайн</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Следующий шаг</h2>
      <div className="bg-surface rounded-xl p-4 border border-muted/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-brand" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-ink mb-1">{data.title}</h3>
            <p className="text-sm text-muted">
              {data.action === 'meal' && 'Приём пищи'}
              {data.action === 'supplement' && 'Добавка'}
              {data.action === 'reminder' && 'Напоминание'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-brand">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-muted">
            {timeLeft > 0 ? 'осталось' : 'время вышло'}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleMark}
            disabled={isMarking}
            className="flex-1 bg-success hover:bg-success/90 text-white"
          >
            {isMarking ? 'Отмечаю...' : 'Отметить'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSnooze}
            disabled={isSnoozing}
            className="flex-1"
          >
            {isSnoozing ? 'Откладываю...' : 'Напомнить позже'}
          </Button>
        </div>
      </div>
    </section>
  );
}
