import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatHeader, 
  MessageList, 
  Composer 
} from '@/features/coach-chat';
import { 
  useMockSessions, 
  useMockMessages, 
  useMockSend 
} from '@/shared';
import { useKeyboardInsets } from '@/features/coach-chat';
import { useTabbarHeight } from '@/shared';
import { BottomNav } from '@/widgets';
import { AppHeader } from '@/widgets/header';
import { Home, Camera, BookOpen, ShoppingBag, User, MessageCircle, Plus, History } from 'lucide-react';
import type { BottomTab } from '@/widgets/bottom-nav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const navigationItems: BottomTab[] = [
  { key: 'home', href: '/', icon: Home, label: 'Главная' },
  { key: 'camera', href: '/camera', icon: Camera, label: 'Камера' },
  { key: 'diary', href: '/diary', icon: BookOpen, label: 'Дневник' },
  { key: 'coach', href: '/coach', icon: MessageCircle, label: 'Коуч' },
  { key: 'shop', href: '/shop', icon: ShoppingBag, label: 'Магазин' },
  { key: 'profile', href: '/profile', icon: User, label: 'Профиль' },
];

export default function Coach() {
  const navigate = useNavigate();
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isNewSession, setIsNewSession] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useMockSessions();
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMockMessages(currentSessionId);
  const { mutate: sendMessage, isPending: isSending } = useMockSend();

  // Хуки для адаптивной компоновки
  const kb = useKeyboardInsets();
  const tabbarH = useTabbarHeight();

  // Измеряем высоту композера, чтобы дать паддинг списку
  const composerRef = useRef<HTMLDivElement | null>(null);
  const composerH = composerRef.current?.getBoundingClientRect().height ?? 64;

  // Учитываем и CSS-переменную (на случай 0)
  const cssTabbarH = useMemo(() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--tabbar-h').replace('px','').trim();
    return Number(v) || 64;
  }, []);

  // Сколько места снизу нужно оставить списку, чтобы ничего не перекрывалось
  const bottomPad = useMemo(() => {
    const bar = tabbarH || cssTabbarH;
    return composerH + bar; // без доп. отступов
  }, [composerH, tabbarH, cssTabbarH]);

  // Отладочная информация
  useEffect(() => {
    console.log('Tabbar height debug:', { tabbarH, cssTabbarH, bottomPad, composerH, kb });
    console.log('CSS var --tabbar-h:', getComputedStyle(document.documentElement).getPropertyValue('--tabbar-h'));
    
    // Проверяем позиционирование композера
    if (composerRef.current) {
      const rect = composerRef.current.getBoundingClientRect();
      console.log('Composer position:', {
        bottom: rect.bottom,
        top: rect.top,
        height: rect.height,
        zIndex: getComputedStyle(composerRef.current).zIndex,
        computedBottom: getComputedStyle(composerRef.current).bottom,
        transform: getComputedStyle(composerRef.current).transform
      });
    }
    
    // Проверяем позиционирование таббара
    const tabbarEl = document.getElementById('app-tabbar');
    if (tabbarEl) {
      const rect = tabbarEl.getBoundingClientRect();
      console.log('Tabbar position:', {
        bottom: rect.bottom,
        top: rect.top,
        height: rect.height,
        zIndex: getComputedStyle(tabbarEl).zIndex
      });
      
      // Проверяем реальную высоту таббара
      console.log('Tabbar real height:', rect.height);
      console.log('Tabbar computed height:', getComputedStyle(tabbarEl).height);
    }
    
    // Проверяем размеры экрана
    console.log('Viewport height:', window.innerHeight);
    console.log('Document height:', document.documentElement.scrollHeight);
    console.log('Keyboard insets:', kb);
  }, [tabbarH, cssTabbarH, bottomPad, composerH, kb]);

  useEffect(() => {
    // Если есть сессии, берём первую активную
    if (sessions && sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId]);

  const handleNewSession = () => {
    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
    setIsNewSession(true);
    setShowHistory(false);
  };

  const handleSend = (content: string) => {
    if (!currentSessionId) return;

    sendMessage({
      sessionId: currentSessionId,
      message: content
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsNewSession(false);
    setShowHistory(false);
  };

  // Общий композер для всех состояний
  const renderComposer = () => {
    const tabbarHeight = tabbarH || cssTabbarH;
    
    return (
      <div
        ref={composerRef}
        className="fixed left-0 right-0 z-40 border-t bg-[var(--surface)]/85 backdrop-blur-md"
        style={{
          bottom: `${tabbarHeight + 20}px`, // композер ВЫШЕ таббара с большим отступом
          transform: kb > 0 ? `translateY(-${kb}px)` : 'none' // применяем transform только когда клавиатура открыта
        }}
      >
        <Composer 
          onSend={handleSend} 
          disabled={isSending || !currentSessionId} 
        />
      </div>
    );
  };

  // Main content
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <AppHeader 
        title="Коуч" 
        variant="coach"
        rightActions={[
          {
            icon: Plus,
            onClick: handleNewSession,
            label: "Новая сессия"
          },
          {
            icon: History,
            onClick: handleHistoryClick,
            label: "История"
          }
        ]}
      />
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showHistory ? (
          // History view
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">История сессий</h2>
              <Button onClick={handleNewSession} className="bg-brand hover:bg-brand/90">
                Новая сессия
              </Button>
            </div>
            
            {sessionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : sessionsError ? (
              <div className="text-center py-8">
                <p className="text-muted">Ошибка загрузки сессий</p>
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSessionSelect(session.id)}
                    className={cn(
                      "w-full p-4 border rounded-lg text-left transition-colors",
                      currentSessionId === session.id
                        ? "border-brand bg-brand-50 dark:bg-brand-900/20"
                        : "border-surface-200 dark:border-surface-700 hover:bg-surface-800"
                    )}
                  >
                    <h3 className="font-medium text-ink mb-1">
                      {session.title || `Сессия ${session.id.slice(0, 8)}`}
                    </h3>
                    <p className="text-sm text-muted">
                      {session.messages?.length || 0} сообщений
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted">Нет сессий</p>
                <Button onClick={handleNewSession} className="mt-4 bg-brand hover:bg-brand/90">
                  Создать первую сессию
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Chat view
          <div className="flex flex-col h-full">
            <MessageList
              messages={messages}
              isLoading={messagesLoading}
              error={messagesError}
              className="flex-1"
              style={{ paddingBottom: `${bottomPad}px` }}
            />
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div id="app-tabbar" className="fixed inset-x-0 bottom-0 z-50">
        <BottomNav items={navigationItems} />
      </div>
      
      {/* Composer - рендерим ПОСЛЕ таббара */}
      {renderComposer()}
    </div>
  );
}
