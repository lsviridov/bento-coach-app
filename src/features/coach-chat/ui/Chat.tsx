import { Message } from './Message';
import { IntentBar } from './IntentBar';
import { MessageT } from '../model/schemas';
import { cn } from '@/lib/utils';

interface ChatProps {
  messages: MessageT[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export function Chat({ 
  messages, 
  isLoading = false, 
  error = null, 
  className,
  style 
}: ChatProps) {
  if (isLoading) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", className)} style={style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
          <p className="text-muted">Коуч думает...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", className)} style={style}>
        <div className="text-center text-danger">
          <p>Ошибка загрузки чата</p>
          <p className="text-sm text-muted mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", className)} style={style}>
        <div className="text-center text-muted">
          <p>Начните разговор с коучем</p>
          <p className="text-sm mt-1">Задайте вопрос о питании, целях или дневнике</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)} style={style}>
      {messages.map((message, index) => (
        <div key={message.id}>
          <Message message={message} />
          {message.role === 'assistant' && message.intents && message.intents.length > 0 && (
            <IntentBar intents={message.intents} />
          )}
        </div>
      ))}
    </div>
  );
}
