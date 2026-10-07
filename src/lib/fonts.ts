import localFont from "next/font/local";

export const displayFont = localFont({
  src: "../fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "300 700",
  display: "swap",
});

export const bodyFont = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});
