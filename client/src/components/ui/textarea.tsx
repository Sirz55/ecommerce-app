"use client";

import * as React from "react";
import * as TextareaPrimitive from "@radix-ui/react-textarea";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background",
        outline: "border border-input",
      },
      size: {
        default: "h-10",
        sm: "h-9 rounded-md",
        lg: "h-11 rounded-md px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TextareaProps
  extends TextareaPrimitive.TextareaProps,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextareaPrimitive.Root>,
  TextareaProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <TextareaPrimitive.Root
      ref={ref}
      className={cn(textareaVariants({ variant, size, className }))}
      {...props}
    />
  );
});
Textarea.displayName = TextareaPrimitive.Root.displayName;

export { Textarea };
