"use client";

import Image from "next/image";

interface VinylPreviewProps {
  coverPath: string;
  accent: string;
  primary: string;
  surface: string;
}

/**
 * Portada + vinilo girando (Tier B del plan de calidad):
 *  - sin WebGL → corre a 60fps en gama media
 *  - composición de local: la funda se apoya al lado del vinilo, que rota en loop
 *  (El Tier A con Three.js es el reemplazo del mismo contrato.)
 */
export function VinylPreview({ coverPath, accent, primary, surface }: VinylPreviewProps) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className="relative mx-auto flex w-full max-w-md items-center justify-center gap-5 select-none sm:gap-7"
      style={{ perspective: "1200px" }}
    >
      {/* funda / portada */}
      <div
        className="relative aspect-square w-[46%] shrink-0 overflow-hidden rounded-md shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)]"
        style={{
          transform: "rotateY(-8deg) rotateX(3deg)",
          transformStyle: "preserve-3d",
          background: surface,
        }}
      >
        <Image
          src={coverPath}
          alt="Portada del álbum"
          fill
          sizes="(max-width: 768px) 46vw, 200px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
      </div>

      {/* vinilo girando */}
      <div
        className="relative aspect-square w-[42%] shrink-0"
        aria-label="Vinilo giratorio"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            transform: "rotateY(-16deg) rotateX(10deg)",
            transformStyle: "preserve-3d",
            background: `radial-gradient(circle at center,
              ${accent} 0 9%,
              #1a1a1a 9.5% 10.5%,
              #0c0c0c 11% 100%),
              repeating-radial-gradient(circle at center,
              rgba(255,255,255,0.055) 0 1px,
              transparent 1px 4px)`,
            boxShadow: "0 28px 64px -20px rgba(0,0,0,0.78)",
            animation: reduceMotion ? undefined : "preview-spin 4.5s linear infinite",
          }}
        >
          {/* label central chico */}
          <div
            className="absolute inset-[42%] overflow-hidden rounded-full border border-black/30"
            style={{ background: primary }}
          >
            <Image src={coverPath} alt="" fill sizes="80px" className="object-cover" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050505]" />
        </div>
      </div>

      <style>{`@keyframes preview-spin { from { rotate: 0deg } to { rotate: 360deg } }`}</style>
    </div>
  );
}