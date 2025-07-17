import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const accordionTriggerVariants = cva(
  "flex h-[45px] flex-row items-center justify-between space-y-0 overflow-hidden text-sm font-medium transition-all hover:enabled:bg-accent [&[data-state=open]>svg]:rotate-180",
  {
    variants: {
      variant: {
        default: "bg-background",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AccordionProps {
  type?: "single" | "multiple";
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  children,
}: AccordionProps) {
  return <div>{children}</div>;
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <div
      className={cn("border-b", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface AccordionTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function AccordionTrigger({
  className,
  variant,
  children,
  onClick,
  ...props
}: AccordionTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        accordionTriggerVariants({ variant }),
        "flex flex-row items-center justify-between space-y-0 overflow-hidden text-sm font-medium transition-all hover:enabled:bg-accent [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0" />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-out data-[state=closed]:animate-collapse data-[state=open]:animate-in data-[state=open]:animate-collapsible",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
}
