import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoActionsProps {
  onPhotoAnalyze?: () => void;
  onManualAdd?: () => void;
  className?: string;
}

export const PhotoActions = ({ onPhotoAnalyze, onManualAdd, className }: PhotoActionsProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <Button 
        onClick={onPhotoAnalyze}
        size="lg"
        className={cn(
          "w-full rounded-pill bg-brand hover:bg-brand/90",
          "text-primary-foreground font-medium shadow-soft",
          "hover:shadow-neon hover:scale-[1.02] transition-medium"
        )}
      >
        <Camera className="w-5 h-5 mr-2" />
        По фото
      </Button>
      
      <Button 
        onClick={onManualAdd}
        variant="ghost"
        size="lg" 
        className={cn(
          "w-full rounded-pill text-muted-foreground",
          "hover:text-foreground hover:bg-brand-50/20 transition-medium"
        )}
      >
        <Plus className="w-4 h-4 mr-2" />
        Добавить приём
      </Button>
    </div>
  );
};