"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="space-y-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Thank you for your order
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => router.push('/')}
              className="px-8 py-3 text-base font-medium text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
