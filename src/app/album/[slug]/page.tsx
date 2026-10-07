import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, Disc3 } from "lucide-react";
import { sections, getSectionBySlug, formatPrice } from "@/lib/catalog";
import { VinylPreview } from "@/components/product/vinyl-preview";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { PlayPreviewButton } from "@/components/product/play-preview-button";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.album.slug }));
}

export async function generateMetadata(
  props: PageProps<"/album/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const section = getSectionBySlug(slug);
  if (!section) return { title: "Álbum no encontrado" };
  return {
    title: `${section.album.title} — ${section.artist.name}`,
    description: `${section.album.title} de ${section.artist.name} (${section.album.year}). ${section.album.formato} — ${formatPrice(section.album.precio)}. Paleta ${section.palette.mood}.`,
    openGraph: {
      title: `${section.album.title} · ${section.artist.name}`,
      images: [{ url: section.art.coverPath }],
    },
  };
}

export default async function AlbumPage(props: PageProps<"/album/[slug]">) {
  const { slug } = await props.params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  const { album, artist, palette, genres } = section;

  const style = {
    "--album-primary": palette.primary,
    "--album-secondary": palette.secondary,
    "--album-accent": palette.accent,
    "--album-surface": palette.surface,
    "--album-surface-2": palette.surface2,
    "--album-text": palette.textContrast,
  } as React.CSSProperties;

  return (
    <article style={style} className="min-h-screen pb-24">
      {/* fondo de ambiente del álbum */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(65% 50% at 75% 15%, color-mix(in oklab, ${palette.primary} 65%, transparent), transparent 70%), radial-gradient(45% 45% at 15% 85%, color-mix(in oklab, ${palette.accent} 18%, transparent), transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 pt-32 sm:px-10">
        <Link
          href="/catalogo"
          transitionTypes={["nav-back"]}
          className="mb-10 inline-flex items-center gap-2 font-display text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* visual 3D */}
          <div className="lg:sticky lg:top-28">
            <ViewTransition name={`album-cover-${album.slug}`} share="morph" default="none">
              <VinylPreview
                coverPath={section.art.coverPath}
                accent={palette.accent}
                primary={palette.primary}
                surface={palette.surface}
              />
            </ViewTransition>
          </div>

          {/* información */}
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-accent/40 text-accent">{palette.mood}</Badge>
              <Badge>{album.year}</Badge>
              <Badge>{album.formato}</Badge>
            </div>

            <div>
              <p className="eyebrow mb-2 text-accent">{artist.name}</p>
              <h1 className="display-lg">{album.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-line px-3 py-1 font-display text-[0.68rem] uppercase tracking-[0.14em] text-fg-muted"
                >
                  {g}
                </span>
              ))}
            </div>

            <PlayPreviewButton section={section} />

            <div className="flex flex-wrap items-center gap-5 border-t border-line pt-7">
              <div>
                <p className="font-display text-3xl font-bold text-accent">
                  {formatPrice(album.precio)}
                </p>
                <p className="mt-1 text-xs text-fg-muted">
                  {album.stock > 0
                    ? `${album.stock} unidades disponibles`
                    : "Sin stock"}
                </p>
              </div>
              <AddToCartButton section={section} />
            </div>

            {/* paleta del disco */}
            <div className="rounded-2xl border border-line p-5">
              <p className="eyebrow mb-3 flex items-center gap-2 text-fg-muted">
                <Disc3 size={13} /> Paleta extraída del arte
              </p>
              <div className="flex gap-2">
                {(
                  [
                    ["Primario", palette.primary],
                    ["Secundario", palette.secondary],
                    ["Acento", palette.accent],
                    ["Superficie", palette.surface],
                    ["Texto", palette.textContrast],
                  ] as const
                ).map(([label, hex]) => (
                  <div key={label} className="flex-1" title={`${label} ${hex}`}>
                    <div
                      className="h-10 w-full rounded-lg border border-line"
                      style={{ background: hex }}
                    />
                    <p className="mt-1.5 truncate font-display text-[0.6rem] uppercase tracking-wider text-fg-muted">
                      {hex}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-line p-5 text-sm text-fg-muted">
              <Image
                src={section.art.coverPath}
                alt=""
                width={48}
                height={48}
                className="rounded-lg border border-line"
              />
              <p className="leading-relaxed">
                Esta ficha usa la paleta <strong className="text-fg">{palette.mood}</strong>{" "}
                del propio arte: fondo, tipografía y acentos mutan al entrar. El ambiente
                sonoro cambia con un crossfade suave.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
