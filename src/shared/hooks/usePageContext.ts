import { useLocation } from 'react-router-dom';
import { useToday } from './useToday';
import { PageContext } from '@entities/assistant';

export function usePageContext(): PageContext {
  const location = useLocation();
  const { todayISO } = useToday();
  
  // Определяем страницу по пути
  let page: PageContext['page'] = 'home';
  let productSlug: string | undefined;
  
  if (location.pathname === '/') {
    page = 'home';
  } else if (location.pathname === '/diary') {
    page = 'diary';
  } else if (location.pathname === '/camera') {
    page = 'camera';
  } else if (location.pathname === '/shop') {
    page = 'shop';
  } else if (location.pathname.startsWith('/shop/')) {
    page = 'shop';
    productSlug = location.pathname.split('/')[2];
  } else if (location.pathname === '/protocols') {
    page = 'protocols';
  } else if (location.pathname === '/profile') {
    page = 'profile';
  }
  
  return {
    page,
    dateISO: todayISO,
    productSlug
  };
}
