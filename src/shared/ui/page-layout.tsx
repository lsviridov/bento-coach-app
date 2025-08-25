import { ReactNode } from 'react';
import { BottomNav } from '@/widgets';
import { InstallBlocker } from '@/features/a2hs-blocker';
import { Home, Camera, BookOpen, ShoppingBag, User, MessageCircle } from 'lucide-react';
import type { BottomTab } from '@/widgets/bottom-nav';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

const navigationItems: BottomTab[] = [
  { key: 'home', href: '/', icon: Home, label: 'Главная' },
  { key: 'camera', href: '/camera', icon: Camera, label: 'Камера' },
  { key: 'diary', href: '/diary', icon: BookOpen, label: 'Дневник' },
  { key: 'coach', href: '/coach', icon: MessageCircle, label: 'Коуч' },
  { key: 'shop', href: '/shop', icon: ShoppingBag, label: 'Магазин' },
  { key: 'profile', href: '/profile', icon: User, label: 'Профиль' },
];

export const PageLayout = ({ 
  children, 
  className = "", 
  showBottomNav = true 
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Основной контент с отступом для fixed хедера */}
      <div className={cn("flex-1 overflow-y-auto pb-20 pt-16", className)}>
        {children}
      </div>
      
      {showBottomNav && (
        <footer id="app-tabbar" className="fixed inset-x-0 bottom-0 z-50">
          <BottomNav items={navigationItems} />
        </footer>
      )}
      
      <InstallBlocker />
    </div>
  );
};
