import { useNavigate } from 'react-router-dom';

interface SaveBarProps {
  onSave: () => void;
  isSaving: boolean;
  isOffline: boolean;
}

export function SaveBar({ onSave, isSaving, isOffline }: SaveBarProps) {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/diary');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-muted/20 p-4 pb-20 shadow-lg backdrop-blur-sm">
      <div className="max-w-md mx-auto flex gap-3">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="flex-1 px-4 py-3 bg-surface border border-muted/30 text-ink rounded-lg hover:bg-muted/10 active:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
        >
          Отмена
        </button>
        
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-4 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 active:bg-brand/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
        >
          {isSaving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Сохраняем...
            </div>
          ) : isOffline ? (
            'Сохранить черновик'
          ) : (
            'Сохранить приём'
          )}
        </button>
      </div>
      
      {/* Офлайн подсказка */}
      {isOffline && (
        <p className="text-center text-muted text-xs mt-2">
          При подключении к сети черновик будет автоматически синхронизирован
        </p>
      )}
    </div>
  );
}
