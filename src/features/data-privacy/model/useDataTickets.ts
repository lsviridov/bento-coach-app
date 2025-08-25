import { useState } from 'react';
import { toast } from 'sonner';
import { requestDataTicket } from '@/entities/user';

export function useDataTickets() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastTicketId, setLastTicketId] = useState<string | null>(null);

  const requestExport = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await requestDataTicket('export');
      
      if (result.ok) {
        setLastTicketId(result.id);
        toast.success(`Запрос на экспорт данных создан. Тикет: ${result.id}`);
        return true;
      } else {
        toast.error('Не удалось создать запрос на экспорт данных');
        return false;
      }
    } catch (error) {
      console.error('Failed to request data export:', error);
      toast.error('Не удалось создать запрос на экспорт данных');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestDelete = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await requestDataTicket('delete');
      
      if (result.ok) {
        setLastTicketId(result.id);
        toast.success(`Запрос на удаление данных создан. Тикет: ${result.id}`);
        return true;
      } else {
        toast.error('Не удалось создать запрос на удаление данных');
        return false;
      }
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      toast.error('Не удалось создать запрос на удаление данных');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearLastTicket = () => {
    setLastTicketId(null);
  };

  return {
    isLoading,
    lastTicketId,
    requestExport,
    requestDelete,
    clearLastTicket,
  };
}
