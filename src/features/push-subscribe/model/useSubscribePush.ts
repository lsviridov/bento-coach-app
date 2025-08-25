import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { subscribePush, unsubscribePush, updateProfile } from '@/entities/user';
import type { ProfileUpdateData } from '@/entities/user';

// Extend Navigator interface for iOS standalone detection
interface ExtendedNavigator extends Navigator {
  standalone?: boolean;
}

export function useSubscribePush(initialEnabled: boolean = false, profileId?: string) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if Push API is supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    
    // Get current permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Уведомления не поддерживаются в этом браузере');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Разрешение на уведомления получено');
        return true;
      } else if (result === 'denied') {
        toast.error('Разрешение на уведомления отклонено');
        return false;
      } else {
        toast.info('Разрешение на уведомления не получено');
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      toast.error('Не удалось запросить разрешение на уведомления');
      return false;
    }
  };

  const enablePush = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Push-уведомления не поддерживаются в этом браузере');
      return false;
    }

    if (permission === 'denied') {
      toast.error('Разрешение на уведомления отклонено. Измените настройки браузера.');
      return false;
    }

    if (permission === 'default') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    setIsLoading(true);
    
    try {
      // Subscribe to push notifications
      const result = await subscribePush();
      
      if (result.ok) {
        setIsEnabled(true);
        
        // Update profile
        if (profileId) {
          try {
            const updateData: ProfileUpdateData = { push_enabled: true };
            await updateProfile(updateData);
          } catch (error) {
            console.error('Failed to update profile:', error);
            // Continue anyway - push is enabled
          }
        }
        
        toast.success('Push-уведомления включены');
        return true;
      } else {
        toast.error('Не удалось включить push-уведомления');
        return false;
      }
    } catch (error) {
      console.error('Failed to enable push:', error);
      toast.error('Не удалось включить push-уведомления');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disablePush = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Unsubscribe from push notifications
      const result = await unsubscribePush();
      
      if (result.ok) {
        setIsEnabled(false);
        
        // Update profile
        if (profileId) {
          try {
            const updateData: ProfileUpdateData = { push_enabled: false };
            await updateProfile(updateData);
          } catch (error) {
            console.error('Failed to update profile:', error);
            // Continue anyway - push is disabled
          }
        }
        
        toast.success('Push-уведомления отключены');
        return true;
      } else {
        toast.error('Не удалось отключить push-уведомления');
        return false;
      }
    } catch (error) {
      console.error('Failed to disable push:', error);
      toast.error('Не удалось отключить push-уведомления');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePush = async (): Promise<void> => {
    if (isEnabled) {
      await disablePush();
    } else {
      await enablePush();
    }
  };

  // Check if running in iOS standalone mode
  const isIOSStandalone = () => {
    const extendedNavigator = navigator as ExtendedNavigator;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      extendedNavigator.standalone === true
    );
  };

  const getIOSHint = () => {
    if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) return null;
    
    if (!isIOSStandalone()) {
      return 'Установите приложение на Домой для получения push-уведомлений';
    }
    
    return null;
  };

  return {
    isEnabled,
    isSupported,
    permission,
    isLoading,
    enablePush,
    disablePush,
    togglePush,
    requestPermission,
    isIOSStandalone,
    getIOSHint,
  };
}
