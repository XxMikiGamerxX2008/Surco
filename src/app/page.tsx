import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { sections, site } from "@/lib/catalog";
import { ImmersiveSection } from "@/components/catalog/immersive-section";
import { AlbumCard } from "@/components/catalog/album-card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featured = sections.filter((s) => s.album.destacado);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 20% 25%, color-mix(in oklab, var(--album-primary) 70%, transparent), transparent 70%), radial-gradient(50% 45% at 85% 75%, color-mix(in oklab, var(--album-accent) 22%, transparent), transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border border-line opacity-40 sm:h-[36rem] sm:w-[36rem]"
          aria-hidden
        >
          <div className="absolute inset-[12%] rounded-full border border-line" />
          <div className="absolute inset-[30%] rounded-full border border-line" />
          <div className="absolute inset-[45%] rounded-full bg-accent/70" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 sm:px-10">
          <p className="eyebrow mb-6 text-accent">{site.name} · E-commerce inmersivo</p>
          <h1 className="display-xl max-w-4xl">
            El color del disco
            <br />
            <span className="text-accent">pinta la tienda.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {site.description} Cuatro secciones, cuatro atmósferas: la portada manda, el
            ambiente suena y el vinilo gira.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/catalogo" transitionTypes={["nav-forward"]}>
              <Button size="lg">Explorar catálogo</Button>
            </Link>
            <a
              href="#secciones"
              className="group flex items-center gap-2 font-display text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent">
                <ArrowDown size={16} />
              </span>
              Las 4 secciones
            </a>
          </div>
        </div>
      </section>

      {/* ---------- SECCIONES INMERSIVAS ---------- */}
      <div id="secciones" className="scroll-mt-20">
        {sections.map((section, i) => (
          <ImmersiveSection
            key={section.id}
            section={section}
            index={i}
            priority={i === 0}
          />
        ))}
      </div>

      {/* ---------- COLECCIÓN DESTACADA ---------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3 text-accent">Colección</p>
            <h2 className="display-lg">Discos en foco</h2>
          </div>
          <Link
            href="/catalogo"
            transitionTypes={["nav-forward"]}
            className="font-display text-sm text-fg-muted underline-offset-8 transition-colors hover:text-fg hover:underline"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((section, i) => (
            <AlbumCard key={section.id} section={section} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
