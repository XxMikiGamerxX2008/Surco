"use client";

import { Volume2, VolumeX } from "lucide-react";
import { ambientAudio } from "@/lib/audio/engine";
import { useAudioStore } from "@/stores/audio.store";

export function AudioChip() {
  const enabled = useAudioStore((s) => s.enabled);
  const muted = useAudioStore((s) => s.muted);
  const track = useAudioStore((s) => s.currentTrack);

  const toggle = async () => {
    if (!enabled) {
      await ambientAudio.enable();
      return;
    }
    const next = !muted;
    if (!next && !ambientAudio.ready) {
      await ambientAudio.enable();
    }
    ambientAudio.setMuted(next);
  };

  const active = enabled && !muted;

  return (
    <button
      onClick={toggle}
      aria-label={active ? "Silenciar ambiente" : "Activar ambiente"}
      title={active && track ? `${track.artist} — ${track.title}` : "Audio ambiente"}
      className="group flex h-10 items-center gap-2.5 rounded-full border border-line px-3.5 text-fg-muted transition-all duration-300 hover:border-line-strong hover:text-fg"
    >
      {active ? (
        <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
          <span className="eq-bar" style={{ height: "100%" }} />
          <span className="eq-bar" style={{ height: "100%" }} />
          <span className="eq-bar" style={{ height: "100%" }} />
        </span>
      ) : (
        <VolumeX size={15} />
      )}
      <span className="hidden max-w-[9rem] truncate font-display text-[0.72rem] tracking-wide md:block">
        {active
          ? track
            ? `${track.artist} — ${track.title}`
            : "Ambiente activo"
          : "Silencio"}
      </span>
      {active && <Volume2 size={13} className="text-accent" />}
    </button>
  );
}
