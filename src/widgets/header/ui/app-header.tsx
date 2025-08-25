import { Button } from "@/components/ui/button";
import { Sun, Moon, ArrowLeft, Settings, Filter, Search, Plus } from "lucide-react";
import { useTheme } from "@/shared/lib/theme";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  className?: string;
  title?: string;
  variant?: 'default' | 'camera' | 'diary' | 'coach' | 'shop' | 'profile';
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    label: string;
  };
  rightActions?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    label: string;
  }>;
}

export const AppHeader = ({ 
  className, 
  title, 
  variant = 'default',
  showBackButton = false,
  onBack,
  rightAction,
  rightActions
}: AppHeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const getDefaultTitle = () => {
    switch (variant) {
      case 'camera': return 'Камера';
      case 'diary': return 'Дневник';
      case 'coach': return 'Коуч';
      case 'shop': return 'Магазин';
      case 'profile': return 'Профиль';
      default: return 'ADAPTO';
    }
  };

  const getRightAction = () => {
    if (rightActions && rightActions.length > 0) {
      return (
        <div className="flex items-center gap-2">
          {rightActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="w-9 h-9 p-0 hover:bg-surface-100 dark:hover:bg-surface-200 transition-colors"
            >
              <action.icon className="h-4 w-4 text-ink" />
              <span className="sr-only">{action.label}</span>
            </Button>
          ))}
        </div>
      );
    }

    if (rightAction) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={rightAction.onClick}
          className="w-9 h-9 p-0 hover:bg-surface-100 dark:hover:bg-surface-200 transition-colors"
        >
          <rightAction.icon className="h-4 w-4 text-ink" />
          <span className="sr-only">{rightAction.label}</span>
        </Button>
      );
    }

    // По умолчанию показываем переключатель темы
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="w-9 h-9 p-0 hover:bg-surface-100 dark:hover:bg-surface-200 transition-colors"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4 text-ink" />
        ) : (
          <Sun className="h-4 w-4 text-ink" />
        )}
        <span className="sr-only">Переключить тему</span>
      </Button>
    );
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full header-glass border-b border-surface-200 dark:border-surface-700",
      "px-4 h-16 flex items-center justify-between",
      "pt-safe-top",
      className
    )}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="w-9 h-9 p-0 hover:bg-surface-100 dark:hover:bg-surface-200 transition-colors -ml-1"
          >
            <ArrowLeft className="h-4 w-4 text-ink" />
            <span className="sr-only">Назад</span>
          </Button>
        )}
        
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          {title || getDefaultTitle()}
        </h1>
      </div>
      
      {getRightAction()}
    </header>
  );
};