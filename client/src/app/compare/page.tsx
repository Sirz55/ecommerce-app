import { ProductCard } from '@/components/ui/product-card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

// Mock product data for comparison
const products = [
  {
    id: '1',
    title: 'Apple iPhone 14 Pro Max',
    price: 129999,
    image: '/images/iphone-14.jpg',
    rating: 4.8,
    reviews: 1234,
    specs: {
      display: '6.7-inch Super Retina XDR OLED',
      processor: 'A16 Bionic chip',
      camera: '48MP main camera',
      battery: 'All-day battery life',
      storage: '256GB',
      color: 'Deep Purple',
    },
  },
  {
    id: '2',
    title: 'Samsung Galaxy S23 Ultra',
    price: 119999,
    image: '/images/samsung-s23.jpg',
    rating: 4.7,
    reviews: 987,
    specs: {
      display: '6.8-inch Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 2',
      camera: '200MP main camera',
      battery: '5000mAh battery',
      storage: '512GB',
      color: 'Phantom Black',
    },
  },
];

export default function ComparePage() {
  const [selectedSpecs, setSelectedSpecs] = useState(['display', 'processor', 'camera', 'battery', 'storage', 'color']);

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Comparison</h1>
        <p className="text-sm text-gray-500">Compare {products.length} products side by side</p>
      </div>

      {/* Spec Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Specifications to Compare</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(products[0].specs).map((spec) => (
            <button
              key={spec}
              onClick={() => toggleSpec(spec)}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                selectedSpecs.includes(spec)
                  ? "bg-[#232F3E] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {spec.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm">
            {/* Product Card */}
            <ProductCard
              {...product}
              onQuantityChange={() => {}}
              onRemove={() => {}}
            />

            {/* Specifications */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-4">
                {Object.entries(product.specs)
                  .filter(([key]) => selectedSpecs.includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-[#232F3E] text-white rounded-md hover:bg-[#1a1e23]"
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-4 py-2 bg-white text-[#232F3E] border border-[#232F3E] rounded-md hover:bg-[#232F3E]/5"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Products */}
      <div className="mt-8">
        <div className="flex justify-center">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
          >
            Add More Products
          </button>
        </div>
      </div>
    </div>
  );
}
