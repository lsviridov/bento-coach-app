import { Search, Filter, X, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFilters, FilterState } from '../model/useFilters';
import { cn } from '@/lib/utils';

interface CompactProductFiltersProps {
  className?: string;
}

export function CompactProductFilters({ className }: CompactProductFiltersProps) {
  const {
    filters,
    hasActiveFilters,
    goalOptions,
    categoryOptions,
    sortOptions,
    updateSearch,
    toggleCategory,
    toggleGoal,
    updateSort,
    updatePriceMin,
    updatePriceMax,
    clearFilters
  } = useFilters();

  // Подсчет активных фильтров для бейджа
  const activeFiltersCount = [
    filters.category.length,
    filters.goals.length,
    filters.priceMin !== undefined ? 1 : 0,
    filters.priceMax !== undefined ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className={cn(
      'fixed top-16 left-0 right-0 z-40 bg-bg/95 backdrop-blur-sm border-b border-[color-mix(in_oklab,var(--muted)_20%,transparent)]',
      'p-4 space-y-3',
      className
    )}>
      {/* Поиск и кнопка фильтров */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
          <Input
            placeholder="Поиск продуктов..."
            value={filters.q}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.q && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Кнопка фильтров */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Settings className="w-4 h-4 mr-2" />
              Фильтры
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Настройка фильтров
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Категории */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink">Категории</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={filters.category.includes(value) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        filters.category.includes(value)
                          ? 'bg-brand text-white hover:bg-brand/90'
                          : 'hover:bg-brand-50 hover:text-brand'
                      )}
                      onClick={() => toggleCategory(value)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Фильтр по цене */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink">Цена (BYN)</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.priceMin || ''}
                      onChange={(e) => updatePriceMin(e.target.value ? Number(e.target.value) : undefined)}
                      className="text-sm"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.priceMax || ''}
                      onChange={(e) => updatePriceMax(e.target.value ? Number(e.target.value) : undefined)}
                      className="text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Цели */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink">Цели</h3>
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={filters.goals.includes(value) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        filters.goals.includes(value)
                          ? 'bg-accent text-white hover:bg-accent/90'
                          : 'hover:bg-accent/10 hover:text-accent'
                      )}
                      onClick={() => toggleGoal(value)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Сортировка */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink">Сортировка</h3>
                <Select value={filters.sort} onValueChange={(value: FilterState['sort']) => updateSort(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Кнопки управления */}
              <div className="flex items-center justify-between pt-4 border-t border-[color-mix(in_oklab,var(--muted)_20%,transparent)]">
                <div className="text-sm text-muted">
                  {activeFiltersCount > 0 && `${activeFiltersCount} активных фильтров`}
                </div>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted hover:text-ink"
                  >
                    Очистить все
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Быстрые активные фильтры (если есть) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted">Активные:</span>
          {filters.category.map(cat => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {categoryOptions.find(c => c.value === cat)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategory(cat)}
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          {filters.goals.map(goal => (
            <Badge key={goal} variant="secondary" className="text-xs">
              {goalOptions.find(g => g.value === goal)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleGoal(goal)}
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
            <Badge variant="secondary" className="text-xs">
              Цена: {filters.priceMin || 0} - {filters.priceMax || '∞'} BYN
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  updatePriceMin(undefined);
                  updatePriceMax(undefined);
                }}
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
