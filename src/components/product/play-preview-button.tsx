"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { ambientAudio } from "@/lib/audio/engine";
import { useAudioStore } from "@/stores/audio.store";
import type { Section } from "@/types/catalog";

/**
 * Preview conceptual: reproduce la pista ambiental del álbum a través
 * del motor centralizado (nunca crea un <audio> propio).
 */
export function PlayPreviewButton({ section }: { section: Section }) {
  const currentSectionId = useAudioStore((s) => s.currentSectionId);
  const enabled = useAudioStore((s) => s.enabled);
  const muted = useAudioStore((s) => s.muted);
  const [starting, setStarting] = useState(false);

  const src = section.audio.src;
  const isPlayingThis =
    enabled && !muted && currentSectionId === src && src !== null;

  const toggle = async () => {
    if (!src) return;
    if (!enabled) {
      setStarting(true);
      try {
        await ambientAudio.enable();
        await ambientAudio.setTrack(src, section.audio.targetGainDb, {
          title: section.audio.trackTitle,
          artist: section.artist.name,
        });
      } finally {
        setStarting(false);
      }
      return;
    }
    if (isPlayingThis) {
      ambientAudio.setMuted(true);
    } else {
      if (muted) ambientAudio.setMuted(false);
      await ambientAudio.setTrack(src, section.audio.targetGainDb, {
        title: section.audio.trackTitle,
        artist: section.artist.name,
      });
    }
  };

  if (!src) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-line px-4 py-2.5 text-xs text-fg-muted">
        <span className="h-2 w-2 rounded-full bg-accent" />
        Preview de “{section.audio.trackTitle}” — asset pendiente
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      className="group flex items-center gap-3 rounded-full border border-line px-4 py-2.5 text-xs text-fg-muted transition-all hover:border-accent hover:text-fg"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-brand-ink transition-transform group-hover:scale-105">
        {isPlayingThis ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
      </span>
      {starting
        ? "Activando…"
        : isPlayingThis
          ? `Sonando: ${section.audio.trackTitle}`
          : `Preview: ${section.audio.trackTitle}`}
    </button>
  );
}
