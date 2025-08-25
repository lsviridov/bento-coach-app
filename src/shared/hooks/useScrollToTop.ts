import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that automatically scrolls to the top of the page
 * whenever the route changes (location.pathname changes)
 */
export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
}
