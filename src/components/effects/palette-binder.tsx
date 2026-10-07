"use client";

import { useEffect } from "react";
import { morphPalette } from "@/lib/palette-morph";
import type { Section } from "@/types/catalog";

/**
 * Aplica la paleta de un álbum a las CSS variables raíz con morph suave
 * (lerp JS en OKLab). Se usa en páginas que no tienen secciones
 * [data-section-id] (ficha de producto) para que navbar/fondo sigan al disco.
 */
export function PaletteBinder({ section }: { section: Section }) {
  useEffect(() => {
    morphPalette(
      {
        "--album-primary": section.palette.primary,
        "--album-secondary": section.palette.secondary,
        "--album-accent": section.palette.accent,
        "--album-surface": section.palette.surface,
        "--album-surface-2": section.palette.surface2,
        "--album-text": section.palette.textContrast,
      },
      { section: section.id, mood: section.palette.mood },
    );
  }, [section]);

  return null;
}