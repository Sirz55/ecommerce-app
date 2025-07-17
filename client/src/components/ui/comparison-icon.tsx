"use client";

import { Scale } from "lucide-react";
import Link from "next/link";
import { useComparison } from "@/context/comparison-context";

export function ComparisonIcon() {
  const { comparedItems } = useComparison();
  const itemCount = comparedItems.length;

  return (
    <Link href="/comparison" className="relative group">
      <Scale className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
