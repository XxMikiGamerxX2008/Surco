import Link from "next/link";
import { sections, site } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-surface-2/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold tracking-[-0.04em]">{site.name}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-fg-muted">{site.tagline}.</p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-fg-muted">Explorar</p>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><Link href="/catalogo" className="transition-colors hover:text-fg">Catálogo completo</Link></li>
            <li><Link href="/carrito" className="transition-colors hover:text-fg">Carrito</Link></li>
          </ul>
        </div>

        <div className="space-y-3 sm:col-span-2 lg:col-span-2">
          <p className="eyebrow text-fg-muted">Secciones inmersivas</p>
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/album/${s.album.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-fg-muted transition-all hover:border-line-strong hover:text-fg"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: s.palette.accent }}
                  />
                  {s.artist.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5 text-center text-xs text-fg-muted/70">
        © 2026 {site.name} — demo de proyecto. Audio y carátulas con
        fines de demostración local.
      </div>
    </footer>
  );
}
