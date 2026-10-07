import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatPrice } from "@/lib/catalog";
import type { Section } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";

interface AlbumCardProps {
  section: Section;
  index?: number;
  withTransition?: boolean;
}

/**
 * Card de álbum — lleva la paleta de SU álbum en variables CSS locales,
 * así cada card se colorea con su disco aunque la página sea neutra.
 */
export function AlbumCard({ section, index, withTransition = true }: AlbumCardProps) {
  const { album, artist, palette, art, genres } = section;

  const cover = (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-surface-2">
      <Image
        src={art.coverPath}
        alt={`Portada de ${album.title}`}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );

  return (
    <Link
      href={`/album/${album.slug}`}
      transitionTypes={["nav-forward"]}
      className="group block"
      style={
        {
          "--album-primary": palette.primary,
          "--album-secondary": palette.secondary,
          "--album-accent": palette.accent,
          "--album-surface": palette.surface,
          "--album-surface-2": palette.surface2,
          "--album-text": palette.textContrast,
        } as React.CSSProperties
      }
    >
      <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
        {withTransition ? (
          <ViewTransition name={`album-cover-${album.slug}`} share="morph" default="none">
            {cover}
          </ViewTransition>
        ) : (
          cover
        )}

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 font-display text-[0.8rem] font-medium text-accent">
              {artist.name}
            </p>
            <h3 className="font-display truncate text-base font-semibold tracking-tight text-fg">
              {album.title}
            </h3>
            <p className="mt-1 text-xs text-fg-muted">{album.year}</p>
            <p className="mt-0.5 text-xs text-fg-muted/80">{genres[0]}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-display text-sm font-bold text-accent">
              {formatPrice(album.precio)}
            </span>
            {typeof index === "number" && (
              <span className="font-display text-[0.65rem] text-fg-muted/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>

        {album.destacado && (
          <Badge className="mt-3 border-accent/40 text-accent">Destacado</Badge>
        )}
      </div>
    </Link>
  );
}
