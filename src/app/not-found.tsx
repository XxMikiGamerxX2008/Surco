import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="display-xl text-accent">404</p>
      <h1 className="display-lg">Este surco no existe</h1>
      <p className="text-sm text-fg-muted">
        El disco que buscás no está en la colección.
      </p>
      <Link href="/catalogo">
        <Button>Volver al catálogo</Button>
      </Link>
    </div>
  );
}
