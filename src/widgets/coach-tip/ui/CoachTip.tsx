

import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoachTip } from '../model/useCoachTip';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';

export function CoachTip() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCoachTip();
  const { isOffline } = useOfflineFlag();

  const handleCTAClick = (intent: string) => {
    switch (intent) {
      case 'suggestMeal':
        navigate('/coach?intent=meal');
        break;
      case 'logWater':
        navigate('/diary?add=water');
        break;
      case 'openDiary':
        navigate('/diary');
        break;
      case 'openShop':
        navigate('/shop');
        break;
    }
  };

  if (isLoading) {
    return (
      <section className="bg-surface rounded-xl p-4 border border-muted/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 bg-muted/30 rounded-full animate-pulse" />
          <div className="w-24 h-4 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-muted/30 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-muted/30 rounded animate-pulse" />
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-surface rounded-xl p-4 border border-muted/20">
        <div className="text-center text-muted">
          <Lightbulb className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Не удалось загрузить совет</p>
        </div>
      </section>
    );
  }

  if (isOffline) {
    return (
      <section className="bg-surface rounded-xl p-4 border border-muted/20">
        <div className="text-center text-muted">
          <Lightbulb className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Совет недоступен офлайн</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface rounded-xl p-4 border border-muted/20 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-brand" />
        </div>
        <span className="text-sm font-medium text-muted">Коуч советует</span>
      </div>
      
      <p className="text-ink mb-3 leading-relaxed">
        {data.text}
      </p>
      
      {data.cta && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCTAClick(data.cta!.intent)}
          className="text-brand hover:bg-brand-50 hover:text-brand/80 transition-colors p-0 h-auto"
        >
          {data.cta.label}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </section>
  );
}
