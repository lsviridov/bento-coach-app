

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTrends } from '../model/useTrends';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';

export function TrendsMini() {
  const { data, isLoading, error } = useTrends();
  const { isOffline } = useOfflineFlag();

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${Math.round(value)}%`;
  };

  const renderSparkline = (values: number[], color: string) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end gap-0.5 h-8">
        {values.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`w-1 rounded-full ${color}`}
              style={{ height: `${Math.max(height, 8)}%` }}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Тренды недели</h2>
        <div className="bg-surface rounded-xl p-4 border border-muted/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Белок</span>
              <div className="w-16 h-4 bg-muted/30 rounded animate-pulse" />
            </div>
            <div className="w-full h-8 bg-muted/30 rounded animate-pulse" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Вода</span>
              <div className="w-16 h-4 bg-muted/30 rounded animate-pulse" />
            </div>
            <div className="w-full h-8 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Тренды недели</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Не удалось загрузить тренды</p>
        </div>
      </section>
    );
  }

  if (isOffline) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Тренды недели</h2>
        <div className="text-center text-muted py-8">
          <p className="text-sm">Данные недоступны офлайн</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Тренды недели</h2>
      <div className="bg-surface rounded-xl p-4 border border-muted/20">
        <div className="space-y-4">
          {/* Белок */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Белок</span>
              <span className="text-xs text-muted">
                {formatPercentage(data.delta.protein_pct)} к прошлой неделе
              </span>
            </div>
            {renderSparkline(data.protein, 'bg-brand')}
          </div>
          
          {/* Вода */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Вода</span>
              <span className="text-xs text-muted">
                {formatPercentage(data.delta.water_pct)} к прошлой неделе
              </span>
            </div>
            {renderSparkline(data.water, 'bg-accent')}
          </div>
        </div>
        
        {/* Общий тренд */}
        <div className="mt-4 pt-4 border-t border-muted/20">
          <div className="flex items-center gap-2 text-sm">
            {data.delta.protein_pct + data.delta.water_pct >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-warning" />
            )}
            <span className="text-muted">
              {formatPercentage((data.delta.protein_pct + data.delta.water_pct) / 2)} к прошлой неделе
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
