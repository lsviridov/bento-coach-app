import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Chat, Composer } from '@/features/coach-chat';
import { usePageContext } from '@/shared/hooks/usePageContext';
import { useMockSend } from '@/shared';
import { v4 as uuidv4 } from 'uuid';

interface CoachBottomSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CoachBottomSheet({ open, onClose }: CoachBottomSheetProps) {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const pageContext = usePageContext();
  const { mutate: sendMessage, isPending } = useMockSend();

  useEffect(() => {
    if (open && !sessionId) {
      // Создаём новую сессию для виджета
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setMessages([]);
    }
  }, [open, sessionId]);

  const handleSend = (content: string) => {
    if (!sessionId) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user' as const,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Отправляем сообщение через мок API
    sendMessage({
      sessionId,
      message: content,
      context: pageContext
    }, {
      onSuccess: (response) => {
        const assistantMessage = {
          id: uuidv4(),
          role: 'assistant' as const,
          content: response.reply,
          createdAt: new Date().toISOString(),
          intents: response.intents
        };
        setMessages(prev => [...prev, assistantMessage]);
      },
      onError: (error) => {
        const errorMessage = {
          id: uuidv4(),
          role: 'assistant' as const,
          content: 'Извините, произошла ошибка. Попробуйте позже.',
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className="fixed left-0 right-0 bg-surface rounded-t-3xl flex flex-col shadow-2xl z-50"
        style={{ 
          height: 'calc(100vh - 5rem)',
          bottom: '5rem'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-muted/20">
          <h3 className="text-lg font-semibold text-ink">Коуч</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted hover:text-ink"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <Chat 
            messages={messages} 
            isLoading={isPending}
            error={null}
          />
        </div>

        {/* Composer */}
        <Composer onSend={handleSend} disabled={isPending} />
      </div>
    </>
  );
}
