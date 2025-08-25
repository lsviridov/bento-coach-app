import { useState, useEffect } from 'react';

export function useOfflineFlag() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Always return false (online) for localhost development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsOffline(false);
      return;
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Set initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOffline };
}
