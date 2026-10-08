"use client";

import { useEffect } from "react";
import { sections } from "@/lib/catalog";
import { ambientAudio } from "@/lib/audio/engine";
import { morphPalette } from "@/lib/palette-morph";
import { useAudioStore } from "@/stores/audio.store";
import type { Section } from "@/types/catalog";

function paletteToMorph(section: Section) {
  return {
    "--album-primary": section.palette.primary,
    "--album-secondary": section.palette.secondary,
    "--album-accent": section.palette.accent,
    "--album-surface": section.palette.surface,
    "--album-surface-2": section.palette.surface2,
    "--album-text": section.palette.textContrast,
  };
}

/**
 * Observa las secciones inmersivas ([data-section-id]) y decide la activa
 * por centro más cercano al centro del viewport.
 * Decisions:
 *  1. morph-ea la paleta del álbum activo a las CSS variables raíz
 *     (lerp JS en OKLab, sin depender de transiciones CSS congeladas),
 *  2. pide al motor de audio el crossfade a la pista de esa sección.
 *
 * Gate de B&N: la home arranca en blanco y negro (startPalette). Mientras el
 * usuario no pasa el gate (`enabled === false`) no se morphea ninguna paleta:
 * el primer morph recién ocurre al entrar, hacia el álbum visible (HMHAS), y
 * desde ahí sigue consecutivamente con cada álbum al scrollear.
 */
export function SectionObserver() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-id]"),
    );
    if (nodes.length === 0) return;

    let activeId: string | null = null;

    const activate = (id: string) => {
      if (id === activeId) return;
      activeId = id;
      const section = sections.find((s) => s.id === id);
      if (!section) return;

      const store = useAudioStore.getState();
      if (store.enabled) {
        morphPalette(paletteToMorph(section), {
          section: section.id,
          mood: section.palette.mood,
        });
      }

      if (store.enabled && !store.muted) {
        void ambientAudio.setTrack(section.audio.src, section.audio.targetGainDb, {
          title: section.audio.trackTitle,
          artist: section.artist.name,
        });
      } else {
        // registra la pista pendiente sin sonar
        useAudioStore.getState().setActive(
          section.audio.src,
          section.audio.src
            ? { title: section.audio.trackTitle, artist: section.artist.name }
            : null,
        );
      }
    };

    const measure = () => {
      // mientras no se pasa el gate, la pantalla queda en B&N
      if (!useAudioStore.getState().enabled) return;

      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = n;
        }
      }
      if (best) activate(best.getAttribute("data-section-id")!);
    };

    const onScroll = () => measure();

    // sección inicial visible
    measure();
    const onLoad = () => measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onLoad);

    // al pasar el gate (enabled → true) morphea a la sección visible:
    // la home pasa de B&N al color del primer álbum.
    const unsubscribe = useAudioStore.subscribe((state, prev) => {
      if (state.enabled && !prev.enabled) measure();
    });

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}