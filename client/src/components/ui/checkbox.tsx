import * as React from "react";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
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

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof checkboxVariants> {}

export function Checkbox({ className, variant, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={cn(
          checkboxVariants({ variant, className }),
          "appearance-none cursor-pointer"
        )}
        {...props}
      />
      <Check
        className={cn(
          "h-4 w-4 text-primary-foreground opacity-0 transition-opacity",
          props.checked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

export { checkboxVariants };
