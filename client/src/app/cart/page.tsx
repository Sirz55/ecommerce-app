'use client';

import { CartItem } from '@/components/ui/cart-item';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { FormattedPrice } from '@/components/FormattedPrice';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-sm text-gray-500">{cartItems.length} items in your cart</p>
      </div>

      {/* Empty Cart Message */}
      {cartItems.length === 0 && (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding items to your cart.</p>
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

      {/* Cart Items */}
      {cartItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Cart Totals</h2>
            <div className="border-t border-gray-200">
              <div className="flex justify-between py-4">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  <FormattedPrice amount={total} />
                </p>
              </div>
              <div className="flex justify-between py-4">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="text-sm font-medium text-gray-900">Free</p>
              </div>
              <div className="flex justify-between py-4">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-sm font-medium text-gray-900">
                  <FormattedPrice amount={total} />
                </p>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mt-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 min-w-0 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#232F3E] focus:ring-[#232F3E] sm:text-sm"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Continue Shopping Button */}
      <div className="mt-8">
        <Link
          href="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#232F3E] bg-white hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
