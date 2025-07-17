"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Filter {
  id: string;
  name: string;
  values: string[];
}

interface FiltersProps {
  onApplyFilters: (filters: Record<string, string[]>) => void;
}

const filters: Filter[] = [
  {
    id: "category",
    name: "Category",
    values: ["Mobiles", "Laptops", "TVs", "Headphones", "Watches"],
  },
  {
    id: "price",
    name: "Price",
    values: ["Under ₹10,000", "₹10,000 - ₹50,000", "Above ₹50,000"],
  },
  {
    id: "rating",
    name: "Rating",
    values: ["4★ & above", "3★ & above", "2★ & above"],
  },
  {
    id: "brand",
    name: "Brand",
    values: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Google"],
  },
];

export function Filters({ onApplyFilters }: FiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterId]?.includes(value)) {
        newFilters[filterId] = newFilters[filterId].filter((v) => v !== value);
        if (newFilters[filterId].length === 0) {
          delete newFilters[filterId];
        }
      } else {
        newFilters[filterId] = [...(newFilters[filterId] || []), value];
      }
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(activeFilters);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Active Filters Display */}
      {Object.entries(activeFilters).length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(activeFilters).map(([filterId, values]) =>
              values.map((value) => (
                <Badge
                  key={`${filterId}-${value}`}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleFilterChange(filterId, value)}
                >
                  {value}
                </Badge>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      {filters.map((filter) => (
        <div key={filter.id} className="mb-4">
          <h4 className="text-sm font-medium mb-2">{filter.name}</h4>
          <div className="space-y-1">
            {filter.values.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeFilters[filter.id]?.includes(value)}
                  onChange={() => handleFilterChange(filter.id, value)}
                  className="rounded"
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
