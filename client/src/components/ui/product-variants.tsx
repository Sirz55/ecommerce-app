"use client";

import { Button } from "@/components/ui/button";
import { useVariants } from "@/context/variants-context";

interface ProductVariantsProps {
  variants: Record<string, Variant[]>;
}

export function ProductVariants({ variants }: ProductVariantsProps) {
  const { selectedVariants, setSelectedVariant, getVariantPrice, getVariantStock, getVariantImage } = useVariants();

  return (
    <div className="space-y-4">
      {Object.entries(variants).map(([group, options]) => (
        <div key={group} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">{group}</h3>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <Button
                key={option.value}
                variant={selectedVariants[group] === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVariant(group, option.value)}
                disabled={option.disabled}
                className={option.disabled ? "opacity-50 cursor-not-allowed" : ""}
              >
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Variant Information */}
      <div className="mt-4 space-y-2">
        {getVariantPrice() && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Price</span>
            <span className="text-sm font-medium text-gray-900">₹{getVariantPrice()?.toLocaleString()}</span>
          </div>
        )}
        {getVariantStock() !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Stock</span>
            <span className="text-sm font-medium text-gray-900">
              {getVariantStock() === 0 ? "Out of stock" : `${getVariantStock()} available`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
