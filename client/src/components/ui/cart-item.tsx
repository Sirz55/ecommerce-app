'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface CartItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  inStock: boolean;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
};

export const CartItem = ({
  title,
  price,
  image,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">₹{price.toLocaleString('en-IN')}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => onQuantityChange(quantity - 1)} disabled={quantity <= 1}>
            <Minus className="w-4 h-4" />
          </button>
          <span>{quantity}</span>
          <button onClick={() => onQuantityChange(quantity + 1)}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onRemove} className="text-red-600 text-sm mt-2 flex items-center">
          <Trash2 className="w-4 h-4 mr-1" /> Remove
        </button>
      </div>
    </div>
  );
};
