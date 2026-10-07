import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisá los vinilos que agregaste a tu carrito.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 sm:px-10">
      <header className="mb-12">
        <p className="eyebrow mb-4 text-accent">Carrito</p>
        <h1 className="display-lg">Tu selección</h1>
      </header>
      <CartView />
    </div>
  );
}
