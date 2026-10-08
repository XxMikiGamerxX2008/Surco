import content from "../../content/sections.json";
import type { CatalogContent, Section } from "@/types/catalog";

export const catalogContent = content as unknown as CatalogContent;

export const site = catalogContent.site;

/**
 * Paleta inicial: escala de grises (blanco y negro).
 * La home arranca B&N y el SectionObserver morphea al color del álbum activo
 * cuando el usuario pasa el gate; luego sigue con cada álbum al scrollear.
 */
export const startPalette = {
  primary: "#26282c",
  secondary: "#3f434a",
  accent: "#e4e6ea",
  surface: "#0b0c0e",
  surface2: "#17181c",
  textContrast: "#eef0f4",
} as const;

export const sections: Section[] = [...catalogContent.sections].sort(
  (a, b) => a.order - b.order,
);

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.album.slug === slug);
}

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getAllGenres(): string[] {
  const set = new Set<string>();
  for (const s of sections) for (const g of s.genres) set.add(g);
  return [...set].sort();
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
