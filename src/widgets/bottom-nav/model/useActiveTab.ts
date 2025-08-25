import { useLocation } from 'react-router-dom';
import type { BottomTab } from './types';

export function useActiveTab(items: BottomTab[], explicit?: string) {
  const location = useLocation();
  
  if (explicit) return explicit;
  
  // Специальная обработка для корневого пути
  if (location.pathname === '/') {
    return 'home';
  }
  
  // Простой маппинг пути к ключу (начало совпадает)
  const found = items.find(i => {
    if (i.href === '/') return false; // Исключаем корневой путь
    return location.pathname.startsWith(i.href);
  });
  
  return (found?.key ?? 'home');
}
