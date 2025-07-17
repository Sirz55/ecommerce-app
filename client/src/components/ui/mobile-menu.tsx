import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { CategoryMenu } from "./category-menu";

interface MobileMenuProps {
  categories: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ categories, isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="bg-white h-full flex flex-col">
        {/* Header */}
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-4">
          {/* Categories */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Categories</h3>
            <CategoryMenu categories={categories} />
          </div>

          {/* Pages */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-2">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${
          isOpen ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onClick={onClose}
      />
    </div>
  );
}
