import { useState, useCallback, useMemo } from 'react';
import { ProductListQueryT } from '@/entities/product';

export interface FilterState {
  q: string;
  category: ('peptides' | 'supplements')[];
  goals: string[];
  priceMin?: number;
  priceMax?: number;
  sort: 'popular' | 'priceAsc' | 'priceDesc';
}

const GOAL_OPTIONS = [
  { value: 'восстановление', label: 'Восстановление' },
  { value: 'иммунитет', label: 'Иммунитет' },
  { value: 'антипаразитарный', label: 'Антипаразитарный' },
  { value: 'антиоксидант', label: 'Антиоксидант' },
  { value: 'кости', label: 'Кости/минералы' },
  { value: 'белок', label: 'Белки' },
  { value: 'омега-3', label: 'Омега-3' },
  { value: 'детокс', label: 'Детокс' },
  { value: 'долголетие', label: 'Долголетие' },
  { value: 'защита', label: 'Защита' }
];

const CATEGORY_OPTIONS: Array<{ value: 'peptides' | 'supplements'; label: string }> = [
  { value: 'peptides', label: 'Пептиды' },
  { value: 'supplements', label: 'Добавки' }
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'priceAsc', label: 'Цена ↑' },
  { value: 'priceDesc', label: 'Цена ↓' }
];

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    category: [],
    goals: [],
    sort: 'popular'
  });

  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce поиска
  const debounceSearch = useCallback((query: string) => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const updateSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, q: query }));
    debounceSearch(query);
  }, [debounceSearch]);

  const toggleCategory = useCallback((category: 'peptides' | 'supplements') => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  }, []);

  const toggleGoal = useCallback((goal: string) => {
    setFilters(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  }, []);

  const updateSort = useCallback((sort: FilterState['sort']) => {
    setFilters(prev => ({ ...prev, sort }));
  }, []);

  const updatePriceMin = useCallback((priceMin: number | undefined) => {
    setFilters(prev => ({ ...prev, priceMin }));
  }, []);

  const updatePriceMax = useCallback((priceMax: number | undefined) => {
    setFilters(prev => ({ ...prev, priceMax }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      q: '',
      category: [],
      goals: [],
      priceMin: undefined,
      priceMax: undefined,
      sort: 'popular'
    });
    setDebouncedQuery('');
  }, []);

  // Формируем query для API
  const queryParams = useMemo((): ProductListQueryT => ({
    q: debouncedQuery || undefined,
    category: filters.category.length > 0 ? filters.category : undefined,
    goals: filters.goals.length > 0 ? filters.goals : undefined,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sort: filters.sort,
    limit: 20
  }), [debouncedQuery, filters.category, filters.goals, filters.priceMin, filters.priceMax, filters.sort]);

  const hasActiveFilters = useMemo(() => 
    filters.q || filters.category.length > 0 || filters.goals.length > 0 || filters.priceMin !== undefined || filters.priceMax !== undefined
  , [filters.q, filters.category.length, filters.goals.length, filters.priceMin, filters.priceMax]);

  return {
    filters,
    queryParams,
    hasActiveFilters,
    goalOptions: GOAL_OPTIONS,
    categoryOptions: CATEGORY_OPTIONS,
    sortOptions: SORT_OPTIONS,
    updateSearch,
    toggleCategory,
    toggleGoal,
    updateSort,
    updatePriceMin,
    updatePriceMax,
    clearFilters
  };
}
