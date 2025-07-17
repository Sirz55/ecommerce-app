"use client";

import { ComparisonItem } from "@/components/ui/comparison-item";
import { useComparison } from "@/context/comparison-context";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Scale } from "lucide-react";

export default function ComparisonPage() {
  const { comparedItems, removeFromComparison, clearComparison, maxItems } = useComparison();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Comparison</h1>
        <p className="text-sm text-gray-500">
          Compare up to {maxItems} products side by side
        </p>
      </div>

      {/* Empty State */}
      {comparedItems.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <Scale className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products to compare
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add products to compare their features and prices
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      {comparedItems.length > 0 && (
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Product Info */}
          <div className="col-span-4">
            <div className="space-y-6">
              {comparedItems.map((item) => (
                <ComparisonItem
                  key={item.id}
                  {...item}
                  onRemove={removeFromComparison}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Comparison Table */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <button
                  onClick={clearComparison}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all comparisons
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Features
                      </th>
                      {comparedItems.map((item) => (
                        <th
                          key={item.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Price */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Price
                      </td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rating
                      </td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.rating || 0}⭐
                        </td>
                      ))}
                    </tr>

                    {/* Reviews */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Reviews
                      </td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.reviews || 0}
                        </td>
                      ))}
                    </tr>

                    {/* Stock Status */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Stock Status
                      </td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge
                            variant={item.inStock ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
