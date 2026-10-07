"use client";

import { AnimatePresence, motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { ambientAudio } from "@/lib/audio/engine";
import { useAudioStore } from "@/stores/audio.store";
import { Button } from "@/components/ui/button";

/**
 * Gate de acceso: obligatorio por las políticas de autoplay de los navegadores.
 * El primer gesto del usuario (click) desbloquea el AudioContext.
 */
export function AccessGate() {
  const enabled = useAudioStore((s) => s.enabled);
  const [busy, setBusy] = useState(false);

  const enterWithSound = async () => {
    setBusy(true);
    try {
      await ambientAudio.enable();
    } finally {
      setBusy(false);
    }
  };

  const enterSilent = () => {
    useAudioStore.getState().setMuted(true);
    useAudioStore.getState().setEnabled(true);
  };

  return (
    <AnimatePresence>
      {!enabled && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-brand-ink/85 backdrop-blur-xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(60%_50%_at_50%_45%,color-mix(in_oklab,var(--album-primary)_55%,transparent),transparent_70%)]" />

          <motion.div
            className="relative mx-6 flex max-w-md flex-col items-center gap-7 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line-strong">
              <motion.span
                className="block h-6 w-6 rounded-full border-[3px] border-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="space-y-3">
              <span className="groove-rule mb-5 text-accent" aria-hidden>
                <span className="tick" />
                <span className="tick" />
                <span className="tick" />
                <span className="tick" />
              </span>
              <h1 className="display-lg text-brand-bone">Entrá al surco</h1>
              <p className="text-sm leading-relaxed text-brand-bone/65">
                Cada álbum pinta la interfaz con su color y suena de fondo. Activá el
                sonido para la experiencia completa — o entrá en silencio.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={enterWithSound} disabled={busy}>
                <Volume2 size={18} />
                {busy ? "Activando…" : "Entrar con sonido"}
              </Button>
              <Button size="lg" variant="secondary" onClick={enterSilent}>
                <VolumeX size={18} />
                Entrar en silencio
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
