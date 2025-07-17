import Link from "next/link";
import Image from "next/image";

export default function EmptyCartPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto text-center">
        <Image
          src="/empty-cart.svg"
          alt="Empty cart"
          width={200}
          height={200}
          className="mx-auto mb-8"
        />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Your shopping cart is currently empty. Start adding some items to it now.
        </p>
        <Link
          href="/products"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
