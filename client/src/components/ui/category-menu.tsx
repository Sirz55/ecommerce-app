import { useState } from "react";
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

interface CategoryMenuProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryMenu({ categories, activeCategory }: CategoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderCategory = (category: Category, level = 0) => {
    const paddingLeft = level * 2;
    return (
      <div key={category.id} className={`pl-${paddingLeft}`}>
        <Menu.Item>
          {({ active }) => (
            <a
              href={`/categories/${category.id}`}
              className={`block px-4 py-2 text-sm ${
                active ? "bg-gray-100" : ""
              } ${
                activeCategory === category.id ? "font-bold" : ""
              }`}
            >
              {category.name}
            </a>
          )}
        </Menu.Item>
        {category.subcategories?.map((sub) => renderCategory(sub, level + 1))}
      </div>
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
        Categories
        <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {categories.map((category) => renderCategory(category))}
      </Menu.Items>
    </Menu>
  );
}
