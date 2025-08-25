import { ProgressRing } from "@/shared/ui/progress-ring";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  progress: number; // 0-1
  caption?: string;
  onClick?: () => void;
  className?: string;
}

export const StatsCard = ({ title, progress, caption, onClick, className }: StatsCardProps) => {
  const progressPercent = Math.round(progress * 100);

  return (
    <div 
      className={cn(
        "glass rounded-lg p-4 transition-medium cursor-pointer",
        "hover:shadow-soft hover:scale-[1.02] active:scale-[0.98]",
        "border border-brand-50/50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <ProgressRing 
          progress={progress} 
          size={64} 
          strokeWidth={5}
          glowEffect={progress > 0.7}
        >
          <span className="text-sm font-medium text-foreground">
            {progressPercent}%
          </span>
        </ProgressRing>
        
        <div className="text-center">
          <h3 className="font-semibold text-sm text-foreground">
            {title}
          </h3>
          {caption && (
            <p className="text-xs text-muted-foreground mt-1">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};