import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background",
        outline: "border-2 border-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  icon?: React.ReactNode;
}

export function Select({ className, variant, icon, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <select
        className={cn(
          selectVariants({ variant, className }),
          icon && "pl-8"
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function SelectOption({ children, ...props }: React.ComponentPropsWithoutRef<"option">) {
  return <option {...props}>{children}</option>;
}

export { selectVariants };
