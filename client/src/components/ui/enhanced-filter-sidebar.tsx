import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup } from "./radio";
import { Checkbox } from "./checkbox";

interface Filter {
  name: string;
  options: string[];
  type: 'checkbox' | 'radio' | 'range';
}

interface EnhancedFilterSidebarProps {
  filters: Filter[];
  selectedFilters: {
    [key: string]: string[] | { min: number; max: number };
  };
  onApply: (filters: any) => void;
  onClear: () => void;
}

export function EnhancedFilterSidebar({
  filters,
  selectedFilters,
  onApply,
  onClear,
}: EnhancedFilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters);

  const handleRangeChange = (filterName: string, value: string) => {
    const [min, max] = value.split('-').map(Number);
    setLocalFilters({
      ...localFilters,
      [filterName]: { min, max },
    });
  };

  const handleCheckboxChange = (filterName: string, option: string) => {
    const currentOptions = localFilters[filterName] as string[];
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter((o) => o !== option)
      : [...currentOptions, option];
    setLocalFilters({
      ...localFilters,
      [filterName]: newOptions,
    });
  };

  const handleRadioChange = (filterName: string, value: string) => {
    setLocalFilters({
      ...localFilters,
      [filterName]: [value],
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Price Range Slider */}
      <div className="mb-6">
        <Label>Price Range</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="number"
            value={(localFilters.price as any)?.min || 0}
            onChange={(e) =>
              handleRangeChange('price', `${e.target.value}-1000`)
            }
            placeholder="Min"
            className="w-24"
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            value={(localFilters.price as any)?.max || 1000}
            onChange={(e) =>
              handleRangeChange('price', `0-${e.target.value}`)
            }
            placeholder="Max"
            className="w-24"
          />
        </div>
      </div>

      {/* Category Tree */}
      <div className="mb-6">
        <Label>Categories</Label>
        <div className="space-y-2 mt-2">
          <div className="pl-4">
            <Checkbox
              checked={false}
              onCheckedChange={() => {}}
            >
              Electronics
            </Checkbox>
            <div className="pl-4">
              <Checkbox
                checked={false}
                onCheckedChange={() => {}}
              >
                Smartphones
              </Checkbox>
              <Checkbox
                checked={false}
                onCheckedChange={() => {}}
              >
                Laptops
              </Checkbox>
            </div>
          </div>
          <div className="pl-4">
            <Checkbox
              checked={false}
              onCheckedChange={() => {}}
            >
              Fashion
            </Checkbox>
            <div className="pl-4">
              <Checkbox
                checked={false}
                onCheckedChange={() => {}}
              >
                Men's
              </Checkbox>
              <Checkbox
                checked={false}
                onCheckedChange={() => {}}
              >
                Women's
              </Checkbox>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Filters */}
      <div className="mb-6">
        <Label>Brands</Label>
        <div className="space-y-2 mt-2">
          <Checkbox
            checked={(localFilters.brands as string[]).includes('brand1')}
            onChange={() => handleCheckboxChange('brands', 'brand1')}
          >
            Brand 1
          </Checkbox>
          <Checkbox
            checked={(localFilters.brands as string[]).includes('brand2')}
            onChange={() => handleCheckboxChange('brands', 'brand2')}
          >
            Brand 2
          </Checkbox>
          <Checkbox
            checked={(localFilters.brands as string[]).includes('brand3')}
            onChange={() => handleCheckboxChange('brands', 'brand3')}
          >
            Brand 3
          </Checkbox>
        </div>
      </div>

      {/* Color Filters */}
      <div className="mb-6">
        <Label>Colors</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          <Checkbox
            checked={(localFilters.colors as string[]).includes('red')}
            onChange={() => handleCheckboxChange('colors', 'red')}
          >
            <span className="block w-full h-full bg-red-500 rounded-full" />
          </Checkbox>
          <Checkbox
            checked={(localFilters.colors as string[]).includes('blue')}
            onChange={() => handleCheckboxChange('colors', 'blue')}
          >
            <span className="block w-full h-full bg-blue-500 rounded-full" />
          </Checkbox>
          <Checkbox
            checked={(localFilters.colors as string[]).includes('green')}
            onChange={() => handleCheckboxChange('colors', 'green')}
          >
            <span className="block w-full h-full bg-green-500 rounded-full" />
          </Checkbox>
        </div>
      </div>

      {/* Size Filters */}
      <div className="mb-6">
        <Label>Sizes</Label>
        <RadioGroup
          value={(localFilters.size as string[])[0] || ''}
          onChange={(value) => handleRadioChange('size', value)}
          className="space-y-2 mt-2"
        >
          <RadioGroup.Item
            value="S"
            id="size-s"
            className="flex items-center space-x-3"
          >
            <RadioGroup.Label>S</RadioGroup.Label>
          </RadioGroup.Item>
          <RadioGroup.Item
            value="M"
            className="flex items-center space-x-3"
          >
            M
          </RadioGroup.Item>
          <RadioGroup.Item
            value="L"
            className="flex items-center space-x-3"
          >
            L
          </RadioGroup.Item>
        </RadioGroup>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onClear}
          className="w-1/2"
        >
          Clear All
        </Button>
        <Button
          onClick={() => onApply(localFilters)}
          className="w-1/2"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
