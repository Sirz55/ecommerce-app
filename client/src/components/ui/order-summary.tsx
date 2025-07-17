import { useState } from "react";
import { Button } from "./button";
import { CouponCode } from "./coupon-code";
import { Loading } from "./loading";
import { useToast } from "./toast";

interface OrderSummaryProps {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  discount,
  total,
  onRemoveItem,
  onPlaceOrder,
}: OrderSummaryProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await onPlaceOrder();
      toast({
        title: "Success",
        description: "Order placed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.variant}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">x{item.quantity}</span>
              <span className="font-medium">${item.price}</span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="mt-6">
        <CouponCode onApply={(code) => console.log(code)} />
      </div>

      {/* Price Breakdown */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        className="w-full mt-6"
        disabled={loading}
      >
        {loading ? <Loading /> : "Place Order"}
      </Button>
    </div>
  );
}
