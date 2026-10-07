"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "left";
}

export function Sheet({ open, onClose, title, children, side = "right" }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            aria-label="Cerrar"
            className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              "absolute inset-y-0 flex w-full max-w-[26rem] flex-col border-line bg-surface-2 shadow-2xl",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
            )}
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Cerrar panel"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:text-fg"
              >
                <X size={16} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
