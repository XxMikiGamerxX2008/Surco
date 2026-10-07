"use client";

/**
 * AmbientAudioEngine — motor centralizado de audio ambiental.
 *
 * Reglas del spec:
 *  - Un SOLO motor (nunca <audio> por componente).
 *  - Fades vía GainNode de Web Audio (no la propiedad volume del elemento).
 *  - Dos elementos A/B para crossfade de sección sin cortes.
 *  - Respeta autoplay: solo arranca tras gesto del usuario (enable()).
 *  - Mute global desde la navbar sin destruir el estado.
 *  - Pausa con fade al ocultar la pestaña.
 */

import { useAudioStore } from "@/stores/audio.store";

const dbToGain = (db: number) => Math.pow(10, db / 20);

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private gains: [GainNode, GainNode] | null = null;
  private elements: [HTMLAudioElement, HTMLAudioElement] | null = null;
  private active = 0;
  private currentSrc: string | null = null;
  private currentGainDb = -15;
  private master = 1;
  private fadeMs = 750;
  private listenersBound = false;

  get ready() {
    return this.ctx !== null && this.elements !== null;
  }

  /** Debe invocarse dentro de un gesto del usuario (gate de acceso). */
  async enable() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();

      const make = () => {
        const el = new Audio();
        el.loop = true;
        el.preload = "auto";
        el.crossOrigin = "anonymous";
        return el;
      };
      const a = make();
      const b = make();
      this.elements = [a, b];
      this.gains = [
        this.ctx.createGain(),
        this.ctx.createGain(),
      ];
      this.gains[0].gain.value = 0;
      this.gains[1].gain.value = 0;

      for (const [i, el] of [a, b].entries()) {
        const src = this.ctx.createMediaElementSource(el);
        src.connect(this.gains[i]);
        this.gains[i].connect(this.ctx.destination);
      }

      if (!this.listenersBound) {
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) this.fadeAllTo(0, 300, true);
          else if (useAudioStore.getState().enabled) this.restore();
        });
        this.listenersBound = true;
      }
    }

    if (this.ctx.state === "suspended") await this.ctx.resume();
    useAudioStore.getState().setEnabled(true);
    this.applyMute();

    if (this.currentSrc) {
      const el = this.elements![this.active];
      if (!el.src.endsWith(this.currentSrc)) el.src = this.currentSrc;
      try {
        await el.play();
      } catch {
        /* el navegador puede requerir otro gesto; el chip de audio lo reintenta */
      }
      this.gains![this.active].gain.value = 0;
      this.applyMute();
    }
  }

  setMuted(muted: boolean) {
    useAudioStore.getState().setMuted(muted);
    this.applyMute();
  }

  private applyMute() {
    if (!this.ready) return;
    const { muted, enabled } = useAudioStore.getState();
    const target = enabled && !muted ? 1 : 0;
    for (const g of this.gains!) {
      this.ramp(g, target === 0 ? 0 : undefined);
    }
    if (target === 1) {
      this.ramp(this.gains![this.active], dbToGain(this.currentGainDb) * this.master);
    }
  }

  /**
   * Cambia la pista ambiental con crossfade. `src === null` apaga con fade.
   * Idempotente: si ya suena esa pista, no hace nada.
   */
  async setTrack(src: string | null, gainDb: number, meta?: { title: string; artist: string }) {
    const store = useAudioStore.getState();
    if (src === this.currentSrc) return;
    this.currentSrc = src;
    this.currentGainDb = gainDb;

    if (!this.ready) {
      // aún no pasó el gate: solo registramos la pista pendiente
      store.setActive(src, meta ?? null);
      return;
    }

    const [a, b] = this.elements!;
    const [ga, gb] = this.gains!;
    const prev = this.active;
    const next = 1 - this.active;
    const el = next === 0 ? a : b;
    const gain = next === 0 ? ga : gb;
    const mutedOrDisabled = !store.enabled || store.muted;

    // fade out del actual
    this.ramp(prev === 0 ? ga : gb, 0);
    const prevEl = prev === 0 ? a : b;
    window.setTimeout(() => {
      if (this.active !== prev) prevEl.pause();
    }, this.fadeMs + 60);

    if (!src) {
      store.setActive(null, null);
      return;
    }

    store.setTransitioning(true);
    el.src = src;
    el.currentTime = 0;
    try {
      await el.play();
    } catch {
      store.setTransitioning(false);
      return;
    }
    this.active = next;
    if (!mutedOrDisabled) {
      gain.gain.value = 0;
      this.ramp(gain, dbToGain(gainDb) * this.master);
    }
    store.setActive(src, meta ?? null);
    window.setTimeout(() => store.setTransitioning(false), this.fadeMs);
  }

  /** Reanuda la pista activa tras volver a la pestaña. */
  private async restore() {
    if (!this.ready || !this.currentSrc) return;
    const el = this.elements![this.active];
    try {
      await el.play();
    } catch {
      return;
    }
    this.applyMute();
  }

  private fadeAllTo(value: number, _ms: number, pauseAfter: boolean) {
    if (!this.ready) return;
    for (const g of this.gains!) this.ramp(g, value);
    if (pauseAfter) {
      const el = this.elements![this.active];
      window.setTimeout(() => el.pause(), 350);
    }
  }

  private ramp(gain: GainNode, target?: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const value = target ?? 0;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(value, t + this.fadeMs / 1000);
  }
}

/** Instancia única (singleton) del motor. */
export const ambientAudio = new AmbientAudioEngine();
