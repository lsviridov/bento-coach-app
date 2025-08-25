'use client';
import { useNavigate } from 'react-router-dom';
import { useActiveTab } from '../model/useActiveTab';
import type { BottomNavProps } from '../model/types';
import { cn } from '@/lib/utils';

export default function BottomNav({ items, activeKey, onChange }: BottomNavProps) {
  const navigate = useNavigate();
  const current = useActiveTab(items, activeKey);

  const handleTabChange = (key: string, href: string) => {
    onChange?.(key as any);
    navigate(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentKey: string) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const idx = items.findIndex(i => i.key === currentKey);
      const next = items[(idx + dir + items.length) % items.length];
      onChange?.(next.key);
      navigate(next.href);
    }
  };

  return (
    <nav
      role="tablist"
      aria-label="Основная навигация"
      className={cn(
        "w-full bottom-nav",
        "glass-dark border-t border-surface-200 dark:border-surface-700",
        "backdrop-blur-lg"
      )}
    >
      <div className="mx-auto w-full max-w-md px-2">
        <ul className="flex items-center justify-around h-20 pt-2">
          {items.map((item, index) => {
            const isActive = item.key === current;
            const isLeftTab = index < 2; // Главная, Камера
            const isRightTab = index >= 3; // Коуч, Магазин, Профиль
            const isDiary = item.key === 'diary';
            
            // Определяем порядок элементов
            const shouldShowLabelRight = isLeftTab || isDiary; // Название справа от иконки
            const shouldShowLabelLeft = isRightTab; // Название слева от иконки (Коуч, Магазин, Профиль)
            
            return (
              <li key={item.key} className="relative flex-shrink-0">
                <button
                  role="tab"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleTabChange(item.key, item.href)}
                  onKeyDown={(e) => handleKeyDown(e, item.key)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2 rounded-lg",
                    "min-w-[44px] min-h-[44px]",
                    "touch-manipulation",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
                    "transition-all duration-300 ease-out",
                    isActive 
                      ? "text-brand bg-brand-50 dark:bg-brand-900/20" 
                      : "text-muted-500 hover:text-ink hover:bg-surface-100 dark:hover:bg-surface-200"
                  )}
                >
                  {/* Название слева от иконки (для правых вкладок: Коуч, Магазин, Профиль) */}
                  {shouldShowLabelLeft && (
                    <span
                      className={cn(
                        "text-xs font-medium select-none text-brand whitespace-nowrap",
                        "transition-all duration-300 ease-out overflow-hidden",
                        isActive 
                          ? "opacity-100 w-auto max-w-[80px]" 
                          : "opacity-0 w-0 max-w-0"
                      )}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Иконка */}
                  <span className="relative flex items-center justify-center flex-shrink-0">
                    <item.icon
                      className={cn(
                        "w-6 h-6 transition-all duration-300 ease-out",
                        isActive && "scale-110 text-brand"
                      )}
                    />
                  </span>

                  {/* Название справа от иконки (для левых вкладок и дневника) */}
                  {shouldShowLabelRight && (
                    <span
                      className={cn(
                        "text-xs font-medium select-none text-brand whitespace-nowrap",
                        "transition-all duration-300 ease-out overflow-hidden",
                        isActive 
                          ? "opacity-100 w-auto max-w-[80px]" 
                          : "opacity-0 w-0 max-w-0"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
