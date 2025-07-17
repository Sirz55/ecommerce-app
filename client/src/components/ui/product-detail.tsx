import Image from "next/image";
import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductVariants } from "./product-variants";
import { ProductReviews } from "./product-reviews";
import { RelatedProducts } from "./related-products";
import { Loading } from "./loading";
import { Button } from "./button";
import { useToast } from "./toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  variants: {
    id: string;
    size: string;
    color: string;
    stock: number;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
}

interface ProductDetailProps {
  product: Product | null;
  loading: boolean;
  onAddToCart: (variantId: string, quantity: number) => void;
}

export function ProductDetail({ product, loading, onAddToCart }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a variant",
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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <div className="aspect-video">
          <ProductGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold">${product.price}</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => {
                // Add to wishlist
              }}
            >
              Add to Wishlist
            </Button>
          </div>

          {/* Product Variants */}
          <ProductVariants
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-6">
            <label className="text-sm font-medium">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded-md px-3 py-1"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full mt-6"
            disabled={!selectedVariant}
          >
            Add to Cart
          </Button>

          {/* Product Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Product Specifications */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="space-y-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{spec.label}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews productId={product.id} />
      </div>

      {/* Related Products */}
      <RelatedProducts products={[]} loading={false} />
    </div>
  );
}
