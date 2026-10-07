"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import type { Section } from "@/types/catalog";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ section }: { section: Section }) {
  const add = useCartStore((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    add({
      slug: section.album.slug,
      title: section.album.title,
      artist: section.artist.name,
      coverPath: section.art.coverPath,
      price: section.album.precio,
      accent: section.palette.accent,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <Button size="lg" onClick={handleAdd} disabled={section.album.stock === 0}>
      {justAdded ? (
        <>
          <Check size={18} /> Agregado
        </>
      ) : section.album.stock === 0 ? (
        "Sin stock"
      ) : (
        <>
          <Plus size={18} /> Agregar al carrito
        </>
      )}
    </Button>
  );
}
