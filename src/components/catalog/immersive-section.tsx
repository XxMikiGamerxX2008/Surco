"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { motion } from "motion/react";
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

      {/* número de sección */}
      <span
        className="pointer-events-none absolute right-6 top-24 select-none font-display text-[clamp(4rem,12vw,10rem)] font-bold leading-none opacity-[0.08] sm:right-10"
        style={{ color: palette.textContrast }}
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* contenido */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow" style={{ color: palette.accent }}>
              {palette.mood}
            </span>
            <span className="h-px w-12" style={{ background: palette.accent, opacity: 0.5 }} />
            <span className="eyebrow opacity-60" style={{ color: palette.textContrast }}>
              {album.year}
            </span>
          </div>

          <div>
            <p className="font-display text-lg font-medium opacity-75" style={{ color: palette.textContrast }}>
              {artist.name}
            </p>
            <h2 className="display-xl mt-1" style={{ color: palette.textContrast }}>
              {album.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {genres.map((g) => (
              <span
                key={g}
                className="rounded-full border px-3 py-1 font-display text-[0.68rem] uppercase tracking-[0.14em]"
                style={{
                  borderColor: `color-mix(in oklab, ${palette.textContrast} 30%, transparent)`,
                  color: palette.textContrast,
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* chip "sonando ahora" */}
          <div className="flex items-center gap-3">
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
            <span className="font-display text-xs tracking-wide" style={{ color: palette.textContrast, opacity: 0.8 }}>
              {audio.src ? `Sonando: ${audio.trackTitle}` : `Pista: ${audio.trackTitle} · asset pendiente`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href={`/album/${album.slug}`} transitionTypes={["nav-forward"]}>
              <ViewTransition name={`album-cover-${album.slug}`} share="morph" default="none">
                <Button size="lg" style={{ background: palette.accent, color: palette.surface }}>
                  Ver ficha · {formatPrice(album.precio)}
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
              Explorar catálogo
            </Link>
          </div>
        </div>
      </motion.div>

      {/* borde inferior */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: `linear-gradient(to top, ${palette.surface}, transparent)` }}
        aria-hidden
      />
    </section>
  );
}
