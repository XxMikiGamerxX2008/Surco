import type { Metadata } from "next";
import { ViewTransition } from "react";
import { displayFont, bodyFont } from "@/lib/fonts";
import { site, sections } from "@/lib/catalog";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AccessGate } from "@/components/audio/access-gate";
import { SectionObserver } from "@/components/effects/section-observer";
import "./globals.css";

const initial = sections[0].palette;

export const metadata: Metadata = {
  metadataBase: new URL("https://surco.example.com"),
  title: {
    default: `${site.name} — Vinilos que pintan la interfaz`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Tienda inmersiva de vinilos`,
    description: site.description,
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const initialPalette = {
    "--album-primary": initial.primary,
    "--album-secondary": initial.secondary,
    "--album-accent": initial.accent,
    "--album-surface": initial.surface,
    "--album-surface-2": initial.surface2,
    "--album-text": initial.textContrast,
  } as React.CSSProperties;

  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
      style={initialPalette}
      data-scroll-behavior="smooth"
    >
      <body className="grain flex min-h-full flex-col">
        <AccessGate />
        <Navbar />
        <SectionObserver />
        <main className="flex-1">
          <ViewTransition
            enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "content-fade" }}
            exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "content-fade" }}
            default="none"
          >
            {children}
          </ViewTransition>
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
