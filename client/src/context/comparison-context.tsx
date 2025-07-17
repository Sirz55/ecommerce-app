"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  inStock: boolean;
}

interface ComparisonContextType {
  comparedItems: CartItem[];
  addToComparison: (item: CartItem) => void;
  removeFromComparison: (id: string) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparedItems, setComparedItems] = useState<CartItem[]>([]);
  const maxItems = 4; // Maximum items that can be compared

  const addToComparison = (item: CartItem) => {
    if (comparedItems.length >= maxItems) {
      return;
    }
    if (!comparedItems.some((comparedItem) => comparedItem.id === item.id)) {
      setComparedItems([...comparedItems, item]);
    }
  };

  const removeFromComparison = (id: string) => {
    setComparedItems(comparedItems.filter((item) => item.id !== id));
  };

  const isInComparison = (id: string) => {
    return comparedItems.some((item) => item.id === id);
  };

  const clearComparison = () => {
    setComparedItems([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparedItems,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
        maxItems,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
