import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
  ringClassName?: string;
  glowEffect?: boolean;
}

export const ProgressRing = ({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  children,
  className,
  ringClassName,
  glowEffect = false
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-30 text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500 ease-out text-brand",
            glowEffect && "drop-shadow-[0_0_8px_hsl(var(--brand))]",
            ringClassName
          )}
          style={{
            filter: glowEffect ? `drop-shadow(0 0 8px hsl(var(--brand) / 0.6))` : undefined
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};