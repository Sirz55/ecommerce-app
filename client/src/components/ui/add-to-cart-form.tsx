import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select } from "./select";
import { useToast } from "./toast";

interface AddToCartFormProps {
  variants: {
    id: string;
    size: string;
    color: string;
    stock: number;
  }[];
  onAddToCart: (variantId: string, quantity: number) => void;
}

export function AddToCartForm({ variants, onAddToCart }: AddToCartFormProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a variant",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    const selected = variants.find((v) => v.id === selectedVariant);
    if (!selected || selected.stock < quantity) {
      toast({
        title: "Error",
        description: "Insufficient stock",
        variant: "destructive",
      });
      return;
    }

    onAddToCart(selectedVariant, quantity);
    toast({
      title: "Success",
      description: "Product added to cart",
    });
  };

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      <div>
        <Label>Variant</Label>
        <Select
          value={selectedVariant}
          onValueChange={setSelectedVariant}
          placeholder="Select a variant"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.size} - {variant.color} (Stock: {variant.stock})
            </option>
          ))}
        </Select>
      </div>

      {/* Quantity */}
      <div>
        <Label>Quantity</Label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            -
          </button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={100}
            className="flex-1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!selectedVariant || quantity <= 0}
        className="w-full"
      >
        Add to Cart
      </Button>
    </div>
  );
}
