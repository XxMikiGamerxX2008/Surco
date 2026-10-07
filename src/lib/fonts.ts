import localFont from "next/font/local";

/**
 * SURCO — sistema tipográfico
 *   - Unbounded (variable 200–900): voz de póster/vinyl para display y títulos.
 *   - Inter (variable 100–900): cuerpo de lectura y UI.
 * Dos familias claramente distintas; ningún peso default "tech sans".
 */
export const displayFont = localFont({
  src: "../fonts/unbounded-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "200 900",
  display: "swap",
});

export const bodyFont = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});