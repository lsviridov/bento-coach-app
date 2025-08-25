import { cn } from '@/lib/utils';

interface ProductPriceProps {
  price: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductPrice({ price, className, size = 'md' }: ProductPriceProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <span className={cn(
      'font-semibold text-ink',
      sizeClasses[size],
      className
    )}>
      {price} BYN
    </span>
  );
}
