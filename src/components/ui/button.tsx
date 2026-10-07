import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-semibold whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-brand-ink hover:brightness-110 hover:shadow-[0_0_32px_-6px_var(--accent)] active:scale-[0.98]",
        secondary:
          "border border-line-strong text-fg bg-transparent hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] hover:border-fg/40 active:scale-[0.98]",
        ghost:
          "text-fg-muted hover:text-fg hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]",
        ink: "bg-brand-bone text-brand-ink hover:brightness-95 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem] rounded-full",
        md: "h-11 px-6 text-sm rounded-full",
        lg: "h-14 px-9 text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
