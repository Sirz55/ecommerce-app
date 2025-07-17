import { Suspense } from "react";
import { ProductGrid } from "@/components/ui/product-grid";
import { CategoryFilters } from "@/components/ui/category-filters";
import { Loading } from "@/components/ui/loading";

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <CategoryFilters category={params.category} />
        </div>
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-6">{params.category}</h1>
          <Suspense fallback={<Loading />}>
            <ProductGrid category={params.category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
