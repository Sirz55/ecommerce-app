"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { WishlistIcon } from "@/components/ui/wishlist-icon";
import { ComparisonIcon } from "@/components/ui/comparison-icon";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Mobiles & Accessories", href: "/products?category=Mobiles" },
  { name: "Laptops & Accessories", href: "/products?category=Laptops" },
  { name: "TVs & Audio", href: "/products?category=TVs" },
  { name: "Wearables", href: "/products?category=Wearables" },
  { name: "Home Appliances", href: "/products?category=Home%20Appliances" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GadgetHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${
                    pathname === item.href ? "font-semibold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <ComparisonIcon />
            <WishlistIcon />
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
