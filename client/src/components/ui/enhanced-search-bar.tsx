import { useState, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Select } from "./select";
import { Button } from "./button";
import { useToast } from "./toast";

interface SearchSuggestion {
  id: string;
  title: string;
  type: string;
}

interface EnhancedSearchBarProps {
  onSearch: (query: string, filters: any) => void;
}

export function EnhancedSearchBar({ onSearch }: EnhancedSearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    brand: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;

    // Add to recent searches
    const updatedSearches = [query, ...recentSearches].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    onSearch(query, filters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Simulate API call for suggestions
    if (value.length > 2) {
      // In a real app, this would be an API call
      const mockSuggestions = [
        { id: "1", title: "Product 1", type: "product" },
        { id: "2", title: "Category 1", type: "category" },
        { id: "3", title: "Brand 1", type: "brand" },
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search products, categories, or brands..."
              value={query}
              onChange={handleInputChange}
              className="pr-10"
            />
            <Button
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              Search
            </Button>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white border rounded-md shadow-lg z-50">
                <div className="p-2">
                  <h3 className="font-medium mb-2">Suggestions</h3>
                  <div className="space-y-1">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setQuery(suggestion.title);
                          setSuggestions([]);
                        }}
                      >
                        <span>{suggestion.title}</span>
                        <span className="text-sm text-gray-500">
                          {suggestion.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white border rounded-md shadow-lg z-50">
                <div className="p-2">
                  <h3 className="font-medium mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setQuery(search);
                          setSuggestions([]);
                        }}
                      >
                        <span>{search}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches(recentSearches.filter((_, i) => i !== index));
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Filters */}
        <div className="flex gap-2">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
            placeholder="All Categories"
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </Select>
          <Select
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters({ ...filters, priceRange: value })
            }
            placeholder="Price Range"
          >
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </Select>
          <Select
            value={filters.brand}
            onValueChange={(value) =>
              setFilters({ ...filters, brand: value })
            }
            placeholder="Brand"
          >
            <option value="brand1">Brand 1</option>
            <option value="brand2">Brand 2</option>
            <option value="brand3">Brand 3</option>
          </Select>
        </div>
      </div>

      {/* Clear Search Button */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
