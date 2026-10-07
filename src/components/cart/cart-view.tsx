"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartTotal, cartCount } from "@/stores/cart.store";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export function CartView() {
  const { items, setQty, remove, clear } = useCartStore();
  const [confirmed, setConfirmed] = useState(false);
  const total = cartTotal(items);
  const count = cartCount(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full border border-line text-fg-muted">
          <Trash2 size={24} />
        </div>
        <p className="text-fg-muted">Tu carrito está vacío.</p>
        <Link href="/catalogo">
          <Button variant="secondary">Ir al catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-line rounded-2xl border border-line">
        {items.map((item) => (
          <li key={item.slug} className="flex flex-wrap items-center gap-5 p-5">
            <Link
              href={`/album/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line"
            >
              <Image
                src={item.coverPath}
                alt={item.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="text-sm text-fg-muted">{item.artist}</p>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-line">
              <button
                aria-label="Restar unidad"
                className="grid h-8 w-8 place-items-center text-fg-muted transition-colors hover:text-fg"
                onClick={() => setQty(item.slug, item.qty - 1)}
              >
                <Minus size={13} />
              </button>
              <span className="min-w-6 text-center font-display text-sm">{item.qty}</span>
              <button
                aria-label="Sumar unidad"
                className="grid h-8 w-8 place-items-center text-fg-muted transition-colors hover:text-fg"
                onClick={() => setQty(item.slug, item.qty + 1)}
              >
                <Plus size={13} />
              </button>
            </div>

            <span className="w-24 text-right font-display font-semibold text-accent">
              {formatPrice(item.price * item.qty)}
            </span>

            <button
              aria-label={`Quitar ${item.title}`}
              className="text-fg-muted transition-colors hover:text-danger"
              onClick={() => remove(item.slug)}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-line p-6 lg:sticky lg:top-28">
        <p className="eyebrow mb-5 text-fg-muted">Resumen</p>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg-muted">Ítems</dt>
            <dd className="font-display">{count}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted">Envío</dt>
            <dd className="font-display text-success">Gratis (demo)</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-display font-semibold">Total</dt>
            <dd className="font-display font-bold text-accent">{formatPrice(total)}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              setConfirmed(true);
              clear();
            }}
          >
            {confirmed ? <Check size={18} /> : null}
            Finalizar compra
          </Button>
          {confirmed && (
            <p className="text-center text-xs leading-relaxed text-fg-muted">
              Checkout simulado — tu pedido fue registrado en modo demo. La pasarela real
              llega en Fase 2.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
