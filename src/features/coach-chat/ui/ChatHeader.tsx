import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  onNewSession: () => void;
  onHistoryClick: () => void;
  onBack: () => void;
}

export function ChatHeader({ onNewSession, onHistoryClick, onBack }: ChatHeaderProps) {
  return (
    <header className="bg-surface border-b px-4 py-3 flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="h-8 w-8 text-muted hover:text-ink"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <h1 className="text-lg font-semibold text-ink">Коуч</h1>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHistoryClick}
          className="h-8 w-8 text-muted hover:text-ink"
        >
          <History className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewSession}
          className="h-8 w-8 text-muted hover:text-ink"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
