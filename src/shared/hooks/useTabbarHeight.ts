import { useEffect, useState } from 'react';

export function useTabbarHeight() {
  const [h, setH] = useState(0);
  
  useEffect(() => {
    const el = document.getElementById('app-tabbar');
    if (!el) return;
    
    const ro = new ResizeObserver(() => {
      const nh = el.getBoundingClientRect().height;
      setH(nh);
      document.documentElement.style.setProperty('--tabbar-h', `${nh}px`);
    });
    
    ro.observe(el);
    
    // Устанавливаем начальное значение
    const initialH = el.getBoundingClientRect().height;
    setH(initialH);
    document.documentElement.style.setProperty('--tabbar-h', `${initialH}px`);
    
    return () => ro.disconnect();
  }, []);
  
  return h;
}
