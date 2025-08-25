import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SectionCard } from '@/shared/ui/section-card';
import { useTheme } from '../model/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  initialTheme?: 'light' | 'dark' | 'auto';
  profileId?: string;
}

export function ThemeToggle({ initialTheme = 'auto', profileId }: ThemeToggleProps) {
  const { theme, changeTheme, mounted } = useTheme(initialTheme, profileId);

  if (!mounted) {
    return (
      <SectionCard variant="elevated" size="lg">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
            Тема оформления
          </h3>
          <div className="h-16 sm:h-20 bg-muted/20 animate-pulse rounded-lg" />
        </div>
      </SectionCard>
    );
  }

  const themes = [
    {
      value: 'light',
      label: 'Светлая',
      icon: Sun,
      description: 'Классическая светлая тема',
    },
    {
      value: 'dark',
      label: 'Тёмная',
      icon: Moon,
      description: 'Комфортная тёмная тема',
    },
    {
      value: 'auto',
      label: 'Авто',
      icon: Monitor,
      description: 'Следует системным настройкам',
    },
  ] as const;

  return (
    <SectionCard variant="elevated" size="lg">
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
          Тема оформления
        </h3>
        <p className="text-xs sm:text-sm text-muted">
          Выберите предпочитаемую тему для интерфейса
        </p>

        <RadioGroup
          value={theme}
          onValueChange={(value) => changeTheme(value as 'light' | 'dark' | 'auto')}
          className="space-y-2 sm:space-y-3"
        >
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            
            return (
              <div
                key={themeOption.value}
                className={`flex items-start sm:items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand bg-brand/5'
                    : 'border-border hover:border-brand/30 hover:bg-brand/5'
                }`}
                onClick={() => changeTheme(themeOption.value)}
              >
                <RadioGroupItem
                  value={themeOption.value}
                  id={themeOption.value}
                  className="sr-only"
                />
                
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                  isSelected ? 'bg-brand text-white' : 'bg-muted/20 text-muted'
                }`}>
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={themeOption.value}
                    className={`text-xs sm:text-sm font-medium cursor-pointer block ${
                      isSelected ? 'text-brand' : 'text-ink'
                    }`}
                  >
                    {themeOption.label}
                  </Label>
                  <p className="text-xs text-muted mt-0.5 sm:mt-1 leading-relaxed">
                    {themeOption.description}
                  </p>
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </SectionCard>
  );
}
