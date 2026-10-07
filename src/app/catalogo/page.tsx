import type { Metadata } from "next";
import { sections, getAllGenres, site } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog/catalog-view";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Catálogo de vinilos de ${site.name}: discos seleccionados donde cada portada define la experiencia.`,
};

export default function CatalogPage() {
  const genres = getAllGenres();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-36 sm:px-10">
      <header className="mb-12 max-w-2xl">
        <span className="groove-rule mb-6 text-accent" aria-hidden>
          <span className="tick" />
          <span className="tick" />
          <span className="tick" />
          <span className="tick" />
        </span>
        <h1 className="display-lg">Todos los surcos</h1>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">
          Filtrá por género — cada ficha mantiene la paleta de su disco.
        </p>
      </header>

      <CatalogView sections={sections} genres={genres} />
    </div>
  );
}
