'use client';

import { WishlistItem } from '@/components/ui/wishlist-item';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import type { CartItemProps } from '@/components/ui/cart-item';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveItem = (id: string) => () => {
    removeFromWishlist(id);
  };

  const handleAddToCart = (item: CartItemProps) => () => {
    addToCart(item);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-sm text-gray-500">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {/* Empty Wishlist State */}
      {wishlistItems.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add items to your wishlist to save them for later
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

      {/* Wishlist Items */}
      {wishlistItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              {...item}
              onRemove={handleRemoveItem(item.id)}
              onAddToCart={handleAddToCart(item)}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8">
        <div className="flex space-x-4">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
          >
            Continue Shopping
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
