import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'brand' | 'accent';
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ className, variant = 'default', glow = false, size = 'md', ...props }, ref) => {
    const baseClasses = "rounded-xl border transition-all duration-200";
    
    const sizeClasses = {
      sm: "p-2 sm:p-3",
      md: "p-3 sm:p-4", 
      lg: "p-4 sm:p-6"
    };

    const variantClasses = {
      default: "bg-surface text-ink border-border shadow-sm hover:shadow-md",
      elevated: "bg-surface text-ink border-border shadow-lg hover:shadow-xl",
      glass: "backdrop-blur-lg bg-surface/80 dark:bg-surface/55 border-border/50 shadow-soft",
      gradient: "bg-gradient-to-br from-surface to-surface-100 text-ink border-border/50 shadow-soft",
      brand: "bg-gradient-to-br from-brand-50 to-brand-100 text-brand-900 dark:text-brand-100 border-brand-200 dark:border-brand-800 shadow-accent",
      accent: "bg-gradient-to-br from-accent-50 to-accent-100 text-accent-900 dark:text-accent-100 border-accent-200 dark:border-accent-800 shadow-accent"
    };

    const glowClasses = glow ? "relative overflow-hidden" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          glowClasses,
          className
        )}
        {...props}
      >
        {glow && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 blur-2xl bg-brand/10 dark:bg-brand/20"
          />
        )}
        <div className={cn(glow && "relative z-10")}>
          {props.children}
        </div>
      </div>
    );
  }
);

SectionCard.displayName = 'SectionCard';
