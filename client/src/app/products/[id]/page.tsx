'use client';


import { ProductCard } from '@/components/ui/product-card';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  description: string;
  specifications: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    storage: string;
    color: string;
  };
  images: string[];
  relatedProducts: {
    id: string;
    title: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
  }[];
}

// Mock data for demonstration
const products: Product[] = [
  {
    id: '1',
    title: 'Apple iPhone 14 Pro Max',
    price: 129999,
    oldPrice: 152999,
    discount: 15,
    rating: 4.8,
    reviews: 2500,
    description: `The iPhone 14 Pro Max is Apple's latest flagship smartphone, featuring a 6.7-inch Super Retina XDR display, A16 Bionic chip, and triple-camera system with 48MP main camera. It supports 5G connectivity and has a Ceramic Shield front cover for enhanced durability. The device runs iOS 16 and is available in multiple colors.`,
    specifications: {
      display: '6.7-inch Super Retina XDR OLED',
      processor: 'A16 Bionic',
      camera: '48MP + 12MP + 12MP',
      battery: '4323mAh',
      storage: '128GB, 256GB, 512GB',
      color: 'Deep Purple, Gold, Silver, Space Black'
    },
    images: [
      '/images/products/iphone-14-pro-max/gallery-1.jpg',
      '/images/products/iphone-14-pro-max/gallery-2.jpg',
      '/images/products/iphone-14-pro-max/gallery-3.jpg',
      '/images/products/iphone-14-pro-max/gallery-4.jpg'
    ],
    relatedProducts: [
      {
        id: '2',
        title: 'Samsung Galaxy S23 Ultra',
        price: 119999,
        image: '/images/products/samsung-galaxy-s23-ultra/main.jpg',
        rating: 4.7,
        reviews: 1800
      },
      {
        id: '3',
        title: 'Google Pixel 7 Pro',
        price: 89999,
        image: '/images/products/google-pixel-7-pro/main.jpg',
        rating: 4.5,
        reviews: 1500
      }
    ]
  },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedColor, setSelectedColor] = useState('Deep Purple');
  const [selectedStorage, setSelectedStorage] = useState('128GB');
  const [activeTab, setActiveTab] = useState('description');

  // Use React.use() to access params in Next.js 14
  const id = React.use(params).id;

  // Find the product based on ID
  const currentProduct = products.find(p => p.id === id);

  if (!currentProduct) {
    return <div>Product not found</div>;
  }

  // Extract colors and storage options from product description
  const colors = currentProduct.specifications.color.split(', ').map(color => color.trim());
  const storageOptions = currentProduct.specifications.storage.split(', ').map(storage => storage.trim());

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', {
      id: currentProduct.id,
      title: currentProduct.title,
      price: currentProduct.price,
      image: currentProduct.images[0],
      color: selectedColor,
      storage: selectedStorage
    });
  };

  const handleAddToWishlist = () => {
    // Add to wishlist logic here
    console.log('Adding to wishlist:', {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0]
    });
  };

  const handleCompare = () => {
    // Compare logic here
    console.log('Comparing:', {
      id: product.id,
      title: product.title,
      price: product.price,
      specifications: product.specifications
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className={cn("mb-8", "lg:mb-0")}>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2">
                  Products
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square">
              <img
                src={currentProduct.images[0]}
                alt={currentProduct.title}
                className="object-cover rounded-lg w-full h-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {currentProduct.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`${currentProduct.title} - ${index + 1}`}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < currentProduct.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>

          {/* Product Options */}
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="mt-2 flex space-x-3">
                  {Object.values(product.specifications.color).map((color, index) => (
                  <button
                    key={`color-${index}-${color.replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all duration-200',
                      selectedColor === color
                        ? 'border-[#232F3E] bg-[#232F3E] text-white'
                        : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                    )}
                  >
                    {color}
                  </button>
                ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Storage</label>
                <div className="mt-2 flex space-x-3">
                  {['128GB', '256GB', '512GB', '1TB'].map((storage, index) => (
                    <button
                      key={`storage-${index}-${storage}`}
                      onClick={() => setSelectedStorage(storage)}
                      className={cn(
                        'px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200',
                        selectedStorage === storage
                          ? 'border-[#232F3E] bg-[#232F3E] text-white'
                          : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                      )}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#232F3E] text-white py-4 px-6 rounded-md hover:bg-[#1a1e23] transition-colors"
            >
              Add to Cart
            </button>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddToWishlist}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">Add to Wishlist</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCompare}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">Compare</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-500">Get it by Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Available in your area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setSelectedTab('description')}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                selectedTab === 'description' ? 'border-[#232F3E] text-[#232F3E]' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              Description
            </button>
            <button
              onClick={() => setSelectedTab('specifications')}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                selectedTab === 'specifications' ? 'border-[#232F3E] text-[#232F3E]' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              Specifications
            </button>
            <button
              onClick={() => setSelectedTab('reviews')}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                selectedTab === 'reviews' ? 'border-[#232F3E] text-[#232F3E]' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {selectedTab === 'description' ? (
            <p className="text-base text-gray-700">{product.description}</p>
          ) : selectedTab === 'specifications' ? (
            <div className="border-t border-b border-gray-200 py-6">
              <dl className="grid grid-cols-2 gap-8">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-4">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">No reviews yet</p>
              <button className="text-sm font-medium text-[#232F3E] hover:text-[#1a1e23]">
                Write a review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.relatedProducts.map((related) => (
            <ProductCard
              key={related.id}
              id={related.id}
              title={related.title}
              price={related.price}
              image={related.image}
              rating={related.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
