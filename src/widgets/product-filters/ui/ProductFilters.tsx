import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilters, FilterState } from '../model/useFilters';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
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

  return (
    <div className={cn(
      'fixed top-16 left-0 right-0 z-40 bg-bg/95 backdrop-blur-sm border-b border-[color-mix(in_oklab,var(--muted)_20%,transparent)]',
      'p-4 space-y-4',
      className
    )}>
      {/* Поиск */}
      <div className="relative">
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

      {/* Категории */}
      <div className="space-y-2">
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
      <div className="space-y-2">
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
      <div className="space-y-2">
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

      {/* Сортировка и очистка */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted" />
          <Select value={filters.sort} onValueChange={(value: FilterState['sort']) => updateSort(value)}>
            <SelectTrigger className="w-40">
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

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted hover:text-ink"
          >
            Очистить
          </Button>
        )}
      </div>
    </div>
  );
}
