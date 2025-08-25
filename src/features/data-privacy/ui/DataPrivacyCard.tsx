import { Button } from '@/components/ui/button';
import { SectionCard } from '@/shared/ui/section-card';
import { Badge } from '@/components/ui/badge';
import { useDataTickets } from '../model/useDataTickets';
import { Download, Trash2, FileText, AlertTriangle } from 'lucide-react';

export function DataPrivacyCard() {
  const { isLoading, lastTicketId, requestExport, requestDelete, clearLastTicket } = useDataTickets();

  const handleExport = async () => {
    await requestExport();
  };

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить все ваши данные? Это действие нельзя отменить.')) {
      await requestDelete();
    }
  };

  return (
    <SectionCard variant="elevated" size="lg">
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
          Данные и приватность
        </h3>
        <p className="text-xs sm:text-sm text-muted">
          Управляйте своими данными и настройками приватности
        </p>

        {/* Export Data */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-brand/5 border border-brand/20 rounded-lg space-y-3 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Download className="h-4 w-4 sm:h-5 sm:w-5 text-brand mt-0.5 sm:mt-0 flex-shrink-0" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <h4 className="text-xs sm:text-sm font-medium text-ink break-words">Экспорт данных</h4>
                <p className="text-xs text-muted leading-relaxed break-words">
                  Получите копию всех ваших данных в удобном формате
                </p>
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-brand text-brand hover:bg-brand hover:text-white w-full sm:w-auto text-xs sm:text-sm flex-shrink-0"
            >
              {isLoading ? 'Запрос...' : 'Экспорт'}
            </Button>
          </div>

          {/* Delete Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-destructive/5 border border-destructive/20 rounded-lg space-y-3 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mt-0.5 sm:mt-0 flex-shrink-0" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <h4 className="text-xs sm:text-sm font-medium text-ink break-words">Удаление данных</h4>
                <p className="text-xs text-muted leading-relaxed break-words">
                  Полностью удалите все ваши данные из системы
                </p>
              </div>
            </div>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive hover:text-white w-full sm:w-auto text-xs sm:text-sm flex-shrink-0"
            >
              {isLoading ? 'Запрос...' : 'Удалить'}
            </Button>
          </div>
        </div>

        {/* Ticket Status */}
        {lastTicketId && (
          <div className="p-3 sm:p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                  <Badge variant="default" className="bg-success text-white text-xs">
                    Тикет создан
                  </Badge>
                  <span className="text-xs sm:text-sm font-mono text-success break-all">
                    {lastTicketId}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-success/80 leading-relaxed">
                  Мы свяжемся с вами в ближайшее время для обработки запроса.
                </p>
                <Button
                  onClick={clearLastTicket}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-success hover:text-success/80 hover:bg-success/10 text-xs sm:text-sm"
                >
                  Скрыть
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="p-3 bg-muted/10 border border-muted/20 rounded-lg">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted leading-relaxed">
                Все запросы обрабатываются вручную службой поддержки для обеспечения безопасности ваших данных.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
