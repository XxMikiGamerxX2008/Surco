import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-display text-[0.68rem] font-medium tracking-[0.14em] uppercase text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}
