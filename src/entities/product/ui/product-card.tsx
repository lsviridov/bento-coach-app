import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export const ProductCard = ({ product, onAddToCart, className }: ProductCardProps) => {
  return (
    <div className={cn(
      "glass rounded-lg p-4 border border-brand-50/50",
      "hover:shadow-soft hover:scale-[1.01] transition-medium",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-brand-50 flex items-center justify-center overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23CBF3F0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%232EC4B6' font-size='24'%3E💊%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {product.title}
          </h3>
          <p className="text-brand font-medium text-sm mt-1">
            {product.price}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAddToCart?.(product.id)}
          className="shrink-0 border-brand text-brand hover:bg-brand hover:text-primary-foreground"
        >
          В корзину
        </Button>
      </div>
    </div>
  );
};