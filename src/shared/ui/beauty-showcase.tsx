import { Badge } from '@/components/ui/badge';
import { SectionCard } from './section-card';
import { Flame, Droplets, Zap, Clock, Edit, Trash2 } from 'lucide-react';

export function BeautyShowcase() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-display text-ink">Красивый дизайн ADAPTO</h1>
      
      {/* Основные карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard variant="gradient" glow size="lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-6 h-6 text-accent" />
              <span className="text-lg font-medium text-muted">Калории</span>
            </div>
            <div className="text-4xl font-bold text-ink mb-2">1850</div>
            <div className="text-sm text-muted">ккал за сегодня</div>
          </div>
        </SectionCard>
        
        <SectionCard variant="gradient" glow size="lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Droplets className="w-6 h-6 text-brand" />
              <span className="text-lg font-medium text-muted">Вода</span>
            </div>
            <div className="text-4xl font-bold text-ink mb-2">1250</div>
            <div className="text-sm text-muted">мл за сегодня</div>
          </div>
        </SectionCard>
      </div>

      {/* Макронутриенты */}
      <div className="grid grid-cols-3 gap-3">
        <SectionCard variant="elevated" size="sm">
          <div className="text-center">
            <div className="text-sm text-muted mb-2 font-medium">Белки</div>
            <div className="text-2xl font-bold text-ink">95.5г</div>
            <div className="text-xs text-muted">цель: 120г</div>
          </div>
        </SectionCard>
        
        <SectionCard variant="elevated" size="sm">
          <div className="text-center">
            <div className="text-sm text-muted mb-2 font-medium">Жиры</div>
            <div className="text-2xl font-bold text-ink">68.4г</div>
            <div className="text-xs text-muted">цель: 80г</div>
          </div>
        </SectionCard>
        
        <SectionCard variant="elevated" size="sm">
          <div className="text-center">
            <div className="text-sm text-muted mb-2 font-medium">Углеводы</div>
            <div className="text-2xl font-bold text-ink">132.9г</div>
            <div className="text-xs text-muted">цель: 200г</div>
          </div>
        </SectionCard>
      </div>

      {/* Пример карточки приема пищи */}
      <SectionCard variant="elevated" size="lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-accent/20 rounded-xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-brand" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-lg font-medium text-ink">Овсянка с ягодами</h3>
              <div className="flex items-center gap-1 text-muted text-sm">
                <Clock className="w-4 h-4" />
                <span>08:00</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-brand-50 text-ink border-brand/20">
                250г
              </Badge>
              <Badge className="bg-accent/15 text-ink border-accent/20">
                320 ккал
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                Б: 12.5г
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-warning rounded-full"></span>
                Ж: 8.2г
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                У: 52.3г
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button className="h-8 w-8 p-0 hover:bg-brand-50 hover:text-brand rounded-lg flex items-center justify-center transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="h-8 w-8 p-0 hover:bg-danger/10 text-danger rounded-lg flex items-center justify-center transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Цветовая палитра */}
      <SectionCard variant="glass">
        <div className="p-4">
          <h3 className="text-lg font-medium text-ink mb-4">Цветовая палитра</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-lg mx-auto mb-2 border border-border"></div>
              <p className="text-sm text-muted">Brand</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg mx-auto mb-2 border border-border"></div>
              <p className="text-sm text-muted">Accent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-surface rounded-lg mx-auto mb-2 border border-border"></div>
              <p className="text-sm text-muted">Surface</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2 border border-border"></div>
              <p className="text-sm text-muted">Muted</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
