import { StatsCard } from "@/entities/daily-stats/ui/stats-card";
import { cn } from "@/lib/utils";

interface DailySummaryData {
  water: number;
  protein: number;
  protocol: number;
}

interface DailySummaryProps {
  data?: DailySummaryData;
  className?: string;
}

export const DailySummary = ({ data, className }: DailySummaryProps) => {
  // Default data for loading state
  const stats = data || { water: 0.65, protein: 0.40, protocol: 0.80 };

  const handleStatsClick = (type: string) => {
    console.log(`Opening ${type} details`);
    // TODO: Navigate to specific tracking page
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="font-display text-lg font-semibold text-foreground px-1">
        Сегодня
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        <StatsCard
          title="Вода"
          progress={stats.water}
          caption="2.1л / 3.2л"
          onClick={() => handleStatsClick('water')}
        />
        
        <StatsCard
          title="Белок"
          progress={stats.protein}
          caption="60г / 150г"
          onClick={() => handleStatsClick('protein')}
        />
        
        <StatsCard
          title="Протокол"
          progress={stats.protocol}
          caption="4 / 5 приёмов"
          onClick={() => handleStatsClick('protocol')}
        />
      </div>
    </div>
  );
};