import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Flame, Zap } from 'lucide-react';
import { SectionCard } from '@/shared/ui';

interface DayTotalsProps {
  totals: {
    water_ml: number;
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
  };
}

export function DayTotals({ totals }: DayTotalsProps) {
  return (
    <div className="space-y-4">
      {/* Main totals grid */}
      <div className="grid grid-cols-2 gap-3">
        <SectionCard variant="gradient" glow size="lg">
          <CardContent className="p-0 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted font-medium">Калории</span>
            </div>
            <div className="text-2xl font-bold text-ink mb-1">{totals.calories}</div>
            <div className="text-xs text-muted">ккал</div>
          </CardContent>
        </SectionCard>
        
        <SectionCard variant="gradient" glow size="lg">
          <CardContent className="p-0 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-brand" />
              <span className="text-sm text-muted font-medium">Вода</span>
            </div>
            <div className="text-2xl font-bold text-ink mb-1">{totals.water_ml}</div>
            <div className="text-xs text-muted">мл</div>
          </CardContent>
        </SectionCard>
      </div>
      
      {/* Macros row */}
      <div className="grid grid-cols-3 gap-3">
        <SectionCard variant="elevated" size="sm">
          <CardContent className="p-0 text-center">
            <div className="text-sm text-muted mb-1 font-medium">Белки</div>
            <div className="text-lg font-semibold text-ink">{totals.protein_g.toFixed(1)}г</div>
          </CardContent>
        </SectionCard>
        
        <SectionCard variant="elevated" size="sm">
          <CardContent className="p-0 text-center">
            <div className="text-sm text-muted mb-1 font-medium">Жиры</div>
            <div className="text-lg font-semibold text-ink">{totals.fat_g.toFixed(1)}г</div>
          </CardContent>
        </SectionCard>
        
        <SectionCard variant="elevated" size="sm">
          <CardContent className="p-0 text-center">
            <div className="text-sm text-muted mb-1 font-medium">Углеводы</div>
            <div className="text-lg font-semibold text-ink">{totals.carbs_g.toFixed(1)}г</div>
          </CardContent>
        </SectionCard>
      </div>
    </div>
  );
}
