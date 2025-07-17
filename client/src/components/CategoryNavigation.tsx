'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function CategoryNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  // Only show category navigation on the products page
  if (pathname !== '/products') return null;

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        href="/products"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          !currentCategory ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        All Products
      </Link>
      <Link
        href="/products?category=Mobiles"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          currentCategory === 'Mobiles' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Mobiles
      </Link>
      <Link
        href="/products?category=Laptops"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          currentCategory === 'Laptops' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Laptops
      </Link>
      <Link
        href="/products?category=TVs"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          currentCategory === 'TVs' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        TVs
      </Link>
    </nav>
  );
}
