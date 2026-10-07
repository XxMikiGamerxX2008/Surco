"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import type { Section } from "@/types/catalog";
import { Button } from "@/components/ui/button";

interface ImmersiveSectionProps {
  section: Section;
  index: number;
  priority?: boolean;
}

/**
 * Sección inmersiva full-screen: la portada es el fondo,
 * la paleta del álbum colorea la UI local y los datos `data-section-id`
 * alimentan al SectionObserver (color raíz + crossfade de audio).
 * Sin animaciones de entrada por sección: el movimiento que importa es el
 * morph de paleta y el cambio de audio mientras el usuario se desplaza.
 */
export function ImmersiveSection({ section, index, priority = false }: ImmersiveSectionProps) {
  const { album, artist, palette, art, audio, genres, fx } = section;

  const style = {
    "--album-primary": palette.primary,
    "--album-secondary": palette.secondary,
    "--album-accent": palette.accent,
    "--album-surface": palette.surface,
    "--album-surface-2": palette.surface2,
    "--album-text": palette.textContrast,
  } as React.CSSProperties;

  return (
    <section
      data-section-id={section.id}
      data-mood={palette.mood}
      style={style}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      aria-label={`${artist.name} — ${album.title}`}
    >
      {/* fondo: portada full-bleed */}
      <Image
        src={art.coverPath}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />

      {/* velo de paleta para legibilidad */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${palette.surface} 8%, color-mix(in oklab, ${palette.surface} 55%, transparent) 45%, color-mix(in oklab, ${palette.primary} 35%, transparent) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-60"
        style={{ background: `radial-gradient(80% 60% at 70% 30%, ${palette.accent}, transparent 65%)` }}
      />

      {/* fx por sección */}
      {art.backgroundMode === "immersive-glitch" && (
        <div className="scanlines absolute inset-0" aria-hidden />
      )}
      {fx.ornament > 0.5 && <div className="ornament-frame" aria-hidden />}

      {/* índice editorial (la colección sí es una secuencia 01–04) */}
      <span
        className="pointer-events-none absolute right-6 top-24 select-none font-display text-[clamp(4rem,12vw,10rem)] font-bold leading-none opacity-[0.08] sm:right-10"
        style={{ color: palette.textContrast }}
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* contenido */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10">
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="groove-rule" style={{ color: palette.accent }} aria-hidden>
              <span className="tick" />
              <span className="tick" />
              <span className="tick" />
              <span className="tick" />
            </span>
            <span className="font-display text-sm font-medium" style={{ color: palette.textContrast, opacity: 0.85 }}>
              {palette.mood}
            </span>
            <span className="font-display text-sm font-medium" style={{ color: palette.accent }}>
              {album.year}
            </span>
          </div>

          <div>
            <p className="font-display text-lg font-medium opacity-80" style={{ color: palette.textContrast }}>
              {artist.name}
            </p>
            <h2 className="display-xl mt-2" style={{ color: palette.textContrast }}>
              {album.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {genres.map((g) => (
              <span
                key={g}
                className="rounded-full border px-3 py-1 font-display text-xs font-medium tracking-wide"
                style={{
                  borderColor: `color-mix(in oklab, ${palette.textContrast} 28%, transparent)`,
                  color: palette.textContrast,
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* chip "sonando ahora" */}
          <div className="flex items-center gap-3 pt-1">
            {audio.src ? (
              <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
                <span className="eq-bar" style={{ height: "100%", background: palette.accent }} />
                <span className="eq-bar" style={{ height: "100%", background: palette.accent }} />
                <span className="eq-bar" style={{ height: "100%", background: palette.accent }} />
                <span className="eq-bar" style={{ height: "100%", background: palette.accent }} />
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full" style={{ background: palette.accent }} />
            )}
            <span className="font-display text-sm tracking-wide" style={{ color: palette.textContrast, opacity: 0.85 }}>
              {audio.src
                ? `Sonando: ${audio.trackTitle}`
                : `Pista: ${audio.trackTitle} — asset pendiente`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-3">
            <Link href={`/album/${album.slug}`} transitionTypes={["nav-forward"]}>
              <ViewTransition name={`album-cover-${album.slug}`} share="morph" default="none">
                <Button size="lg" style={{ background: palette.accent, color: palette.surface }}>
                  Ver ficha
                  <ArrowUpRight size={18} />
                </Button>
              </ViewTransition>
            </Link>
            <Link
              href="/catalogo"
              transitionTypes={["nav-forward"]}
              className="font-display text-sm underline-offset-8 transition-all hover:underline"
              style={{ color: palette.textContrast, opacity: 0.85 }}
            >
              {formatPrice(album.precio)}
            </Link>
          </div>
        </div>
      </div>

      {/* borde inferior */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: `linear-gradient(to top, ${palette.surface}, transparent)` }}
        aria-hidden
      />
    </section>
  );
}