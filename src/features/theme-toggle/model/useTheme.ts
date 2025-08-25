import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateProfile } from '@/entities/user';
import type { ProfileUpdateData } from '@/entities/user';

type Theme = 'light' | 'dark' | 'auto';

export function useTheme(initialTheme: Theme = 'auto', profileId?: string) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [mounted, setMounted] = useState(false);

  // SSR-safe initialization
  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const currentTheme = savedTheme || 'auto';
    setTheme(currentTheme);
    
    // Apply theme immediately to prevent flash
    applyTheme(currentTheme, systemTheme);
  }, []);

  const applyTheme = (newTheme: Theme, systemTheme: 'light' | 'dark' = 'light') => {
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    html.removeAttribute('data-theme');
    
    let actualTheme: 'light' | 'dark';
    
    if (newTheme === 'auto') {
      actualTheme = systemTheme;
      html.setAttribute('data-theme', 'auto');
    } else {
      actualTheme = newTheme;
      html.setAttribute('data-theme', newTheme);
      html.classList.add(newTheme);
    }
    
    // Update CSS custom properties for the actual theme
    if (actualTheme === 'dark') {
      html.classList.add('dark');
    }
  };

  const changeTheme = async (newTheme: Theme) => {
    if (!mounted) return;
    
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, systemTheme);
    
    // Update profile if available
    if (profileId) {
      try {
        const updateData: ProfileUpdateData = { theme: newTheme };
        await updateProfile(updateData);
      } catch (error) {
        console.error('Failed to update theme in profile:', error);
        // Don't show error toast for theme changes
      }
    }
    
    toast.success(`Тема изменена на ${getThemeLabel(newTheme)}`);
  };

  const getThemeLabel = (theme: Theme): string => {
    switch (theme) {
      case 'light': return 'светлую';
      case 'dark': return 'тёмную';
      case 'auto': return 'авто';
      default: return 'авто';
    }
  };

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (!mounted || theme !== 'auto') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      applyTheme('auto', systemTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme]);

  return {
    theme,
    changeTheme,
    mounted,
    getThemeLabel,
  };
}
