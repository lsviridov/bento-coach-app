import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstallPromptProps {
  className?: string;
}

export const InstallPrompt = ({ className }: InstallPromptProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Handle beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS install hint if on iOS and not standalone
    if (iOS && !standalone && !localStorage.getItem('hideIOSInstallPrompt')) {
      setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      // iOS - just hide the prompt as user has been instructed
      localStorage.setItem('hideIOSInstallPrompt', 'true');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('hideIOSInstallPrompt', 'true');
    }
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-20 left-4 right-4 z-50 p-4 glass rounded-lg border border-brand-50/50",
      "shadow-soft animate-in slide-in-from-bottom-5 duration-300",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-brand" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground mb-1">
            Установить ADAPTO
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {isIOS 
              ? 'Откройте меню "Поделиться" → "На экран Домой"'
              : 'Добавьте приложение на домашний экран для быстрого доступа'
            }
          </p>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="text-xs"
            >
              {isIOS ? 'Понятно' : 'Установить'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="text-xs"
            >
              Позже
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="w-6 h-6 p-0 shrink-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};