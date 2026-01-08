import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Input({ leftIcon, rightIcon, className, type, ...props }: InputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "dark:bg-input/30 border-input h-9 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
        "selection:bg-primary selection:text-primary-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {leftIcon && (
        <span className="text-muted-foreground icon:size-4">{leftIcon}</span>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex-1 bg-transparent text-base md:text-sm",
          "file:text-foreground placeholder:text-muted-foreground",
          "outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:outline-none",
          "border-0",
          "aria-invalid:ring-0 aria-invalid:border-0",
          className
        )}
        {...props}
      />

      {rightIcon && <span className="text-muted-foreground">{rightIcon}</span>}
    </div>
  );
}

export { Input };
