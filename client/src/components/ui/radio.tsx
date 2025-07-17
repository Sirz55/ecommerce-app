import * as React from "react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadioProps {
  className?: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export function Radio({ className, value, checked, onChange, children, ...props }: RadioProps) {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-background",
          "appearance-none cursor-pointer",
          className
        )}
        {...props}
      />
      <Circle
        className={cn(
          "h-2 w-2 text-primary-foreground opacity-0 transition-opacity",
          checked ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="ml-3 flex flex-col">
        {children}
      </div>
    </div>
  );
}

export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
}

export function RadioGroup({
  value,
  onChange,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div className="space-y-2" {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || child.type !== Radio) {
          return child;
        }
        const radioProps = child.props as RadioProps;
        const newProps: RadioProps = {
          ...radioProps,
          value: radioProps.value,
          checked: radioProps.value === value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
              onChange(e.target.value);
            }
          },
        };
        return React.cloneElement(child, newProps);
      })}
    </div>
  );
}
