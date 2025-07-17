import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}

export function ProductCard({
  id,
  title,
  price,
  image,
  category,
  rating
}: ProductCardProps) {
  return (
    <div className="group relative h-full w-full rounded-lg bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="mt-4 space-y-2">
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        )}
        <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">${price.toFixed(2)}</p>
        {rating && (
          <div className="flex items-center gap-1">
            <span className="text-sm">{rating}⭐</span>
          </div>
        )}
      </div>
    </div>
  );
}
