"use client";

import {
  cssColorToOkLab,
  easeInOutCubic,
  easeOutQuart,
  lerpOkLab,
  okLabToHex,
  type OkLab,
} from "./color";

/**
 * Morph de paleta en JS: lerp frame a frame en OKLab escribiendo las
 * variables `--album-*` en la raíz.
 *
 * Por qué JS y no CSS `transition`:
 *  - en esta máquina `prefers-reduced-motion: reduce` fuerza las transiciones
 *    CSS a ~0ms (globals.css), así que el morph nativo quedaba congelado;
 *  - un lerp por rAF escribe valores nuevos cada frame ⇒ avanza igual.
 *
 * Reduced-motion NO se traduce en snap: un cambio de color no es movimiento
 * vestibular, y el requisito del producto es "sin salto brusco". Bajo
 * `reduce` usamos un fade corto (350ms, easeOut) en vez del morph largo.
 *
 * Además del color, actualizamos `data-section`/`data-mood` al instante para
 * que los selectores que cuelgan del dataset no esperen a la animación.
 */

export const PALETTE_KEYS = [
  "--album-primary",
  "--album-secondary",
  "--album-accent",
  "--album-surface",
  "--album-surface-2",
  "--album-text",
] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Palette = Record<PaletteKey, string>;
export type PaletteMeta = { section?: string; mood?: string };

const MORPH_MS = 1200;
const REDUCED_MS = 350;

let raf = 0;
let timer = 0;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function readVar(key: PaletteKey): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(key)
    .trim();
}

function snap(target: Palette): void {
  const root = document.documentElement;
  for (const key of PALETTE_KEYS) {
    root.style.setProperty(key, target[key]);
  }
}

/**
 * Morph desde los valores actuales de `--album-*` hacia `target`.
 * Si algún color actual/target no es un hex parseable, aplica snap inmediato.
 */
export function morphPalette(target: Palette, meta?: PaletteMeta): void {
  const root = document.documentElement;
  if (meta?.section) root.dataset.section = meta.section;
  if (meta?.mood) root.dataset.mood = meta.mood;

  const from: OkLab[] = [];
  const to: OkLab[] = [];
  for (const key of PALETTE_KEYS) {
    const current = readVar(key) || target[key];
    // el computed value puede venir resuelto como rgb()/rgba()
    const fromLab = cssColorToOkLab(current);
    const toLab = cssColorToOkLab(target[key]);
    if (!fromLab || !toLab) {
      // no podemos interpolar → salto directo (cambio brusco puntual)
      snap(target);
      return;
    }
    from.push(fromLab);
    to.push(toLab);
  }

  cancelAnimationFrame(raf);
  window.clearTimeout(timer);

  const reduce = prefersReducedMotion();
  const duration = reduce ? REDUCED_MS : MORPH_MS;
  const ease = reduce ? easeOutQuart : easeInOutCubic;
  const start = performance.now();

  const write = (t: number) => {
    const c = ease(Math.min(t, 1));
    for (let i = 0; i < PALETTE_KEYS.length; i++) {
      root.style.setProperty(PALETTE_KEYS[i], okLabToHex(lerpOkLab(from[i], to[i], c)));
    }
  };

  const step = (now: number) => {
    const t = (now - start) / duration;
    if (t < 1) {
      write(t);
      raf = requestAnimationFrame(step);
    } else {
      write(1);
    }
  };

  raf = requestAnimationFrame(step);

  // red de seguridad: si rAF se congela (tab oculta), forzar el estado final
  timer = window.setTimeout(() => {
    cancelAnimationFrame(raf);
    write(1);
  }, duration + 240);
}

/** Aplica la paleta sin animar (montaje inicial / SSR). */
export function setPaletteInstantly(target: Palette, meta?: PaletteMeta): void {
  const root = document.documentElement;
  snap(target);
  if (meta?.section) root.dataset.section = meta.section;
  if (meta?.mood) root.dataset.mood = meta.mood;
}