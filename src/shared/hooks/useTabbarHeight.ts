import { useEffect, useState } from 'react';

export function useTabbarHeight() {
  const [h, setH] = useState(64); // дефолт

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    
    const findAndMeasure = () => {
      const el = document.getElementById('app-tabbar');
      if (!el) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(findAndMeasure, 100); // retry через 100ms
          return;
        }
        // если не нашли после всех попыток, используем дефолт
        setH(64);
        document.documentElement.style.setProperty('--tabbar-h', '64px');
        return;
      }

      const apply = () => {
        const nh = el.getBoundingClientRect().height || 64;
        setH(nh);
        document.documentElement.style.setProperty('--tabbar-h', `${nh}px`);
        console.log('Tabbar height updated:', nh);
      };

      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(el);
      window.addEventListener('resize', apply);
      
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', apply);
      };
    };

    // Запускаем поиск элемента
    findAndMeasure();
  }, []);

  return h;
}
