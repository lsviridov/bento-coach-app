import { MessageT } from '../model/schemas';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MessageProps {
  message: MessageT;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-surface text-ink'
            : 'bg-brand/10 text-ink'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className="mt-2 text-xs text-muted">
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
            locale: ru
          })}
        </div>
      </div>
    </div>
  );
}
