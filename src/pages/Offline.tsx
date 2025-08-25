import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';
import { PageLayout } from '@/shared';

const Offline = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <PageLayout showBottomNav={false}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Нет подключения
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Проверьте подключение к интернету и попробуйте снова
          </p>
          
          <Button 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Offline;