'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import { SearchBar } from '@/components/ui/search-bar';
import Link from 'next/link';

// Product data
const products = [
  // Mobiles
  {
    id: '1',
    title: 'Apple iPhone 15 Pro',
    price: 149999,
    image: '/images/iphone-15.jpeg',
    rating: 4.8,
    discount: 15,
    category: 'Mobiles',
    inStock: true,
    isNew: true,
  },
  {
    id: '2',
    title: 'Samsung Galaxy S24 Ultra',
    price: 129999,
    image: '/images/Samsung Galaxy S24 Ultra.jpg',
    rating: 4.8,
    discount: 12,
    category: 'Mobiles',
    inStock: true,
  },
  {
    id: '3',
    title: 'OnePlus 11',
    price: 64999,
    image: '/images/oneplus-11.png',
    rating: 4.7,
    discount: 10,
    category: 'Mobiles',
    inStock: true,
  },
  {
    id: '4',
    title: 'AirPods Pro (2nd Gen)',
    price: 24990,
    image: '/images/airpods-pro.jpeg',
    rating: 4.8,
    discount: 5,
    category: 'Mobiles',
    inStock: true,
  },
  // Laptops & Accessories
  {
    id: '5',
    title: 'MacBook Pro M2',
    price: 199999,
    image: '/images/macbook-pro-m2.jpeg',
    rating: 4.9,
    discount: 20,
    category: 'Laptops',
    inStock: true,
  },
  {
    id: '6',
    title: 'Dell XPS 13',
    price: 149990,
    image: '/images/dell-xps13.jpg',
    rating: 4.7,
    discount: 15,
    category: 'Laptops',
    inStock: true,
  },
  {
    id: '9',
    title: 'Logitech MX Master 3',
    price: 8999,
    image: '/images/mx-master-3.png',
    rating: 4.8,
    discount: 10,
    category: 'Laptops',
    inStock: true,
  },
  // TVs & Audio
  {
    id: '7',
    title: 'Samsung QLED 4K TV',
    price: 149999,
    image: '/images/samsung-qled-tv.jpeg',
    rating: 4.6,
    discount: 15,
    category: 'TVs',
    inStock: true,
  },
  {
    id: '8',
    title: 'Sony WH-1000XM5',
    price: 34990,
    image: '/images/sony-wh1000xm5.webp',
    rating: 4.9,
    discount: 12,
    category: 'TVs',
    inStock: true,
  },
  {
    id: '10',
    title: 'Samsung Soundbar HW-Q800A',
    price: 54990,
    image: '/images/samsung-soundbar.jpg',
    rating: 4.7,
    discount: 8,
    category: 'TVs',
    inStock: true,
  },
  // Additional Mobiles
  {
    id: '11',
    title: 'Samsung Galaxy S24',
    price: 109999,
    image: '/images/samsung-s24.jpeg',
    rating: 4.7,
    discount: 10,
    category: 'Mobiles',
    inStock: true,
    isNew: true,
  },
  // Wearables
  {
    id: '12',
    title: 'Apple Watch Series 9',
    price: 45990,
    image: '/images/apple-watch-9.jpg',
    rating: 4.7,
    discount: 8,
    category: 'Wearables',
    inStock: true,
    isNew: true,
  },
  {
    id: '13',
    title: 'Samsung Galaxy Watch 6',
    price: 34990,
    image: '/images/samsung-watch-6.jpg',
    rating: 4.6,
    discount: 5,
    category: 'Wearables',
    inStock: true,
  },
  // Home Appliances
  {
    id: '14',
    title: 'Samsung Robot Vacuum',
    price: 54990,
    image: '/images/samsung-robot-vacuum.jpg',
    rating: 4.5,
    discount: 12,
    category: 'Home Appliances',
    inStock: true,
  },
  {
    id: '15',
    title: 'Air Purifier Pro',
    price: 24990,
    image: '/images/air-purifier-pro.jpg',
    rating: 4.4,
    discount: 10,
    category: 'Home Appliances',
    inStock: true,
  },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get category from searchParams
  const category = searchParams?.get('category') || '';

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <div className="flex gap-4">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/products"
            className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
              !category 
                ? 'bg-blue-600 text-white border-blue-600 font-medium' 
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            All Products
          </Link>
          {[
            { name: 'Mobiles & Accessories', value: 'Mobiles' },
            { name: 'Laptops & Accessories', value: 'Laptops' },
            { name: 'TVs & Audio', value: 'TVs' },
            { name: 'Wearables', value: 'Wearables' },
            { name: 'Home Appliances', value: 'Home Appliances' },
          ].map((cat) => (
            <Link 
              key={cat.value}
              href={`/products?category=${encodeURIComponent(cat.value)}`}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                category === cat.value
                  ? 'bg-blue-600 text-white border-blue-600 font-medium' 
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              category={product.category}
              rating={product.rating}
              discount={product.discount}
              inStock={product.inStock}
              isNew={product.isNew}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
