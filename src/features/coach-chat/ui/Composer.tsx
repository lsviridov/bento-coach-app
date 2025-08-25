import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';

interface ComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function Composer({ onSend, disabled = false }: ComposerProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Авто-рост textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      // Сбрасываем высоту textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 border-t border-border bg-surface/85 backdrop-blur-md">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-muted hover:text-ink flex-shrink-0"
        disabled={disabled}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-muted hover:text-ink flex-shrink-0"
        disabled={disabled}
      >
        <Mic className="h-5 w-5" />
      </Button>
      
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Задайте вопрос коучу..."
        className="flex-1 resize-none overflow-hidden rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        rows={1}
        style={{ minHeight: '40px', maxHeight: '120px' }}
        disabled={disabled}
      />
      
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 bg-brand hover:bg-brand/90 text-white flex-shrink-0"
        disabled={disabled || !message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
