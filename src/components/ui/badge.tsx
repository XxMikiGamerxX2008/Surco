import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-display text-xs font-medium tracking-wide text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}
