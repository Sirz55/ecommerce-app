"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/wishlist-context";

export function WishlistIcon() {
  const { wishlistItems } = useWishlist();
  const itemCount = wishlistItems.length;

  return (
    <Link href="/wishlist" className="relative group">
      <Heart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
