import { ProductCard } from "./product-card";
import { Loading } from "./loading";

interface RelatedProductsProps {
  products: any[];
  loading: boolean;
}

export function RelatedProducts({ products, loading }: RelatedProductsProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <Loading />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
