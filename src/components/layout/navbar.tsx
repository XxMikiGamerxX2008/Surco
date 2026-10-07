"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore, cartCount } from "@/stores/cart.store";
import { AudioChip } from "@/components/audio/audio-chip";

export function Navbar() {
  const items = useCartStore((s) => s.items);
  const setOpen = useCartStore((s) => s.setOpen);
  const count = cartCount(items);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-[60]"
    >
      <div className="glass mx-auto mt-3 flex h-14 max-w-7xl items-center justify-between rounded-full border border-line px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-1.5" aria-label="SURCO — inicio">
          <span className="font-display text-lg font-bold tracking-[-0.04em] text-fg">
            SURCO
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="font-display text-[0.82rem] tracking-wide text-fg-muted transition-colors hover:text-fg"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            transitionTypes={["nav-forward"]}
            className="font-display text-[0.82rem] tracking-wide text-fg-muted transition-colors hover:text-fg"
          >
            Catálogo
          </Link>
          <Link
            href="/carrito"
            transitionTypes={["nav-forward"]}
            className="font-display text-[0.82rem] tracking-wide text-fg-muted transition-colors hover:text-fg"
          >
            Carrito
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <AudioChip />
          <button
            onClick={() => setOpen(true)}
            aria-label={`Abrir carrito (${count} ítems)`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-all duration-300 hover:border-line-strong"
          >
            <ShoppingBag size={16} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-display text-[0.65rem] font-bold text-brand-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
