import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SectionCard } from '@/shared/ui/section-card';
import { Badge } from '@/components/ui/badge';
import { useSubscribePush } from '../model/useSubscribePush';
import { Bell, BellOff, Smartphone } from 'lucide-react';

interface PushToggleProps {
  initialEnabled?: boolean;
  profileId?: string;
}

export function PushToggle({ initialEnabled = false, profileId }: PushToggleProps) {
  const {
    isEnabled,
    isSupported,
    permission,
    isLoading,
    togglePush,
    isIOSStandalone,
    getIOSHint,
  } = useSubscribePush(initialEnabled, profileId);

  const iosHint = getIOSHint();

  if (!isSupported) {
    return (
      <SectionCard variant="elevated" size="lg">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
            Уведомления
          </h3>
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-muted/20 rounded-lg">
            <BellOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted mt-0.5 sm:mt-0 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Push-уведомления не поддерживаются в этом браузере
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    );
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { label: 'Разрешено', variant: 'default' as const, color: 'text-success' };
      case 'denied':
        return { label: 'Заблокировано', variant: 'destructive' as const, color: 'text-destructive' };
      case 'default':
        return { label: 'Не запрошено', variant: 'outline' as const, color: 'text-muted' };
      default:
        return { label: 'Неизвестно', variant: 'outline' as const, color: 'text-muted' };
    }
  };

  const permissionStatus = getPermissionStatus();

  return (
    <SectionCard variant="elevated" size="lg">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
            Уведомления
          </h3>
          <Badge variant={permissionStatus.variant} className={`${permissionStatus.color} text-xs`}>
            {permissionStatus.label}
          </Badge>
        </div>
        
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Получайте уведомления о протоколах, напоминания и важные обновления
        </p>

        <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-muted/10 rounded-lg">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {isEnabled ? (
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-brand mt-0.5 sm:mt-0 flex-shrink-0" />
            ) : (
              <BellOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted mt-0.5 sm:mt-0 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <Label htmlFor="push-toggle" className="text-xs sm:text-sm font-medium block">
                Push-уведомления
              </Label>
              <p className="text-xs text-muted mt-0.5 sm:mt-1 leading-relaxed">
                {isEnabled ? 'Включены' : 'Отключены'}
              </p>
            </div>
          </div>
          
          <Switch
            id="push-toggle"
            checked={isEnabled}
            onCheckedChange={togglePush}
            disabled={isLoading || permission === 'denied'}
            className="data-[state=checked]:bg-brand ml-3 flex-shrink-0"
          />
        </div>

        {/* iOS Hint */}
        {iosHint && (
          <div className="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-accent font-medium">iOS устройство</p>
              <p className="text-xs text-accent/80 mt-0.5 sm:mt-1 leading-relaxed">{iosHint}</p>
            </div>
          </div>
        )}

        {/* Permission Help */}
        {permission === 'denied' && (
          <div className="p-2.5 sm:p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-xs sm:text-sm text-destructive leading-relaxed">
              Разрешение на уведомления заблокировано. 
              Измените настройки браузера, чтобы получать уведомления.
            </p>
          </div>
        )}

        {permission === 'default' && !isEnabled && (
          <div className="p-2.5 sm:p-3 bg-brand/10 border border-brand/20 rounded-lg">
            <p className="text-xs sm:text-sm text-brand leading-relaxed">
              При включении уведомлений браузер запросит разрешение.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
