// src/app/disableZoom.ts
let cleanup: (() => void) | null = null;

export function installZoomBlocker() {
  if (cleanup) return cleanup; // уже включено

  // 1) Жёстко обновим meta viewport (на случай если кто-то перепишет)
  const meta = (document.querySelector('meta[name="viewport"]') as HTMLMetaElement) || (() => {
    const m = document.createElement('meta');
    m.name = 'viewport';
    document.head.appendChild(m);
    return m;
  })();
  const content = 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
  meta.setAttribute('content', content);

  // 2) Гасим pinch/gesture (iOS Safari)
  const prevent = (e: Event) => e.preventDefault();
  window.addEventListener('gesturestart', prevent, { passive: false });
  window.addEventListener('gesturechange', prevent, { passive: false });
  window.addEventListener('gestureend', prevent, { passive: false });

  // 3) Гасим Ctrl + колесо (desktop)
  const onWheel = (e: WheelEvent) => { if (e.ctrlKey) e.preventDefault(); };
  window.addEventListener('wheel', onWheel, { passive: false });

  // 4) Гасим двойной тап/двойной клик
  let lastTouch = 0;
  const onTouchEnd = (e: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouch < 300) e.preventDefault();
    lastTouch = now;
  };
  window.addEventListener('dblclick', prevent, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: false });

  cleanup = () => {
    window.removeEventListener('gesturestart', prevent as any);
    window.removeEventListener('gesturechange', prevent as any);
    window.removeEventListener('gestureend', prevent as any);
    window.removeEventListener('wheel', onWheel as any);
    window.removeEventListener('dblclick', prevent as any);
    window.removeEventListener('touchend', onTouchEnd as any);
  };
  return cleanup;
}
