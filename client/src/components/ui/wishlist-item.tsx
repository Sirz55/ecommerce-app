"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface WishlistItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  inStock: boolean;
  onRemove: () => void;
  onAddToCart: () => void;
}

export function WishlistItem({
  id,
  title,
  price,
  image,
  rating,
  reviews,
  discount,
  inStock,
  onRemove,
  onAddToCart,
}: WishlistItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative w-24 h-24">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {title}
          </h3>
          
          {/* Rating and Reviews */}
          {rating && reviews && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
              <span>{rating}⭐</span>
              <span>({reviews})</span>
            </div>
          )}

          {/* Price and Discount */}
          <div className="mt-2">
            <p className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</p>
            {discount && (
              <p className="text-sm text-gray-500 line-through">
                ₹{(price / (1 - discount / 100)).toLocaleString()}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-2">
            <Badge
              variant={inStock ? "default" : "destructive"}
              className="text-xs"
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
