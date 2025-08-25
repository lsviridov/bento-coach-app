import { useEffect, useState } from 'react';

export function useKeyboardInsets() {
  const [kb, setKb] = useState(0);
  
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    
    const onResize = () => {
      const bottom = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
      setKb(bottom);
    };
    
    const onScroll = () => {
      const bottom = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
      setKb(bottom);
    };
    
    onResize(); // Устанавливаем начальное значение
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onScroll);
    
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onScroll);
    };
  }, []);
  
  return kb; // px
}
