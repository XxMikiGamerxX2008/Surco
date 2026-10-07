"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore, cartTotal } from "@/stores/cart.store";
import { formatPrice } from "@/lib/catalog";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove } = useCartStore();
  const total = cartTotal(items);

  return (
    <Sheet open={isOpen} onClose={() => setOpen(false)} title="Tu carrito">
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-line text-fg-muted">
            <ShoppingBag size={22} />
          </div>
          <p className="text-sm text-fg-muted">Todavía no agregaste discos.</p>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Seguir explorando
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-line">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-4 p-5">
                <Link
                  href={`/album/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line"
                >
                  <Image
                    src={item.coverPath}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold">{item.title}</p>
                  <p className="truncate text-xs text-fg-muted">{item.artist}</p>
                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-line">
                      <button
                        aria-label="Restar unidad"
                        className="grid h-7 w-7 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-5 text-center font-display text-xs">{item.qty}</span>
                      <button
                        aria-label="Sumar unidad"
                        className="grid h-7 w-7 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg"
                        onClick={() => setQty(item.slug, item.qty + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm font-semibold text-accent">
                        {formatPrice(item.price * item.qty)}
                      </span>
                      <button
                        aria-label={`Quitar ${item.title}`}
                        className="text-fg-muted transition-colors hover:text-danger"
                        onClick={() => remove(item.slug)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fg-muted">Total</span>
              <span className="font-display text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <Link href="/carrito" onClick={() => setOpen(false)}>
              <Button className="w-full" size="lg">
                Ver carrito
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}
