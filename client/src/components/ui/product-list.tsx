import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

export function ProductList({ products, loading }: ProductListProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b last:border-b-0"
          >
            <div className="w-20 h-20 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
        >
          <div className="relative w-20 h-20">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-gray-600 line-clamp-2">{product.description}</p>
            <div className="mt-2">
              <span className="font-semibold">${product.price}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
