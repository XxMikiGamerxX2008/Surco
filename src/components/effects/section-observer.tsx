"use client";

import { useEffect } from "react";
import { sections } from "@/lib/catalog";
import { ambientAudio } from "@/lib/audio/engine";
import { useAudioStore } from "@/stores/audio.store";
import type { Section } from "@/types/catalog";

const PALETTE_KEYS = [
  "--album-primary",
  "--album-secondary",
  "--album-accent",
  "--album-surface",
  "--album-surface-2",
  "--album-text",
] as const;

function applyPalette(section: Section) {
  const root = document.documentElement;
  root.style.setProperty("--album-primary", section.palette.primary);
  root.style.setProperty("--album-secondary", section.palette.secondary);
  root.style.setProperty("--album-accent", section.palette.accent);
  root.style.setProperty("--album-surface", section.palette.surface);
  root.style.setProperty("--album-surface-2", section.palette.surface2);
  root.style.setProperty("--album-text", section.palette.textContrast);
  root.dataset.section = section.id;
  root.dataset.mood = section.palette.mood;
}

/**
 * Observa las secciones inmersivas ([data-section-id]):
 *  1. vuelca la paleta del álbum activo a las CSS variables raíz (transición @property),
 *  2. pide al motor de audio el crossfade a la pista de esa sección.
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

      applyPalette(section);

      const store = useAudioStore.getState();
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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) activate(visible.target.getAttribute("data-section-id")!);
      },
      { threshold: [0.35, 0.6] },
    );

    nodes.forEach((n) => observer.observe(n));

    // sección inicial visible al cargar (si hay alguna en viewport)
    const initial = nodes.find((n) => {
      const r = n.getBoundingClientRect();
      return r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4;
    });
    if (initial) activate(initial.getAttribute("data-section-id")!);

    return () => observer.disconnect();
  }, []);

  return null;
}

export { PALETTE_KEYS };
