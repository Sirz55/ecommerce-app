import { Suspense } from "react";
import { ProductGrid } from "@/components/ui/product-grid";
import { SearchFilters } from "@/components/ui/search-filters";
import { Loading } from "@/components/ui/loading";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <SearchFilters query={query} />
        </div>
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
          <Suspense fallback={<Loading />}>
            <ProductGrid searchQuery={query} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
