/**
 * Color math para el morph de paleta de SURCO.
 *
 * Interpolamos en espacio OKLab (carta perceptual de Björn Ottosson):
 * - pasos cromáticamente uniformes, independientes del paso por grises;
 * - ideal para transiciones entre paletas muy distintas (HMHAS → CC → IGOR);
 * - el hue de OKLCH sufría saltos de 360° en colores casi acromáticos (el
 *   blanco/negro de Crystal Castles); lerpear L/a/b cartesianos lo evita.
 */

export type OkLab = { l: number; a: number; b: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp01(v) * 255);
}

/** Convierte canales sRGB (0-255) a OKLab: sRGB linear → LMS. */
function rgbToOkLab(r255: number, g255: number, b255: number): OkLab {
  const rl = srgbToLinear(r255 / 255);
  const gl = srgbToLinear(g255 / 255);
  const bl = srgbToLinear(b255 / 255);

  // matriz sRGB linear → LMS
  const l_ = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl);
  const m_ = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl);
  const s_ = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl);

  return {
    l: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

/** Convierte `#rgb`/`#rrggbb` a OKLab. Devuelve `null` si no parsea. */
export function hexToOkLab(hex: string): OkLab | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;

  let r: number;
  let g: number;
  let b: number;
  if (m[1].length === 3) {
    const s = m[1];
    r = parseInt(s[0] + s[0], 16);
    g = parseInt(s[1] + s[1], 16);
    b = parseInt(s[2] + s[2], 16);
  } else {
    const v = parseInt(m[1], 16);
    r = (v >> 16) & 255;
    g = (v >> 8) & 255;
    b = v & 255;
  }

  return rgbToOkLab(r, g, b);
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

function parseNum(v: string): number {
  const pct = v.trim().endsWith("%");
  const n = parseFloat(v);
  return pct ? (n / 100) * 255 : n;
}

/**
 * Convierte cualquier color CSS devuelto por `getComputedStyle` a OKLab.
 * `@property` con `syntax: <color>` hace que el computed value sea una forma
 * RESUELTA (`rgb(255, 255, 255)`) y no el hex original — sin esto, el morph
 * volvía a `hexToOkLab(null)` y hacía snap en vez de interpolar.
 * Soporta `#hex`, `rgb()/rgba()` (comas o espacios/slash) y `color(srgb …)`.
 */
export function cssColorToOkLab(value: string): OkLab | null {
  const s = value.trim();
  if (s.startsWith("#")) return hexToOkLab(s);

  const m =
    /^rgba?\(\s*([\d.]+%?)\s*(?:,\s*|\s+)\s*([\d.]+%?)\s*(?:,\s*|\s+)\s*([\d.]+%?)/i.exec(
      s,
    );
  if (m) {
    return rgbToOkLab(
      clamp255(parseNum(m[1])),
      clamp255(parseNum(m[2])),
      clamp255(parseNum(m[3])),
    );
  }

  const srgb =
    /^color\(\s*srgb\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)/i.exec(s);
  if (srgb) {
    return rgbToOkLab(
      clamp255(parseNum(srgb[1])),
      clamp255(parseNum(srgb[2])),
      clamp255(parseNum(srgb[3])),
    );
  }

  return null;
}

/** Convierte OKLab a `#rrggbb`. */
export function okLabToHex({ l, a, b }: OkLab): string {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  return `#${[r, g, bl].map(linearToSrgb).map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function lerpOkLab(a: OkLab, b: OkLab, t: number): OkLab {
  return {
    l: a.l + (b.l - a.l) * t,
    a: a.a + (b.a - a.a) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}