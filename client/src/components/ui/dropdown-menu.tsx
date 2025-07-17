import * as React from "react";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dropdownMenuVariants = cva(
  "inline-flex select-none items-center justify-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        destructive:
          "bg-transparent text-destructive data-[state=open]:bg-destructive data-[state=open]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({
  open,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

interface DropdownMenuTriggerProps {
  className?: string;
  variant?: "default" | "destructive";
  children: React.ReactNode;
  onClick?: () => void;
}

export function DropdownMenuTrigger({
  className,
  variant,
  children,
  onClick,
  ...props
}: DropdownMenuTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        dropdownMenuVariants({ variant }),
        "flex items-center justify-center gap-2",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownMenuContent({
  className,
  children,
  ...props
}: DropdownMenuContentProps) {
  return (
    <div
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  className?: string;
  variant?: "default" | "destructive";
  children: React.ReactNode;
  onClick?: () => void;
}

export function DropdownMenuItem({
  className,
  variant,
  children,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        dropdownMenuVariants({ variant }),
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

interface DropdownMenuCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <div
      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onClick={onClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
      <span className="ml-auto pl-6" />
    </div>
  );
}

interface DropdownMenuRadioItemProps {
  value: string;
  checked?: boolean;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

export function DropdownMenuRadioItem({
  value,
  checked,
  children,
  onChange,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <div
      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onClick={() => onChange?.(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </div>
  );
}

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuLabel({
  inset,
  children,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        props.className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function DropdownMenuShortcut({
  children,
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { dropdownMenuVariants };
