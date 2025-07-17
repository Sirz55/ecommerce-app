import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioGroupVariants = cva(
  "flex flex-col gap-2",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function RadioGroup({
  value,
  onChange,
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div
      {...props}
      className={cn('flex flex-col gap-2', className)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === RadioGroupItem) {
          return React.cloneElement(child as React.ReactElement<RadioGroupItemProps>, {
            checked: (child.props as RadioGroupItemProps).value === value,
            onChange: () => onChange((child.props as RadioGroupItemProps).value),
          });
        }
        return child;
      })}
    </div>
  );
}

interface RadioGroupItemProps {
  value: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function RadioGroupItem({
  value,
  checked,
  onChange,
  className,
  children,
  ...props
}: RadioGroupItemProps) {
  return (
    <label className={cn("flex items-center space-x-3", className)}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary">
        {checked && (
          <div className="h-2 w-2 rounded-full bg-primary" />
        )}
      </div>
      <span className="text-sm font-medium">{children}</span>
    </label>
  );
}
