import { ProductCard } from "@/entities/product/ui/product-card";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface ShopHighlightProps {
  product?: Product;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export const ShopHighlight = ({ product, onAddToCart, className }: ShopHighlightProps) => {
  // Default product for demo
  const defaultProduct = {
    id: '1',
    title: 'Нуклеамин',
    price: '49.00 BYN',
    image: '/api/placeholder/64/64'
  };

  const productData = product || defaultProduct;

  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="font-display text-lg font-semibold text-foreground px-1">
        Рекомендуем
      </h2>
      
      <ProductCard 
        product={productData}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};