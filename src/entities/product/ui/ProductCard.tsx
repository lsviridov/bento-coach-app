import { ProductT } from '../model/schemas';
import { ProductPrice } from './ProductPrice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductT;
  onAddToCart: (product: ProductT) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const navigate = useNavigate();
  
  const categoryLabels = {
    peptides: 'Пептиды',
    supplements: 'Добавки'
  };

  const categoryColors = {
    peptides: 'bg-brand-50 text-brand border-brand/20',
    supplements: 'bg-accent/10 text-accent border-accent/20'
  };

  return (
    <div className={cn(
      'group bg-surface rounded-2xl shadow-sm hover:shadow-neon dark:hover:shadow-neon-dark',
      'border border-[color-mix(in_oklab,var(--muted)_15%,transparent)]',
      'p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1',
      'flex flex-col h-full',
      className
    )}>
      {/* Image Container with Actions */}
      <div className="relative mb-3">
        <div 
          className="aspect-[4/5] rounded-xl bg-muted/10 overflow-hidden cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center"
          onClick={() => navigate(`/shop/${product.slug}`)}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted bg-gradient-to-br from-muted/20 to-muted/10">
              {/* SVG Bottle Icon */}
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 120 120" 
                className="text-muted/60"
                fill="currentColor"
              >
                {/* Bottle Body */}
                <path d="M30 20 L30 100 Q30 110 40 110 L80 110 Q90 110 90 100 L90 20 Q90 15 85 15 L35 15 Q30 15 30 20 Z" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"/>
                
                {/* Bottle Neck */}
                <path d="M40 20 L40 30 Q40 35 45 35 L75 35 Q80 35 80 30 L80 20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"/>
                
                {/* Bottle Cap */}
                <rect x="35" y="10" width="50" height="10" rx="5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"/>
                
                {/* Category-specific Icon */}
                {product.category === 'peptides' ? (
                  /* DNA/Peptide Structure */
                  <g>
                    <circle cx="60" cy="50" r="3" fill="currentColor"/>
                    <circle cx="60" cy="70" r="3" fill="currentColor"/>
                    <circle cx="60" cy="90" r="3" fill="currentColor"/>
                    <path d="M60 50 Q65 60 60 70 Q55 80 60 90" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"/>
                    <path d="M60 50 Q55 60 60 70 Q65 80 60 90" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"/>
                  </g>
                ) : (
                  /* Supplement/Vitamin Symbols */
                  <g>
                    <circle cx="60" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M60 42 L60 58 M52 50 L68 50" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="60" cy="80" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M60 74 L60 86 M54 80 L66 80" stroke="currentColor" strokeWidth="1.5"/>
                  </g>
                )}
              </svg>
            </div>
          )}
        </div>
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white/90 dark:bg-surface/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-surface transition-colors">
            <Heart className="w-4 h-4 text-muted hover:text-danger" />
          </button>
        </div>

        {/* Discount Badge (если есть) - пока скрыто до добавления в схему */}
        {/* {product.discount_percent && (
          <div className="absolute top-2 left-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{product.discount_percent}%
          </div>
        )} */}
      </div>

      {/* Category Badge */}
      <Badge 
        variant="outline" 
        className={cn(
          'w-fit text-xs mb-2',
          categoryColors[product.category]
        )}
      >
        {categoryLabels[product.category]}
      </Badge>

      {/* Title - без обрезки */}
      <h3 
        className="font-medium text-ink text-sm leading-tight cursor-pointer hover:text-brand transition-colors mb-2 flex-1"
        onClick={() => navigate(`/shop/${product.slug}`)}
      >
        {product.title}
      </h3>

      {/* Rating and Reviews (если есть) - пока скрыто до добавления в схему */}
      {/* {product.rating && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(product.rating!) ? "text-warning fill-warning" : "text-muted/30"
                )} 
              />
            ))}
          </div>
          <span className="text-xs text-muted ml-1">
            {product.rating} ({product.reviews_count || 0})
          </span>
        </div>
      )} */}

      {/* Price and Add to Cart */}
      <div className="mt-auto pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <ProductPrice price={product.price_byn} size="sm" />
            {/* Old price - пока скрыто до добавления в схему */}
            {/* {product.old_price && (
              <span className="text-xs text-muted line-through">
                {product.old_price} ₽
              </span>
            )} */}
          </div>
          
          {/* Stock Status */}
          <div className="text-xs text-success font-medium">
            В наличии
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => onAddToCart(product)}
          className="w-full bg-brand hover:bg-brand/90 text-white font-medium py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          В корзину
        </Button>
      </div>
    </div>
  );
}
