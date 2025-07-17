"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number;
  image?: string;
  stock?: number;
  disabled?: boolean;
}

interface SelectedVariant {
  [key: string]: string;
}

interface VariantsContextType {
  variants: Record<string, Variant[]>;
  selectedVariants: SelectedVariant;
  initializeVariants: (newVariants: Record<string, Variant[]>) => void;
  setSelectedVariant: (variantGroup: string, variantValue: string) => void;
  resetVariants: () => void;
  getVariantPrice: () => number | undefined;
  getVariantStock: () => number | undefined;
  getVariantImage: () => string | undefined;
}

const VariantsContext = createContext<VariantsContextType | undefined>(undefined);

export function VariantsProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<Record<string, Variant[]>>({});
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant>({});

  const initializeVariants = (newVariants: Record<string, Variant[]>) => {
    setVariants(newVariants);
    // Reset selected variants when new variants are initialized
    setSelectedVariants({});
  };

  const setSelectedVariant = (variantGroup: string, variantValue: string) => {
    if (!variants[variantGroup]) return;
    
    setSelectedVariants((prev) => ({
      ...prev,
      [variantGroup]: variantValue,
    }));
  };

  const resetVariants = () => {
    setSelectedVariants({});
  };

  const getVariantPrice = () => {
    const selected = Object.entries(selectedVariants);
    if (selected.length === 0) return undefined;

    const variant = selected.reduce((acc, [group, value]) => {
      const groupVariants = variants[group];
      if (!groupVariants) return acc;
      
      const variant = groupVariants.find((v) => v.value === value);
      if (!variant) return acc;
      
      return variant.price || acc;
    }, 0);

    return variant;
  };

  const getVariantStock = () => {
    const selected = Object.entries(selectedVariants);
    if (selected.length === 0) return undefined;

    const variant = selected.reduce((acc, [group, value]) => {
      const groupVariants = variants[group];
      if (!groupVariants) return acc;
      
      const variant = groupVariants.find((v) => v.value === value);
      if (!variant) return acc;
      
      return variant.stock || acc;
    }, 0);

    return variant;
  };

  const getVariantImage = () => {
    const selected = Object.entries(selectedVariants);
    if (selected.length === 0) return undefined;

    const variant = selected.reduce((acc, [group, value]) => {
      const groupVariants = variants[group];
      if (!groupVariants) return acc;
      
      const variant = groupVariants.find((v) => v.value === value);
      if (!variant) return acc;
      
      return variant.image || acc;
    }, "");

    return variant;
  };

  return (
    <VariantsContext.Provider
      value={{
        variants,
        selectedVariants,
        initializeVariants,
        setSelectedVariant,
        resetVariants,
        getVariantPrice,
        getVariantStock,
        getVariantImage,
      }}
    >
      {children}
    </VariantsContext.Provider>
  );
}

export function useVariants() {
  const context = useContext(VariantsContext);
  if (context === undefined) {
    throw new Error("useVariants must be used within a VariantsProvider");
  }
  return context;
}
