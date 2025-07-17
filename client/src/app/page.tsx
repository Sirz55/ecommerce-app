"use client";

import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
  {
    id: "1",
    title: "iPhone 15 Pro",
    price: 149999,
    image: "/images/iphone-15.jpeg",
    category: "Mobiles",
  },
  {
    id: "2",
    title: "Samsung Galaxy S24",
    price: 139999,
    image: "/images/samsung-s24.jpeg",
    category: "Mobiles",
  },
  {
    id: "3",
    title: "MacBook Pro M2",
    price: 199999,
    image: "/images/macbook-pro-m2.jpeg",
    category: "Laptops",
  },
];

const categories = [
  { id: "1", name: "Mobiles", icon: "📱" },
  { id: "2", name: "Laptops", icon: "💻" },
  { id: "3", name: "TVs", icon: "📺" },
  { id: "4", name: "Headphones", icon: "🎧" },
  { id: "5", name: "Smart Watches", icon: "⌚" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 py-32">
          <h1 className="text-5xl font-bold text-white mb-6">
            Discover Your Perfect Gadget
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Explore our wide range of latest gadgets and electronics at unbeatable prices
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">{category.icon} {category.name}</h3>
                  <p className="text-gray-600">Explore our collection</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
            <p className="text-xl text-gray-600 mb-8">
              Check out our latest deals and discounts
            </p>
            <Link
              href="/deals"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Deals
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
