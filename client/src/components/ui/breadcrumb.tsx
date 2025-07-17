import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: {
    href: string;
    name: string;
  }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2">
      {items.map((item, index) => (
        <>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          <Link
            href={item.href}
            className={`text-sm font-medium ${
              index === items.length - 1 ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {item.name}
          </Link>
        </>
      ))}
    </nav>
  );
}
