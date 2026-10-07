import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-line bg-[color-mix(in_oklab,var(--surface-2)_80%,transparent)] px-4 text-sm text-fg placeholder:text-fg-muted/60 outline-none transition-colors focus:border-accent",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
